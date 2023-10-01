import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Menu, Table } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { retrieveAllBookings } from "../../redux/bookingRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewBookingModal from "./ViewBookingModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

export default function BookingManagement() {

    const navigate = useNavigate();
    const vendor = JSON.parse(localStorage.getItem("user"));

    const [getBookingsData, setGetBookingsData] = useState(true);
    const [bookingsData, setBookingsData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const viewBookingBreadCrumb = [
        {
          title: 'Bookings',
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

    const bookingsColumns = [
        {
            title: 'Id',
            dataIndex: 'booking_id',
            key: 'booking_id',
            sorter: (a, b) => a.booking_id > b.booking_id,
            ...getColumnSearchProps('booking_id'),
        },
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name > b.name,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Customer Type',
            dataIndex: 'booked_user',
            key: 'booked_user',
            filters: [
                {
                    text: 'Local',
                    value: 'LOCAL',
                },
                {
                    text: 'Tourist',
                    value: 'TOURIST',
                },
            ],
            onFilter: (value, record) => record.booked_user === value,
            render: (text, record) => {
              if (text === 'LOCAL') {
                return <Tag color='success'>Local</Tag>;
              } else if (text === 'TOURIST') {
                return <Tag color='error'>Tourist</Tag>;
              } else {
                return 'Bug';
              }
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                {
                    text: 'Accommodation',
                    value: 'ACCOMMODATION',
                },
                {
                    text: 'Telecom',
                    value: 'TELECOM',
                },
                {
                    text: 'Attraction',
                    value: 'ATTRACTION',
                },
                {
                    text: 'Tour',
                    value: 'TOUR',
                },
            ],
            onFilter: (value, record) => record.type === value,
            render: (text, record) => {
                let color = '';
                let value = '';
                switch (text) {
                    case 'ACCOMMODATION':
                        color = 'processing';
                        value = 'Accommodation';
                        break;
                    case 'TELECOM':
                        color = 'warning';
                        value = 'Telecom';
                        break;
                    case 'ATTRACTION':
                        color = 'success';
                        value = 'Attraction';
                        break;
                    case 'TOUR':
                        color = 'error';
                        value = 'Tour';
                        break;
                }

                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: 'Activity',
            dataIndex: 'activity_name',
            key: 'activity_name',
            render: (text, record) => {
                console.log("text", text);
                console.log("record", record);
                return record.activity_name;
            },
            sorter: (a, b) => a.activity_name > b.activity_name,
            ...getColumnSearchProps('activity_name'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Upcoming',
                    value: 'UPCOMING',
                },
                {
                    text: 'Ongoing',
                    value: 'ONGOING',
                },
                {
                    text: 'Completed',
                    value: 'COMPLETED',
                },
                {
                    text: 'Cancelled',
                    value: 'CANCELLED',
                },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = 'default';
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
            sorter: (a, b) => new Date(a.last_update) > new Date(b.last_update),
            ...getColumnSearchProps('last_update'),
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment',
            key: 'payment',
            filters: [
                {
                    text: 'Paid',
                    value: true,
                },
                {
                    text: 'Unpaid',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.payment.is_paid === value,
            render: (payment) => {
                let color = '';
                if (payment && payment.is_paid) {
                    color = 'green';
                } else {
                    color = 'red';
                }

                return <Tag color={color}>{payment ? (payment.is_paid ? 'Paid' : 'Unpaid') : 'N/A'}</Tag>;
            },
        },
        {
            title: 'Amount Earned',
            dataIndex: 'payment_amount',
            key: 'payment_amount',
            sorter: (a, b) => a.payment_amount > b.payment_amount,
            ...getColumnSearchProps('payment_amount'),
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <Space>
                    <CustomButton
                        text="View"
                        onClick={() => onClickOpenViewBookingModal(record.booking_id)}
                    />
                </Space>
            }
        },
    ];

    useEffect(() => {
        if (getBookingsData) {
            const fetchData = async () => {
                const response = await retrieveAllBookings();
                console.log("response data", response.data)
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        name: val.booked_user === 'LOCAL' ? val.local_user.name : val.tourist_user.name,
                        last_update: moment(val.last_update).format('llll'),
                        start_datetime: moment(val.start_datetime).format('ll'),
                        end_datetime: moment(val.end_datetime).format('ll'),
                        payment_amount: `$${(val.payment.payment_amount * val.payment.comission_percentage).toFixed(2)}`,
                        key: val.user_id,
                    }));
                    setBookingsData(tempData);
                    setGetBookingsData(false);
                    console.log(response.data)
                } else {
                    console.log("List of bookings not fetched!");
                }
            }

            fetchData();
            setGetBookingsData(false);
        }
    }, [getBookingsData]);

    // VIEW BOOKING
    const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false);

    useEffect(() => {

    }, [selectedBookingId])

    //view booking modal open button
    function onClickOpenViewBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewBookingModalOpen(true);
    }

    // view booking modal cancel button
    function onClickCancelViewBookingModal() {
        setIsViewBookingModalOpen(false);
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
            <CustomHeader items={viewBookingBreadCrumb}/>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomTablePagination
                            title="Bookings"
                            column={bookingsColumns}
                            data={bookingsData}
                            rowKey="booking_id"
                            tableLayout="fixed"
                        />

                        <ViewBookingModal
                            isViewBookingModalOpen={isViewBookingModalOpen}
                            onClickCancelViewBookingModal={onClickCancelViewBookingModal}
                            bookingId={selectedBookingId}
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
        minWidth: '91.5vw'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%"
    },
}