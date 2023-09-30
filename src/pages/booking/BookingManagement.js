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

    const bookingsColumns = [
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
                    case 'ATTRACTION':
                        color = 'orange';
                        break;
                    case 'TELECOM':
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