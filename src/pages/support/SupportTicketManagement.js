import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Button, Badge, Space, Tag, List, Avatar, Select, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import { toast, ToastContainer } from "react-toastify";
import CustomButton from "../../components/CustomButton";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllSupportTickets, getAllSupportTicketsByAdmin } from "../../redux/supportRedux";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import moment from "moment";
import MessageBox from "./MessageBox";

const Search = Input.Search;

export default function SupportTicketManagement() {

    const navigate = useNavigate();
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const admin = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm();

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
        return 'Enquiry from ' + item.submitted_user + ' to ' + item.ticket_category;
    }

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
                    var tempData = response.data.map((val) => ({
                        ...val,
                        reply_list: val.reply_list,
                        is_resolved: val.is_resolved,
                        ticket_category: val.ticket_category,
                        ticket_type: val.ticket_type,
                        start_datetime: moment(val.created_time).format('llll'),
                        description: val.description,
                        key: val.support_ticket_id,
                        title: getNameForSupportTicket(val),
                        avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${val.support_ticket_id}`
                    }));

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
                    var tempData = response.data.map((val) => ({
                        ...val,
                        reply_list: val.reply_list,
                        is_resolved: val.is_resolved,
                        ticket_category: val.ticket_category,
                        ticket_type: val.ticket_type,
                        start_datetime: moment(val.created_time).format('llll'),
                        description: val.description,
                        key: val.support_ticket_id,
                        title: getNameForSupportTicket(val),
                        avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${val.support_ticket_id}`
                    }));

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
                        <IconText icon={CalendarOutlined} text={item.start_datetime} />,
                        <Button
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => handleSendMessage(item)}
                        />

                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{item.title}</a>}
                    />
                    {item.description}
                    {/*/!*{}*!/ //Add toggle here for is resolved*/}

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
                        <IconText icon={CalendarOutlined} text={item.start_datetime} />,
                        <Button
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => handleSendMessage(item)}
                        />

                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{item.title}</a>}
                    />
                    {item.description}
                    {/*/!*{}*!/ //Add toggle here for is resolved*/}

                </List.Item>
            )}
        />
    )


    const TitleSearch = ({ onSearch, ...props }) => (
        <div {...props}>
            <Search
                allowClear
                placeholder="Search description"
                onSearch={onSearch}
                style={{ width: 200 }}
            />
        </div>
    );

    const handleSearch = (searchText, event) => {
        event.preventDefault();
        const filteredEvents = adminSupportTicketList.filter(({ description }) => {
            console.log(description)
            description = description.toLowerCase();
            return description.includes(searchText);
        });

        // change depending on which list
        setAdminSupportTicketList(filteredEvents)
    };

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={viewUserSupportBreadCrumb} />
            <Layout style={{ padding: '0 24px 24px', backgroundColor: 'white' }}>
                <Content style={styles.content}>
                    <Tabs defaultActiveKey="supportTicket" onChange={() => { }}>
                        <TabPane tab="Tickets to Admin" key="adminTicketList">
                            <div>
                                <TitleSearch onSearch={handleSearch} />

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
                                <TitleSearch onSearch={handleSearch} />

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