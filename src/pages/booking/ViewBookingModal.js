import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Tag } from "antd";
import { getBookingById } from "../../redux/bookingRedux";

export default function ViewBookingModal(props) {

    const [selectedBooking, setSelectedBooking] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getBooking(props) {
        try {
            let response = await getBookingById(props.bookingId);
            setSelectedBooking(response.data);
            console.log("get booking for view booking", response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve booking!');
        }
    }

    useEffect(() => {
    }, [selectedBooking])

    useEffect(() => {
        if (props.isViewBookingModalOpen) {
            getBooking(props);
        }
    }, [props.isViewBookingModalOpen]);

    function getBookingStatusColor(bookingStatus) {
        switch (bookingStatus) {
            case 'UPCOMING':
                return 'processing';
            case 'ONGOING':
                return 'warning';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
        }
    }

    function getAttractionCategoryColor(attractionCategory) {
        switch (attractionCategory) {
            case 'HISTORICAL':
                return 'purple';
            case 'CULTURAL':
                return 'volcano';
            case 'NATURE':
                return 'magenta';
            case 'ADVENTURE':
                return 'geekblue';
            case 'SHOPPING':
                return 'gold';
            case 'ENTERTAINMENT':
                return 'cyan';
        }
    }

    function getBookingTypeColor(type) {
        switch (type) {
            case 'ACCOMMODATION':
                return 'purple';
            case 'ATTRACTION':
                return 'volcano';
            case 'TELECOM':
                return 'magenta';
            case 'TOUR':
                return 'geekblue';
        }
    }

    function getPaymentStatusColor(paymentStatus) {
        switch (paymentStatus) {
            case 'PAID':
                return 'success';
            case 'UNPAID':
                return 'error';
            default:
                return '';
        }
    }

    function formatDate(dateTime) {
        if (!dateTime) return '';
        const dateObj = new Date(dateTime);
        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    }

    function formatStartEndDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    }

    function renderCustomerName(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.name;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.name;
        } else {
            return '';
        }
    }

    function getCustomerType(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return 'Tourist';
        } else if (selectedBooking.local_user) {
            return 'Local';
        }
    }

    function getCustomerEmail(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.email;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.email;
        } else {
            return '';
        }
    }

    function getCustomerMobileNumber(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.mobile_num;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.mobile_num;
        } else {
            return '';
        }
    }

    function calculateAdminEarns(payment) {
        if (payment && payment.is_paid && payment.comission_percentage != null) {
            const amountAdminEarns = (payment.payment_amount * (payment.comission_percentage));
            return `$${amountAdminEarns.toFixed(2)}`;
        } else {
            return '';
        }
    }


    function renderProperty(label, value, color) {

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>{label}:</div>
                <div>
                    {color ? (
                        <Tag color={color}>{value}</Tag>
                    ) : (
                        value
                    )}
                </div>
            </div>
        );
    }

    function renderBookingItems() {
        const bookingItems = selectedBooking.booking_item_list || [];

        // Create an array of formatted ticket descriptions
        const itemDescriptions = bookingItems.map((bookingItem) => {
            return `${bookingItem?.activity_selection} (${bookingItem?.quantity} pax)`;
        });

        const items = itemDescriptions.join(', ');

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>Booking Items:</div>
                <div>{items}</div>
            </div>
        );
    }

    function renderAccommodationBookingItems() {
        const bookingItems = selectedBooking.booking_item_list || [];
    
        // Create an array of formatted ticket descriptions
        const itemDescriptions = bookingItems.map((bookingItem) => {
            const roomText = bookingItem.quantity === 1 ? 'room' : 'rooms';
            return `${bookingItem?.activity_selection} (${bookingItem?.quantity} ${roomText})`;
        });
    
        const items = itemDescriptions.join(', ');
    
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>Booking Items:</div>
                <div>{items}</div>
            </div>
        );
    }    

    return (
        <div>
            <Modal
                title={`Booking Details`}
                centered
                open={props.isViewBookingModalOpen}
                onCancel={props.onClickCancelViewBookingModal}
                footer={[]} // hide default buttons of modal
            >

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Customer Name', renderCustomerName(selectedBooking))}
                    {renderProperty('Customer Type', getCustomerType(selectedBooking))}
                    {renderProperty('Customer Email', getCustomerEmail(selectedBooking))}
                    {renderProperty('Customer Number', getCustomerMobileNumber(selectedBooking))}
                    {renderProperty('Name', selectedBooking.activity_name)}
                    {renderProperty('Type', selectedBooking.type, getBookingTypeColor(selectedBooking.type))}
                    {renderProperty('Booking Status', selectedBooking.status, getBookingStatusColor(selectedBooking.status))}
                    {renderProperty('Last Updated', formatDate(selectedBooking.last_update))}
                    {renderProperty('Start Date', formatStartEndDate(selectedBooking.start_datetime))}
                    {renderProperty('End Date', formatStartEndDate(selectedBooking.end_datetime))}
                    {selectedBooking.type === 'ACCOMMODATION'
                        ? renderAccommodationBookingItems()
                        : renderBookingItems()}
                    {renderProperty('Payment Status', selectedBooking.payment ? (selectedBooking.payment.is_paid ? 'PAID' : 'UNPAID') : '', getPaymentStatusColor(selectedBooking.payment ? (selectedBooking.payment.is_paid ? 'PAID' : 'UNPAID') : ''))}
                    {renderProperty('Amount Earned', calculateAdminEarns(selectedBooking.payment))}
                </div>
            </Modal >
        </div >
    )
}