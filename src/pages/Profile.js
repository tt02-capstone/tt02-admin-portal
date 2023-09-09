import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal } from 'antd';
import { EditFilled } from "@ant-design/icons";
import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { editAdminProfile, getAdminProfile, editAdminPassword } from "../redux/adminRedux";
import CustomHeader from "../components/CustomHeader";
import CustomButton from "../components/CustomButton";

export default function ViewProfile() {

    // const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;

    const [admin, setAdmin] = useState(); // admin object
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // fetch admin profile details
    useEffect(() => {
        const fetchData = async () => {
            const response = await getAdminProfile(1); // need to replace with id from local storage
            if (response.status) {
                setAdmin(response.data);
                // console.log(response.data);
            } else {
                console.log("Admin profile data not fetched!");
            }
        }

        fetchData();

        console.log(localStorage.length)
        for (var i = 0; i < localStorage.length; i++){
            console.log(localStorage.getItem(localStorage.key(i)));
        }
    }, [])

    // when the edit profile button is clicked
    function onClickEditProfileButton() {
        setIsViewProfile(false);
    }

    // when user submits the edit profile details form
    async function onClickSubmitProfileButton(values) {
        
        let response = await editAdminProfile({...values, user_id: admin.user_id});
        if (response.status) {
            setAdmin(response.data);
            // console.log(response.data);
        } else {
            console.log("Admin profile not editted!");
        }
        setIsViewProfile(true);
    }

    // when cancel edit profile details
    function onClickCancelProfileButton() {
        setIsViewProfile(true);
    }

    // when the edit password button is clicked
    function onClickEditPasswordButton() {
        setIsChangePasswordModalOpen(true);
    }

    // when user edits password
    async function onClickSubmitNewPassword(val) {
        if (val.oldPassword && val.newPasswordOne === val.newPasswordTwo) {
            let response = await editAdminPassword(admin.user_id, val.oldPassword, val.newPasswordOne);
            if (response.status) {
                console.log(response.data);
                console.log("Admin password changed!");
            } else {
                console.log("Admin password not changed!");
            }
            setIsChangePasswordModalOpen(false);
        } else {
            console.log("New password does not match!");
        }
    }

    // when user cancels new password editting
    function onClickCancelNewPassword() {
        setIsChangePasswordModalOpen(false);
    }

    return (
        <div>
            {/* view profile data fetching */}
            {!admin && <Spin />}

            {/* view profile data */}
            {admin && isViewProfile && 
                <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            {admin.email}
                            <br />
                            {admin.name}
                            <br />
                            {admin.role && admin.role === 'ADMIN' && <p>Admin</p>}
                            {admin.role && admin.role === 'OPERATION' && <p>Operation</p>}
                            {admin.role && admin.role === 'SUPPORT' && <p>Support</p>}
                            <br />
                            <CustomButton
                                text="Edit Profile"
                                icon={<EditFilled />}
                                onClick={onClickEditProfileButton}
                            />
                            <br />
                            <br />
                            <CustomButton
                                text="Edit Password"
                                icon={<EditFilled />}
                                onClick={onClickEditPasswordButton}
                            />
                            
                            {/* badge list, post list, support ticket list */}
                        </Content>
                    </Layout>
                </Layout>
            }

            {/* edit profile form */}
            {admin && !isViewProfile &&
                <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            required={true}
                            requiredMark={true}
                            onFinish={onClickSubmitProfileButton}
                        >
                            <Form.Item
                            label="Email"
                            name="email"
                            initialValue={admin.email}
                            rules={[{ required: true, message: 'Please enter a valid email!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Name"
                            name="name"
                            initialValue={admin.name}
                            rules={[{ required: true, message: 'Please enter a valid name!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Role"
                            name="role"
                            initialValue={admin.role}
                            rules={[{ required: true, message: 'Please enter a valid name!' }]}
                            >
                            <Input disabled={true}/>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <CustomButton 
                                    text="Cancel"
                                    // icon
                                    onClick={onClickCancelProfileButton}
                                />
                            </Form.Item>
                        </Form>
                        </Content>
                    </Layout>
                </Layout>
            }

            {/* edit password pop-up */}
            {admin && isChangePasswordModalOpen && 
                <Modal
                    title="Change Password"
                    centered
                    open={isChangePasswordModalOpen}
                    onCancel={onClickCancelNewPassword}
                >
                    <Form 
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        required={true}
                        requiredMark={true}
                        onFinish={onClickSubmitNewPassword}
                    >
                        <Form.Item
                        label="Old Password"
                        name="oldPassword"
                        placeholder="Old Password"
                        rules={[{ required: true, message: 'Please enter your old password!' }]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item
                        label="New Password"
                        name="newPasswordOne"
                        placeholder="New Password"
                        rules={[{ required: true, message: 'Please enter your new password!' }]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item
                        label="Repeat New Password"
                        name="newPasswordTwo"
                        placeholder="Repeat new Password"
                        rules={[{ required: true, message: 'Please enter your new password again!' }]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </div>
    );
}

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}