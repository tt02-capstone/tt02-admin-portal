import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Button, Badge, Space, Tag, List, Avatar, Select, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import { toast, ToastContainer } from "react-toastify";
import CustomButton from "../../components/CustomButton";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllSupportTickets, getAllSupportTicketsByAdmin, updateSupportTicketStatus, getUserAvatarImage } from "../../redux/supportRedux";
import { LikeOutlined, MessageOutlined, StarOutlined, ClearOutlined, EyeOutlined } from '@ant-design/icons';
import moment from "moment";
import MessageBox from "./MessageBox";

const Search = Input.Search;

export default function SupportTicketManagement() {

    const navigate = useNavigate();
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const admin = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm();
    const [adminSearchText, setAdminSearchText] = useState('');
    const [fullSearchText, setFullSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [adminSupportTicketList, setAdminSupportTicketList] = useState([]);
    const [fetchAdminSupportTicketList, setFetchAdminSupportTicketList] = useState(true);

    const [fullSupportTicketList, setFullSupportTicketList] = useState([]);
    const [fetchFullSupportTicketList, setFetchFullSupportTicketList] = useState(true);

    const viewUserSupportBreadCrumb = [
        {
            title: 'Support Ticket Management',
        }
    ];

    const getNameForSupportTicket = (item) => {

        const submittedUser = item.submitted_user.charAt(0).toUpperCase() + item.submitted_user.slice(1).toLowerCase();
        const ticketType = item.ticket_type.charAt(0).toUpperCase() + item.ticket_type.slice(1).toLowerCase();

        if (item.submitted_user === 'VENDOR_STAFF') {
            return 'Enquiry from Vendor to ' + ticketType;
        } else {
            return 'Enquiry from ' + submittedUser + ' to ' + ticketType;
        }
    };

    const [viewReplySection, setViewReplySection] = useState(false);
    const [currSupportTicket, setCurrSupportTicket] = useState('');
    const handleSendMessage = (item) => {
        console.log("Curr item ", item.key)
        setViewReplySection(!viewReplySection)
        setCurrSupportTicket((prevTicket) => item.key);
    };

    useEffect(() => {
        if (admin && admin.user_type === 'INTERNAL_STAFF' && fetchAdminSupportTicketList) {
            const fetchData = async () => {
                console.log("admin.user_id", admin.user_id)
                const response = await getAllSupportTicketsByAdmin(admin.user_id);
                console.log(response)
                if (response.status) {
                    const tempData = await Promise.all(
                        response.data.map(async (val) => {
                            const response = await getUserAvatarImage(val.submitted_user_id);
                            return {
                                ...val,
                                reply_list: val.reply_list,
                                is_resolved: val.is_resolved,
                                ticket_category: val.ticket_category,
                                ticket_type: val.ticket_type,
                                start_datetime: moment(val.created_time).format('llll'),
                                description: val.description,
                                key: val.support_ticket_id,
                                title: getNameForSupportTicket(val),
                                submitted_user_name: val.submitted_user_name,
                                avatar: response.data
                            };
                        })
                    );

                    tempData.sort((a, b) => {
                        const momentA = moment(a.start_datetime);
                        const momentB = moment(b.start_datetime);

                        if (momentA.isBefore(momentB)) {
                            return 1; // If momentA is earlier, put it after momentB
                        } else if (momentA.isAfter(momentB)) {
                            return -1; // If momentA is later, put it before momentB
                        } else {
                            // If the moments are the same, compare by created_time (time component)
                            return moment(b.created_time).diff(moment(a.created_time));
                        }
                    });

                    console.log(tempData)
                    setAdminSupportTicketList(tempData);
                    setFetchAdminSupportTicketList(false);
                } else {
                    console.log("User Ticket list not fetched!");
                }
            }

            fetchData();
        }

        if (admin && admin.user_type === 'INTERNAL_STAFF' && fetchFullSupportTicketList) {
            const fetchData = async () => {
                const response = await getAllSupportTickets();
                console.log(response)
                if (response.status) {
                    const tempData = await Promise.all(
                        response.data.map(async (val) => {
                            const response = await getUserAvatarImage(val.submitted_user_id);
                            return {
                                ...val,
                                reply_list: val.reply_list,
                                is_resolved: val.is_resolved,
                                ticket_category: val.ticket_category,
                                ticket_type: val.ticket_type,
                                start_datetime: moment(val.created_time).format('llll'),
                                description: val.description,
                                key: val.support_ticket_id,
                                title: getNameForSupportTicket(val),
                                submitted_user_name: val.submitted_user_name,
                                avatar: response.data
                            };
                        })
                    );

                    tempData.sort((a, b) => {
                        const momentA = moment(a.start_datetime);
                        const momentB = moment(b.start_datetime);

                        if (momentA.isBefore(momentB)) {
                            return 1; // If momentA is earlier, put it after momentB
                        } else if (momentA.isAfter(momentB)) {
                            return -1; // If momentA is later, put it before momentB
                        } else {
                            // If the moments are the same, compare by created_time (time component)
                            return moment(b.created_time).diff(moment(a.created_time));
                        }
                    });

                    console.log(tempData)
                    setFullSupportTicketList(tempData);
                    setFetchFullSupportTicketList(false);
                } else {
                    console.log("User Ticket list not fetched!");
                }
            }

            fetchData();
        }
    }, [admin, fetchAdminSupportTicketList, fetchFullSupportTicketList]);

    const toggleFetchUserListAdmin = () => {
        setFetchAdminSupportTicketList(true)
    }

    const toggleFetchUserListFull = () => {
        setFetchFullSupportTicketList(true)
    }

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}

        </Space>
    );

    const categoryColorMap = {
        REFUND: 'red',
        CANCELLATION: 'blue',
        GENERAL_ENQUIRY: 'purple',
        BOOKING: 'gold',
        DEAL: 'cyan',
        RESTAURANT: 'magenta',
        ATTRACTION: 'orange',
        TELECOM: 'volcano',
        ACCOMMODATION: 'lime',
        TOUR: 'geekblue',
    };

    const getColorForCategory = (category) => {
        const color = categoryColorMap[category] || 'gray';
        const formattedCategory = category.replace('_', ' ');
        return { color, formattedCategory };
    };

    const AdminSupportTicket = () => (
        <List
            itemLayout="horizontal"
            size="small"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            bordered={true}
            dataSource={adminSupportTicketList}
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <span>
                            <Tag color={getColorForCategory(item.ticket_category).color}>
                                {getColorForCategory(item.ticket_category).formattedCategory}
                            </Tag>
                        </span>,
                        <span style={{ width: '70px', display: 'inline-block' }}> {item.is_resolved === true ? (<Tag color="red">CLOSED</Tag>) : (<Tag color="green">OPEN</Tag>)}</span>,
                        <span style={{ width: '230px', display: 'inline-block' }}>
                            <IconText icon={CalendarOutlined} text={item.start_datetime} />
                        </span>,
                        <span>
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                onClick={() => handleSendMessage(item)}
                                style={{ marginRight: '8px' }}
                            >
                                View
                            </Button>
                            {/* <Button
                                type="primary"
                                onClick={() => handleTicketStatus(item)}
                                style={{ backgroundColor: item.is_resolved ? "#1da31d" : "#db2c45", fontWeight: 'bold', width: '125px', marginLeft: '5px', height: '34px' }}
                            >
                                {item.is_resolved ? "Reopen Ticket" : "Close Ticket"}
                            </Button> */}
                        </span>

                    ]}
                >

                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{`#${item.support_ticket_id} - ${item.submitted_user_name}`}</a>}
                        description={<span>{item.title}</span>}
                    />
                    {item.description}

                </List.Item>
            )}
        />
    )

    const FullSupportTicket = () => (
        <List
            itemLayout="horizontal"
            size="small"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            bordered={true}
            dataSource={fullSupportTicketList}
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <span>
                            <Tag color={getColorForCategory(item.ticket_category).color}>
                                {getColorForCategory(item.ticket_category).formattedCategory}
                            </Tag>
                        </span>,
                        <span style={{ width: '70px', display: 'inline-block' }}> {item.is_resolved === true ? (<Tag color="red">CLOSED</Tag>) : (<Tag color="green">OPEN</Tag>)}</span>,
                        <span style={{ width: '230px', display: 'inline-block' }}>
                            <IconText icon={CalendarOutlined} text={item.start_datetime} />
                        </span>,
                        <span>
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                onClick={() => handleSendMessage(item)}
                                style={{ marginRight: '8px' }}
                            >
                                View
                            </Button>
                            {/* <Button
                                type="primary"
                                onClick={() => handleTicketStatus(item)}
                                style={{ backgroundColor: item.is_resolved ? "#1da31d" : "#db2c45", fontWeight: 'bold', width: '125px', marginLeft: '5px', height: '34px' }}
                            >
                                {item.is_resolved ? "Reopen Ticket" : "Close Ticket"}
                            </Button> */}
                        </span>

                    ]}
                >

                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{`#${item.support_ticket_id} - ${item.submitted_user_name}`}</a>}
                        description={<span>{item.title}</span>}
                    />
                    {item.description}

                </List.Item>
            )}
        />
    )

    const handleAdminSearch = (searchText) => {
        const filteredEvents = adminSupportTicketList.filter(({ description }) => {
            description = description.toLowerCase();
            console.log(description);
            return description.includes(adminSearchText);
        });

        setAdminSupportTicketList(filteredEvents);
    };

    const handleFullSearch = (searchText) => {
        const filteredEvents = fullSupportTicketList.filter(({ description }) => {
            console.log(description);
            description = description.toLowerCase();
            return description.includes(fullSearchText);
        });

        setFullSupportTicketList(filteredEvents);
    };


    const resetAdminSearch = () => {
        setAdminSearchText('');
        setFetchAdminSupportTicketList(true);
    };

    const resetFullSearch = () => {
        setFullSearchText('');
        setFetchFullSupportTicketList(true);
    };

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={viewUserSupportBreadCrumb} />
            <Layout style={{ padding: '0 24px 24px', backgroundColor: 'white' }}>
                <Content style={styles.content}>
                    <Tabs defaultActiveKey="supportTicket" onChange={() => { }}>
                        <TabPane tab="Tickets to Admin" key="adminTicketList">
                            <div>
                                <Input
                                    placeholder="Search description"
                                    value={adminSearchText}
                                    onChange={(e) => setAdminSearchText(e.target.value)}
                                    style={{ width: 200 }}
                                />
                                <Button type="primary" onClick={handleAdminSearch} style={{ marginLeft: '5px' }}> Search </Button>
                                <Button type="primary" onClick={resetAdminSearch} style={{ marginLeft: '5px', backgroundColor: 'slategray' }}> Clear </Button>

                                <br /><br />
                                {AdminSupportTicket()}
                                <br /><br />

                                {viewReplySection ?
                                    <MessageBox
                                        supportTicketId={currSupportTicket}
                                        toggleFetchUserListAdmin={toggleFetchUserListAdmin}
                                    /> : null
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="All Tickets" key="fullTicketList">
                            <div>
                                <Input
                                    placeholder="Search description"
                                    value={fullSearchText}
                                    onChange={(e) => setFullSearchText(e.target.value)}
                                    style={{ width: 200 }}
                                />
                                <Button type="primary" onClick={handleFullSearch} style={{ marginLeft: '5px' }}> Search </Button>
                                <Button type="primary" onClick={resetFullSearch} style={{ marginLeft: '5px', backgroundColor: 'slategray' }}> Clear </Button>

                                <br /><br />
                                {FullSupportTicket()}
                                <br /><br />

                                {viewReplySection ?
                                    <MessageBox
                                        supportTicketId={currSupportTicket}
                                        toggleFetchUserListFull={toggleFetchUserListFull}
                                    /> : null
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                </Content>
            </Layout>
            <ToastContainer />
        </Layout>

    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '91.5vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%",
        marginTop: '-5px'
    },
    customRow: {
        height: '280px',
    },
    imageContainer: {
        maxWidth: '180px',
        maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}