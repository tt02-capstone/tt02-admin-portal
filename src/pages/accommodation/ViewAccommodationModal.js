import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel } from "antd";
import {getAccommodationById} from "../../redux/accommodationRedux";
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function ViewAccommodationModal(props) {

    const [selectedAccommodation, setSelectedAccommodation] = useState([]);
    const [roomList, setRoomList] = useState([]);

    async function getAccommodation(props) {
        try {
            let response = await getAccommodationById(props.accommodationId);
            setSelectedAccommodation(response.data);
            setRoomList(response.data.room_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve accommodation!');
        }
    }
    function formatRoomType(text) {
        if (text === 'STANDARD') {
            return 'Standard';
        } else if (text === 'DOUBLE') {
            return 'Double';
        } else if (text == 'SUITE') {
            return 'Suite';
        } else if (text === 'JUNIOR_SUITE') {
            return 'Junior Suite';
        } else if (text === 'DELUXE_SUITE') {
            return 'Deluxe Suite';
        } else {
            return text;
        }
    }
    useEffect(() => {
    }, [selectedAccommodation, roomList])

    useEffect(() => {
        if (props.isViewAccommodationModalOpen) {
            getAccommodation(props);
        }
    }, [props.isViewAccommodationModalOpen]);

    function formattedRoomList() {
        const roomTypes = {};

        if (roomList && roomList.length > 0) {
            roomList.forEach((room) => {
                const { room_type } = room;
                // Trim leading and trailing spaces from room_type and capitalize the first letter
                const cleanedType = room_type.charAt(0).toUpperCase() + room_type.slice(1).toLowerCase();
                if (roomTypes[cleanedType]) {
                    roomTypes[cleanedType] += 1;
                } else {
                    roomTypes[cleanedType] = 1;
                }
            });

            const formattedStats = Object.keys(roomTypes).map((type, index) => {
                const itemStyle = {
                    margin: 0,
                    padding: 0,
                };

                return (
                    <p key={index} style={index === 0 ? { marginTop: 0 } : itemStyle}>
                        <span>{formatRoomType(type)} Rooms: {roomTypes[type]}</span>
                    </p>
                );
            });

            return formattedStats;
        }

        return <p>No rooms available. Please create some!</p>;
    }

    function formatRoomType(text) {
        if (text === 'Deluxe_suite') {
            return 'Deluxe Suite';
        } else {
            return text;
        }
    }

    function getPriceTierColor(priceTier) {
        switch (priceTier) {
            case 'TIER_1':
                return 'green';
            case 'TIER_2':
                return 'orange';
            case 'TIER_3':
                return 'red';
            case 'TIER_4':
                return 'blue';
            case 'TIER_5':
                return 'yellow';
            default:
                return 'default';
        }
    }

    function getTypeColor(type) {
        switch (type) {
            case 'HOTEL':
                return 'purple';
            case 'AIRBNB':
                return 'volcano';
            default:
                return 'default';
        }
    }

    function renderAccommodationImage(imageList) {
        if (Array.isArray(imageList) && imageList.length > 0) {
            // Render a Carousel of images if there are multiple images
            if (imageList.length > 1) {
                return (
                    <div style={styles.carousel}>
                        <Carousel autoplay arrows>
                            {imageList.map((imageUrl, index) => (
                                <div key={index}>
                                    <div style={styles.container}>
                                        <img
                                            src={imageUrl}
                                            alt={`Accommodation ${index + 1}`}
                                            style={styles.image}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                );
            } else {
                // Display a single image if there is only one in the list
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '35px' }}>
                        <img
                            src={imageList[0]}
                            alt="Accommodation"
                            style={{ maxWidth: '400px', maxHeight: '300px', width: '100%', height: 'auto' }}
                        />
                    </div>
                );
            }
        }
        return 'No Image';
    }


    function renderProperty(label, value, color) {

        let formattedValue;

        if (typeof value === 'string' && value.includes('_')) {
            formattedValue = value.split('_').join(' ');
        } else if (typeof value === 'string' && label === 'Contact Number') {
            formattedValue = value.replace(/(\d{4})(\d{4})/, '$1 $2');
        } else if (typeof value === 'string' && label === 'Area') {
            formattedValue = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        } else {
            formattedValue = value;
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Is Published?' ? (
                        <Badge status={value ? 'success' : 'error'} text={value ? 'Yes' : 'No'} />
                    ) : (
                        color ? (
                            <Tag color={color}>{formattedValue}</Tag>
                        ) : (
                            formattedValue
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Modal
                title={selectedAccommodation.name}
                centered
                open={props.isViewAccommodationModalOpen}
                onCancel={props.onClickCancelViewAccommodationModal}
                footer={[]} // hide default buttons of modal
            >

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderAccommodationImage(selectedAccommodation.accommodation_image_list)}
                    {renderProperty('Description', selectedAccommodation.description)}
                    {renderProperty('Category', selectedAccommodation.type, getTypeColor(selectedAccommodation.type))}
                    {renderProperty('Address', selectedAccommodation.address)}
                    {renderProperty('Area', selectedAccommodation.generic_location)}
                    {renderProperty('Contact Number', selectedAccommodation.contact_num)}
                    {renderProperty('Is Published?', selectedAccommodation.is_published ? "Yes" : "No")}
                    {renderProperty('Check In Time', moment(selectedAccommodation.check_in_time).format('LT'))}
                    {renderProperty('Check Out Time', moment(selectedAccommodation.check_out_time).format('LT'))}
                    {renderProperty('Price Tier', selectedAccommodation.estimated_price_tier, getPriceTierColor(selectedAccommodation.estimated_price_tier))}
                    {renderProperty('Rooms', formattedRoomList())}
                </div>
            </Modal>
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