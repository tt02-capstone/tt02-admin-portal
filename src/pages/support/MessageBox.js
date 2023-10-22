import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, List, Avatar, Descriptions, Switch, Select, Modal, Form, Badge, Tag } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { createReply, getAllRepliesBySupportTicket, getSupportTicket, updateReply, deleteReply, updateSupportTicketStatus } from "../../redux/supportRedux";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ViewAttractionModal from "../attraction/ViewAttractionModal";
import CustomButton from "../../components/CustomButton";
import ViewTelecomModal from "../telecom/ViewTelecomModal";
import ViewDealModal from "../deal/ViewDealModal";
import ViewAccommodationModal from "../accommodation/ViewAccommodationModal";
import ViewRestaurantModal from "../restaurant/ViewRestaurantModal";
import ViewTourModal from "../tour/ViewTourTypeModal";
import ViewBookingModal from "../booking/ViewBookingModal";
import { set } from 'local-storage';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

export default function MessageBox(props) {

    const [fetchSupportTicket, setFetchSupportTicket] = useState(true);
    const [fetchReplyList, setFetchReplyList] = useState(true);
    const [supportTicket, setSupportTicket] = useState('');
    const [replyList, setReplyList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [replyIdToEdit, setReplyIdToEdit] = useState('');
    const [replyIdToDelete, setReplyIdToDelete] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openEditReplyModal, setOpenEditReplyModal] = React.useState(false);
    const [editedMessage, setEditedMessage] = useState('');
    const [ticketStatus, setTicketStatus] = useState(false);
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const admin = JSON.parse(localStorage.getItem("user"));
    const [values, setValues] = useState({
        description: '',
        ticket_category: '',
        is_resolved: false
    });

    // VIEW ATTRACTION
    const [isViewAttractionModalOpen, setIsViewAttractionModalOpen] = useState(false);
    const [isViewDealModal, setIsViewDealModal] = useState(false);
    const [isViewTelecomModal, setIsViewTelecomModal] = useState(false);
    const [isViewAccommodationModal, setIsViewAccommodationModal] = useState(false);
    const [isViewBookingModal, setIsViewBookingModal] = useState(false);
    const [isViewRestaurantModal, setIsViewRestaurantModal] = useState(false);
    const [isViewTourModal, setIsViewTourModal] = useState(false);

    useEffect(() => {
        if (admin && admin.user_type === 'INTERNAL_STAFF' && fetchSupportTicket) {
            const fetchData = async () => {
                console.log(admin.user_id)
                const response = await getSupportTicket(props.supportTicketId);
                if (response.status) {
                    setSupportTicket(response.data);
                    console.log(response.data)
                    setFetchSupportTicket(false);
                    setReplyList(response.data.reply_list)
                    setValues({
                        is_resolved: response.data.is_resolved,
                        description: response.data.description,
                        ticket_category: response.data.ticket_category
                    })
                } else {
                    console.log("Admin Ticket list not fetched!");
                }
            }

            fetchData();

        }

        if (admin && admin.user_type === 'INTERNAL_STAFF' && fetchReplyList) {
            const fetchReplyData = async () => {
                console.log(admin.user_id)
                const response = await getAllRepliesBySupportTicket(props.supportTicketId);
                if (response.status) {
                    console.log(response.data)
                    setFetchReplyList(false);
                    setReplyList(response.data)
                } else {
                    console.log("Admin Ticket list not fetched!");
                }
            }
            fetchReplyData()
        }

    }, [fetchSupportTicket, fetchReplyList]);

    const handleReplySubmit = async () => {
        let replyObj;
        console.log(admin.user_id)
        console.log("support ticket", supportTicket.support_ticket_id)
        console.log("user.user_id", admin.user_id)
        if (inputText.trim() !== '') {
            replyObj = {
                message: inputText,
            }
        }

        let response = await createReply(admin.user_id, supportTicket.support_ticket_id, replyObj);
        if (response.status) {
            console.log("createReply response", response.status)
            toast.success('Reply created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setInputText('');
            setFetchReplyList(true);

        } else {
            console.log('error', response.data)
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const formatUserType = (userType) => {
        if (userType === "VENDOR_STAFF" || userType === "VENDOR") {
            return 'Vendor';
        } else if (userType === "ADMIN") {
            return 'Admin';
        } else if (userType === "TOURIST") {
            return 'Tourist';
        } else if (userType === "LOCAL") {
            return 'Local';
        }
        return '';
    };

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
        const formattedCategory = category ? category.replace('_', ' ') : 'N/A';
        return { color, formattedCategory };
    };

    const getDescriptions = () => [
        { label: "Submitted By", content: supportTicket.submitted_user_name },
        { label: "From / To", content: `From ${formatUserType(supportTicket.submitted_user)} to ${formatUserType(supportTicket.ticket_type)}` },
        { label: "Ticket Category", content: supportTicket.ticket_category },
        {
            label: "Status", content: (
                <Badge
                    status={supportTicket.is_resolved ? 'error' : 'success'}
                    text={supportTicket.is_resolved ? 'Closed' : 'Open'}
                />
            )
        },
        { label: "Created Time", content: moment(supportTicket.created_time).format('llll') },
        { label: "Last Updated", content: moment(supportTicket.updated_time).format('llll') },
        { label: "Description", content: supportTicket.description },
    ];

    const handleTicketStatus = async () => {
        setTicketStatus(!supportTicket.is_resolved);
        console.log("Ticket Status", supportTicket.is_resolved);

        let response = await updateSupportTicketStatus(supportTicket.support_ticket_id);
        if (response.status) {
            setFetchSupportTicket(true);
            setFetchReplyList(true);
            if (props.toggleFetchUserListAdmin) {
                props.toggleFetchUserListAdmin();
            } else {
                props.toggleFetchUserListFull();
            }

            console.log("updateSupportTicketStatus response", response.status)
            toast.success('Support ticket is ' + (supportTicket.is_resolved ? 'reopened' : 'closed') + '!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        } else {
            console.log('error')
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const handleUpdate = () => {
        setIsEditing(!isEditing);
    };

    const [isEditReplyModalOpen, setIsEditReplyModalOpen] = useState(false);

    function onClickOpenEditReplyModal(replyId) {
        setReplyIdToEdit(replyId);
        setIsEditReplyModalOpen(true);
    }

    // edit accom modal cancel button
    function onClickCancelEditReplyModal() {
        setIsEditReplyModalOpen(false);
    }

    function refreshReplyList() {
        setFetchReplyList(true);
    }

    function handleEditReply(replyId) {
        console.log("replyId", replyId);
        setReplyIdToEdit(replyId);
        setEditedMessage(replyList.find(reply => reply.reply_id === replyId).message);
        setOpenEditReplyModal(true);
    };

    async function handleEditReplySubmission(replyIdToEdit) {

        console.log("replyIdToEdit", replyIdToEdit);

        let replyObj = {
            message: editedMessage,
        };

        let response = await updateReply(replyIdToEdit, replyObj);

        if (response.status) {
            toast.success('Reply edited!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            setOpenEditReplyModal(false);

            setFetchReplyList(true);

        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    function handleDelete(replyId) {
        setReplyIdToDelete(replyId);
        console.log("replyIdToDelete", replyIdToDelete);
        setOpenDeleteModal(true);
    };

    useEffect(() => {
    }, [replyIdToDelete, replyIdToEdit]);

    async function handleConfirmDelete(replySupportTicketId, replyId) {

        let response = await deleteReply(replySupportTicketId, replyId);

        if (response.status) {

            toast.success('Reply deleted!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            setOpenDeleteModal(false);

            setFetchReplyList(true);

        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const getReplyUserType = (item) => {
        console.log("item", item);
        if (item.tourist_user != null) {
            return 'Tourist';
        } else if (item.local_user != null) {
            return 'Local';
        } else if (item.vendor_staff_user != null) {
            if (supportTicket.attraction != null) {
                return 'Vendor' + ' - ' + supportTicket.attraction.name;
            } else if (supportTicket.accommodation != null) {
                return 'Vendor' + ' - ' + supportTicket.accommodation.name;
            } else if (supportTicket.tour != null) {
                return 'Vendor' + ' - ' + supportTicket.tour.name;
            } else if (supportTicket.telecom != null) {
                return 'Vendor' + ' - ' + supportTicket.telecom.name;
            } else if (supportTicket.restaurant != null) {
                return 'Vendor' + ' - ' + supportTicket.restaurant.name;
            } else if (supportTicket.deal != null) {
                return 'Vendor' + ' - ' + supportTicket.deal.name;
            } else {
                return 'Vendor';
            }
        } else if (item.internal_staff_user != null) {
            return 'Admin';
        } else {
            return 'Error';
        }
    }
    const getReplyUser = (item) => {
        if (item.tourist_user != null) {
            return item.tourist_user.name;
        } else if (item.local_user != null) {
            return item.local_user.name;
        } else if (item.vendor_staff_user != null) {
            return item.vendor_staff_user.name;
        } else if (item.internal_staff_user != null) {
            return item.internal_staff_user.name;
        } else {
            return 'Error';
        }
    }

    const renderCategoryButtons = () => {
        const buttons = [];

        if (supportTicket.attraction) {
            buttons.push(
                <div key="attraction">
                    <CustomButton
                        text="View Attraction"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewAttractionModalOpen(true); }}
                    />
                    {supportTicket.attraction.attraction_id ? (
                        <ViewAttractionModal
                            isViewAttractionModalOpen={isViewAttractionModalOpen}
                            onClickCancelViewAttractionModal={() => { setIsViewAttractionModalOpen(false); }}
                            attractionId={supportTicket.attraction.attraction_id}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.telecom) {
            buttons.push(
                <div key="telecom">
                    <CustomButton
                        text="View Telecom"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewTelecomModal(true); }}
                    />
                    {supportTicket.telecom.telecom_id ? (
                        <ViewTelecomModal
                            selectedTelecomId={supportTicket.telecom.telecom_id}
                            viewTelecomModal={isViewTelecomModal}
                            onCancelViewModal={() => { setIsViewTelecomModal(false); }}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.deal) {
            buttons.push(
                <div key="deal">
                    <CustomButton
                        text="View Deal"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewDealModal(true); }}
                    />
                    {supportTicket.deal.deal_id ? (
                        <ViewDealModal
                            selectedDealId={supportTicket.deal.deal_id}
                            viewDealModal={isViewDealModal}
                            onCancelViewModal={() => { setIsViewDealModal(false); }}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.accommodation) {
            buttons.push(
                <div key="accommodation">
                    <CustomButton
                        text="View Accommodation"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewAccommodationModal(true); }}
                    />
                    {supportTicket.accommodation.accommodation_id ? (
                        <ViewAccommodationModal
                            isViewAccommodationModalOpen={isViewAccommodationModal}
                            onClickCancelViewAccommodationModal={() => { setIsViewAccommodationModal(false); }}
                            accommodationId={supportTicket.accommodation.accommodation_id}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.restaurant) {
            buttons.push(
                <div key="restaurant">
                    <CustomButton
                        text="View Restaurant"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewRestaurantModal(true); }}
                    />
                    {supportTicket.restaurant.restaurant_id ? (
                        <ViewRestaurantModal
                            isViewRestaurantModalOpen={isViewRestaurantModal}
                            onClickCancelViewRestaurantModal={() => { setIsViewRestaurantModal(false); }}
                            restId={supportTicket.restaurant.restaurant_id}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.tour) {
            buttons.push(
                <div key="tour">
                    <CustomButton
                        text="View Tour"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewTourModal(true); }}
                    />
                    {supportTicket.tour.tour_id ? (
                        <ViewTourModal
                            isViewTourModalOpen={isViewTourModal}
                            onClickCancelViewTourModal={() => { setIsViewTourModal(false); }}
                            tourId={supportTicket.tour.tour_id}
                        />
                    ) : null}
                </div>
            );
        }

        if (supportTicket.booking) {
            buttons.push(
                <div key="booking">
                    <CustomButton
                        text="View Booking"
                        style={{ fontWeight: "bold", marginTop: '10px' }}
                        onClick={() => { setIsViewBookingModal(true); }}
                    />
                    {supportTicket.booking.booking_id ? (
                        <ViewBookingModal
                            isViewBookingModalOpen={isViewBookingModal}
                            onClickCancelViewBookingModal={() => { setIsViewBookingModal(false); }}
                            bookingId={supportTicket.booking.booking_id}
                        />
                    ) : null}
                </div>
            );
        }

        return buttons;
    };

    return (
        <Layout style={styles.layout}>
            <Content style={{ padding: '16px' }}>

                <Descriptions
                    title={`Support Ticket ID: #${supportTicket.support_ticket_id}`}
                    bordered
                    style={styles.descriptions}
                    extra={
                        <Button
                            type="primary"
                            onClick={handleTicketStatus}
                            style={{ backgroundColor: supportTicket.is_resolved ? "#1da31d" : "#db2c45", fontWeight: 'bold' }}
                        >
                            {supportTicket.is_resolved ? "Reopen Ticket" : "Close Ticket"}
                        </Button>
                    }
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}>
                    {getDescriptions().map((item, index) => (
                        <Descriptions.Item key={index} label={item.label} style={styles.item}>
                            {item.label === 'Description' ? (
                                <div style={{ height: '150px', overflow: 'auto', display: 'flex', alignItems: 'center' }}>{item.content}</div>
                            ) : item.label === 'Ticket Category' ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tag color={getColorForCategory(supportTicket.ticket_category).color}>
                                        {getColorForCategory(supportTicket.ticket_category).formattedCategory}
                                    </Tag>
                                    {renderCategoryButtons()}
                                </div>
                            ) : (
                                item.content
                            )}
                        </Descriptions.Item>
                    ))}
                </Descriptions>

                <br />
                <Content style={styles.replyContainer}>
                    <div
                        style={styles.scrollableList}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={replyList}
                            renderItem={(reply, index) => (
                                <List.Item
                                    actions={
                                        ((reply.internal_staff_user != null && reply.internal_staff_user.user_id === admin.user_id)) &&
                                            index === replyList.length - 1 && !supportTicket.is_resolved
                                            ? [
                                                <Button key="edit" type="primary" onClick={() => handleEditReply(reply.reply_id)}>
                                                    Edit
                                                </Button>,
                                                <Button key="delete" type="primary" onClick={() => handleDelete(reply.reply_id)}>
                                                    Delete
                                                </Button>,
                                            ]
                                            : null
                                    }>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={reply.internal_staff_user ? null : <UserOutlined />} style={{ backgroundColor: reply.internal_staff_user ? '#1890ff' : '#52c41a' }} />}
                                        title={
                                            <div>
                                                <div style={styles.replyUserType}>{getReplyUserType(reply)}</div>
                                                <div>{getReplyUser(reply)}</div>
                                            </div>
                                        }
                                        description={<span style={{ color: 'black' }}>{reply.message}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                    {!supportTicket.is_resolved && (
                        <Content style={styles.replyInput}>
                            <Input
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onPressEnter={handleReplySubmit}
                                style={{ flex: 1, marginRight: '8px', height: '40px' }}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleReplySubmit}
                                style={{ height: '40px' }}
                            >
                                Send
                            </Button>
                        </Content>
                    )}
                    {supportTicket.is_resolved && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <hr style={{ flex: 1, border: '1px solid lightgray', marginRight: '8px' }} />
                            <p style={{ color: 'black', fontSize: '16px', marginLeft: '20px', marginRight: '20px' }}>Ticket is closed</p>
                            <hr style={{ flex: 1, border: '1px solid lightgray', marginLeft: '8px' }} />
                        </span>
                    )}

                    <Modal
                        title="Edit Reply"
                        visible={openEditReplyModal}
                        onOk={() => handleEditReplySubmission(replyIdToEdit)}
                        onCancel={() => setOpenEditReplyModal(false)}
                        okText="Submit"
                        cancelText="Cancel"
                    >
                        <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <label htmlFor="editedMessage"> </label>
                            <input
                                type="text"
                                id="editedMessage"
                                value={editedMessage}
                                style={{ marginLeft: '10px', width: '100%', height: '40px' }}
                                onChange={(e) => setEditedMessage(e.target.value)}
                            />
                        </div>
                    </Modal>

                    <Modal
                        title="Delete Confirmation"
                        visible={openDeleteModal}
                        onOk={() => handleConfirmDelete(supportTicket.support_ticket_id, replyIdToDelete)}
                        onCancel={() => setOpenDeleteModal(false)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to delete this reply?</p>
                    </Modal>
                </Content>
            </Content>
        </Layout>
    );
};

const styles = {
    layout: {
        minHeight: '100%',
        minWidth: '100%',
        backgroundColor: 'darkgray'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%",
        marginTop: '-5px'
    },
    replyContainer: {
        color: 'blue',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '16px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    scrollableList: {
        maxHeight: '450px',
        overflowY: 'auto',
    },
    replyInput: {
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
    },
    descriptions: {
        backgroundColor: 'white', // Set the background color for the Descriptions
        border: '1px solid #d9d9d9', // Border style
        borderRadius: '4px', // Border radius
        padding: '16px', // Padding
    },
    item: {
        // You can style the individual items here, for example:
        // fontSize: '16px',
        // fontWeight: 'bold',
        // color: 'blue',
    },
    replyUserType: {
        fontSize: 13,
        color: 'gray',
    },
}