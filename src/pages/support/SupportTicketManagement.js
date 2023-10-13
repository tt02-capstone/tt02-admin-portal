import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {getAllSupportTickets} from "../../redux/supportTicketRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewSupportTicketModal from "./ViewSupportTicketModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

export default function SupportTicketManagement() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const admin = JSON.parse(localStorage.getItem("user"));

    const [getSupportTicketsData, setGetSupportTicketsData] = useState(true);
    const [supportTicketsData, setSupportTicketsData] = useState([]);
    const [selectedSupportTicketId, setSelectedSupportTicketId] = useState(null);
    const [selectedSupportTicket, setSelectedSupportTicket] = useState([]);

    const viewSupportTicketBreadCrumb = [
        {
            title: 'SupportTicket',
        }
    ];

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const supportTicketsColumns = [
        {
            title: 'Id',
            dataIndex: 'support_ticket_id',
            key: 'support_ticket_id',
            sorter: (a, b) => a.support_ticket_id.localeCompare(b.support_ticket_id),
            ...getColumnSearchProps('support_ticket_id'),
        },
        {
            title: 'Created Time',
            dataIndex: 'created_time',
            key: 'created_time',
            sorter: (a, b) => new Date(a.created_time) > new Date(b.created_time),
            ...getColumnSearchProps('created_time'),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_time',
            key: 'updated_time',
            sorter: (a, b) => new Date(a.updated_time) > new Date(b.updated_time),
            ...getColumnSearchProps('updated_time'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
            width:300
        },
        {
            title: 'Is Resolved',
            dataIndex: 'is_resolved',
            key: 'is_resolved',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width:100
        },
        {
            title: 'Category',
            dataIndex: 'ticket_category',
            key: 'ticket_category',
            sorter: (a, b) => a.ticket_category.localeCompare(b.ticket_category),
            ...getColumnSearchProps('ticket_category'),
            render: (ticket_category) => {
                let tagColor = 'default';
                switch (ticket_category) {
                    case 'REFUND':
                        tagColor = 'purple';
                        break;
                    case 'CANCELLATION':
                        tagColor = 'volcano';
                        break;
                    case 'GENERAL_ENQUIRY':
                        tagColor = 'geekblue';
                        break;
                    // still got more
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{ticket_category}</Tag>
                );
            }
        },
        
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            render: (priceTier) => {
                let tagColor = 'default';
                switch (priceTier) {
                    case 'TIER 1':
                        tagColor = 'green';
                        break;
                    case 'TIER 2':
                        tagColor = 'orange';
                        break;
                    case 'TIER 3':
                        tagColor = 'red';
                        break;
                    case 'TIER 4':
                        tagColor = 'blue';
                        break;
                    case 'TIER 5':
                        tagColor = 'yellow';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{priceTier}</Tag>
                );
            },
            sorter: (a, b) => {
                const tierA = a.estimated_price_tier || '';
                const tierB = b.estimated_price_tier || '';
            
                return tierA.localeCompare(tierB);
              },
            width: 100,
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="vertical">
                            <CustomButton
                                text="View Details"
                                style={{fontWeight: "bold", fontSize: 12}}
                                onClick={() => onClickOpenViewSupportTicketModal(record.supportTicket_id)}
                            />
                        </Space>
                    </div>
                </div>

            },
            width: 160,
        },
    ];

    function formatSupportTicketData(supportTicketDataArray) {
        return supportTicketDataArray.map(item => {
            // const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
            // const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            // const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
            const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;
            const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');

            return {
                supportTicket_id: item.supportTicket_id,
                name: item.name,
                description: item.description,
                address: item.address,
                // contact_num: formattedContactNum,
                contact_num: item.contact_num,
                supportTicket_image_list: item.supportTicket_image_list,
                is_published: item.is_published,
                check_in_time: item.check_in_time,
                check_out_time: item.check_out_time,
                type: item.type,
                generic_location: item.generic_location,
                estimated_price_tier: item.estimated_price_tier,
                // generic_location: formattedGenericLocation,
                estimated_price_tier: formattedPriceTier,
            };
        });
    }

    useEffect(() => {
        if (getSupportTicketsData) {
            const fetchData = async () => {
                const response = await getAllSupportTickets();
                console.log('response:', response);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setSupportTicketsData(tempData);
                    setGetSupportTicketsData(false);
                } else {
                    console.log("List of supportTickets not fetched!");
                }
            }

            fetchData();
            setGetSupportTicketsData(false);
        }
    }, [getSupportTicketsData]);
    
    // view attraction
    const [isViewSupportTicketModalOpen, setIsViewSupportTicketModalOpen] = useState(false);

    //view attraction modal open button
    function onClickOpenViewSupportTicketModal(supportTicketId) {
        setSelectedSupportTicketId(supportTicketId);
        setIsViewSupportTicketModalOpen(true);

    }

    // view attraction modal cancel button
    function onClickCancelViewSupportTicketModal() {
        setIsViewSupportTicketModalOpen(false);
    }

    useEffect(() => {
    }, [selectedSupportTicket, selectedSupportTicketId, supportTicketsData])

    return admin ? (
            <div>
                <Layout style={styles.layout}>
                    <CustomHeader items={viewSupportTicketBreadCrumb} />
                    <Layout style={{ padding: '0 24px 24px' , backgroundColor:'white'}}>
                        <Content style={styles.content}>

                            <CustomTablePagination
                                title="SupportTickets"
                                column={supportTicketsColumns}
                                data={formatSupportTicketData(supportTicketsData)}
                                tableLayout="fixed"
                            />

                            <ViewSupportTicketModal
                                isViewSupportTicketModalOpen={isViewSupportTicketModalOpen}
                                onClickCancelViewSupportTicketModal={onClickCancelViewSupportTicketModal}
                                supportTicketId={selectedSupportTicketId}
                            />

                        </Content>
                    </Layout>
                </Layout>

                <ToastContainer />
            </div>
        ) :
        (
            <Navigate to="/" />
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
        marginTop: -10
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