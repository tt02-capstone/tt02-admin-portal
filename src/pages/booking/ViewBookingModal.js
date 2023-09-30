import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel, Spin } from "antd";
import { getBookingById } from "../../redux/bookingRedux";

export default function ViewBookingModal(props) {

    const [booking, setBooking] = useState();

    useEffect(() => {
        if (props.selectedBookingId) {
            const fetchData = async (id) => {
                const response = await getBookingById(id);
                if (response.status) {
                    setBooking(response.data);
                    
                } else {
                    console.log("Booking not fetched!");
                }
            }
            console.log('fetch');
            fetchData(props.selectedBookingId);
        }
    }, [props.selectedBookingId]);

    function getTypeColor(type) {
        switch (type) {
            case 'PHYSICALSIM':
                return 'magenta';
            case 'ESIM':
                return 'cyan';
            default:
                return 'default';
        }
    }

    function getPriceTierCount(count) {
        switch (count) {
            case 'TIER_1':
                return '$';
            case 'TIER_2':
                return '$$';
            case 'TIER_3':
                return '$$$';
            case 'TIER_4':
                return '$$$$';
            case 'TIER_5':
                return '$$$$$';
            default:
                return 'Bug';
        }
    }

    function getValidityColor(type) {
        switch (type) {
            case 'ONE_DAY':
                return 'green';
            case 'THREE_DAY':
                return 'cyan';
            case 'SEVEN_DAY':
                return 'blue';
            case 'FOURTEEN_DAY':
                return 'geekblue';
            case 'MORE_THAN_FOURTEEN_DAYS':
                return 'purple';
            default:
                return 'default';
        }
    }

    function getDataLimitColor(type) {
        switch (type) {
            case 'VALUE_10':
                return 'magenta';
            case 'VALUE_30':
                return 'red';
            case 'VALUE_50':
                return 'volcano';
            case 'VALUE_100':
                return 'orange';
            case 'UNLIMITED':
                return 'gold';
            default:
                return 'default';
        }
    }

    function renderProperty(label, value, color) {

        let formattedValue = value;

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Published' && value === true && <Badge status="success" text="Yes" />}
                    {label === 'Published' && value === false && <Badge status="error" text="No" />}
                    {color ? <Tag color={color}>{formattedValue}</Tag> : formattedValue}
                </div>
            </div>
        );
    }

    return (
        <div>
            {booking &&
            <Modal
                title={booking.name}
                centered
                open={props.viewBookingModal}
                onCancel={props.onCancelViewModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    test
                    {/* {renderProperty('Description', booking.description)}
                    {renderProperty('Published', booking.is_published )}
                    {renderProperty('Price', booking.price)}
                    {renderProperty('Price Tier', getPriceTierCount(booking.estimated_price_tier))}
                    {renderProperty('Duration', booking.num_of_days_valid)}
                    {renderProperty('Duration Category', booking.plan_duration_category, getValidityColor(booking.plan_duration_category))}
                    {renderProperty('Data Limit', booking.data_limit)}
                    {renderProperty('Data Limit Category', booking.data_limit_category, getDataLimitColor(booking.data_limit_category))} */}
                </div>
            </Modal>}
        </div>
    )
}

const styles = {
    carousel: {
      backgroundColor: 'white', 
      paddingBottom: '50px',
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white', 
      alignContent: 'center',
      height: '300px', 
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: '100%',
      objectFit: 'cover', 
    },
};