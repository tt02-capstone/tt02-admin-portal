import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { retrieveAllBookings } from "../../redux/bookingRedux";
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ViewBookingModal from "./ViewBookingModal";

export default function BookingManagement() {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { Content } = Layout;
    const user = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
          title: 'Bookings',
        },
    ];

    // view booking modal
    const [viewBookingModal, setViewBookingModal] = useState(false);
    const [viewBookingId, setViewBookingId] = useState();

    // table
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

    const column = [
        {
            title: 'Id',
            dataIndex: 'booking_id',
            key: 'booking_id',
            sorter: (a, b) => a.booking_id > b.booking_id,
            ...getColumnSearchProps('booking_id'),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => {
                const customerName = record.tourist_user
                    ? record.tourist_user.name
                    : record.local_user
                    ? record.local_user.name
                    : '';
        
                return customerName;
            },
            sorter: (a, b) => {
                const nameA = a.tourist_user ? a.tourist_user.name : a.local_user ? a.local_user.name : '';
                const nameB = b.tourist_user ? b.tourist_user.name : b.local_user ? b.local_user.name : '';
        
                return nameA.localeCompare(nameB);
            },
            // ...getColumnSearchProps('customerName')
        },
        {
            title: 'Customer Type',
            dataIndex: 'customerType',
            key: 'customerType',
            render: (text, record) => {
              if (record.tourist_user) {
                return 'Tourist';
              } else if (record.local_user) {
                return 'Local';
              } else {
                return '';
              }
            },
            sorter: (a, b) => {
                const getTypeValue = (record) => {
                    if (record.tourist_user) {
                        return 1; // Tourist
                    } else if (record.local_user) {
                        return 2; // Local
                    } else {
                        return 0; 
                    }
                };
        
                const typeA = getTypeValue(a);
                const typeB = getTypeValue(b);
        
                return typeA - typeB;
            },
            // ...getColumnSearchProps('customerType')
          }, 
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            onFilter: (value, record) => record.type === value,
            render: (type) => {
                let color = '';
                switch (type) {
                    case 'ACCOMMODATION':
                        color = 'green';
                        break;
                    case 'TELECOM':
                        color = 'orange';
                        break;
                    case 'ATTRACTION':
                        color = 'red';
                        break;
                    case 'TOUR':
                        color = 'blue';
                        break;
                }

                return <Tag color={color}>{type}</Tag>;
            },
        },
        {
            title: 'Activity Name',
            dataIndex: 'activity_name',
            key: 'activity_name',
            sorter: (a, b) => a.activity_name.localeCompare(b.activity_name),
            ...getColumnSearchProps('activity_name'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'UPCOMING':
                        color = 'processing';
                        break;
                    case 'ONGOING':
                        color = 'warning';
                        break;
                    case 'COMPLETED':
                        color = 'success';
                        break;
                    case 'CANCELLED':
                        color = 'error';
                        break;
                }

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            render: (lastUpdate) => {
                const dateObj = new Date(lastUpdate);
                const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.toLocaleTimeString()}`;
                return formattedDate;
            },
            sorter: (a, b) => {
                // Extract the underlying date values for 'a' and 'b'
                const dateA = new Date(a.last_update).getTime();
                const dateB = new Date(b.last_update).getTime();
        
                // Compare the date values for sorting
                return dateA - dateB;
            },
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment',
            key: 'payment',
            onFilter: (value, record) => record.is_paid === value,
            render: (payment) => {
                let color = '';
                if (payment && payment.is_paid) {
                    color = 'green';
                } else {
                    color = 'red';
                }

                return <Tag color={color}>{payment ? (payment.is_paid ? 'PAID' : 'UNPAID') : 'N/A'}</Tag>;
            },
            sorter: (a, b) => {
                const isPaidA = (a.payment && a.payment.is_paid) || false; 
                const isPaidB = (b.payment && b.payment.is_paid) || false; 
        
                return isPaidA - isPaidB;
            },
            // missing search
        },
        {
            title: 'Amount Earned',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => {
                return `$${(payment.payment_amount * (payment.comission_percentage)).toFixed(2)}`
            },
        },
        {
            title: 'Action(s)',
            dataIndex: 'booking_id',
            key: 'booking_id',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <CustomButton key='1' text="View" onClick={() => onOpenViewModal(record.booking_id)} style={{marginRight: '10px'}} />
                </div>
            ),
        }
    ];

    // fetch booking list
    const [bookingList, setBookingList] = useState([]);
    const [fetchBookingList, setFetchBookingList] = useState(true);

    useEffect(() => {
        if (fetchBookingList) {
            const fetchData = async () => {
                const response = await retrieveAllBookings(); // stackoverflowing sigh
                console.log("response.data", response.data);
                if (response.status) {
                    setBookingList(response.data);
                    setFetchBookingList(false);
                } else {
                    console.log("Booking list not fetched!");
                }
            }
    
            fetchData();
        }
    },[fetchBookingList]);

    // open view modal
    function onOpenViewModal(id) {
        setViewBookingId(id);
        setViewBookingModal(true);
    }

    // close view modal
    function onCancelViewModal() {
        setViewBookingModal(false);
    }

    return user ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={breadcrumbItems}/>
                <Content style={styles.content}>
                    <CustomTablePagination column={column} data={bookingList} rowKey="booking_id" tableLayout={"fixed"}/>

                    {/* Modal to view booking */}
                    <ViewBookingModal
                        selectedBookingId={viewBookingId}
                        viewBookingModal={viewBookingModal}
                        onCancelViewModal={onCancelViewModal}
                    />
                </Content>
            </Layout>
        </div>
    ) : (
        <Navigate to="/" />
    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
}