import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal } from 'antd';
import { EditFilled } from "@ant-design/icons";
import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { editProfile, editPassword } from "../../redux/adminRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";

export default function ViewProfile() {

    // const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;

    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("user"))); // admin object
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // when the edit profile button is clicked
    function onClickEditProfileButton() {
        setIsViewProfile(false);
    }

    // when user submits the edit profile details form
    async function onClickSubmitProfileButton(values) {
        
        let response = await editProfile({...values, user_id: admin.user_id});
        if (response.status) {
            setAdmin(response.data);
            toast.success('Admin profile changed successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setIsViewProfile(true);

        } else {
            console.log("Admin profile not editted!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // when cancel edit profile details
    function onClickCancelProfileButton() {
        setIsViewProfile(true);
    }

    // when the edit password button is clicked
    function onClickEditPasswordButton() {
        setIsChangePasswordModalOpen(true);
    }

    // close edit password modal
    function onClickCancelEditPasswordButton() {
        setIsChangePasswordModalOpen(false);
    }

    // when user edits password
    async function onClickSubmitNewPassword(val) {
        if (val.oldPassword && val.newPasswordOne === val.newPasswordTwo) {
            let response = await editPassword(admin.user_id, val.oldPassword, val.newPasswordOne);
            if (response.status) {
                toast.success('Admin password changed successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
                setIsChangePasswordModalOpen(false);
            
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }

        } else {
            toast.error('New password does not match!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
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
                            rules={[{ required: true, message: 'Email is required!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Name"
                            name="name"
                            initialValue={admin.name}
                            rules={[{ required: true, message: 'Name is required!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Role"
                            name="role"
                            initialValue={admin.role}
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
                <EditPasswordModal 
                    isChangePasswordModalOpen={isChangePasswordModalOpen}
                    onClickSubmitNewPassword={onClickSubmitNewPassword}
                    onClickCancelEditPasswordButton={onClickCancelEditPasswordButton}
                />
            }

            {/* Edit profile & password toast */}
            <ToastContainer />
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