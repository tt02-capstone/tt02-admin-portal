import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Divider, Row, Col } from 'antd';
import { EditFilled } from "@ant-design/icons";
import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { editProfile, editPassword } from "../../redux/adminRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

export default function ViewProfile() {

    // const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;

    const viewProfileBreadcrumbItems = [
        {
            title: 'Profile',
        },
        {
            title: 'View Profile',
        },
    ];

    const editProfileBreadcrumbItems = [
        {
            title: 'Profile',
        },
        {
            title: 'Edit Profile',
        },
    ];

    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("user"))); // admin object
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // when the edit profile button is clicked
    function onClickEditProfileButton() {
        setIsViewProfile(false);
    }

    const getAdminRole = () => {
        if (admin.role === 'ADMIN') {
            return 'Admin';
        } else if (admin.role === 'OPERATION') {
            return 'Operation';
        } else {
            return 'Support';
        }
    }

    // when user submits the edit profile details form
    async function onClickSubmitProfileButton(values) {
        
        let tempRole;
        if (values.role === 'Admin') {
            tempRole = 'ADMIN';
        } else if (values.role === 'Operation') {
            tempRole = 'OPERATION';
        } else {
            tempRole = 'SUPPORT';
        }

        let response = await editProfile({...values, user_id: admin.user_id, role: tempRole});
        if (response.status) {
            setAdmin(response.data);
            toast.success('Profile successfully updated!', {
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
            var passwordChecker=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
            if (val.newPasswordOne.match(passwordChecker)) {
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
                toast.error('New password must be 8 characters long, and contain 1 letter, number and symbol each!', {
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
                    <CustomHeader items={viewProfileBreadcrumbItems}/>
                    <Divider orientation="left" style={{fontSize: '150%' }} >User Profile</Divider>
                    <Content style={styles.content}>
                        <Row>
                            <Col span={8} style={{fontSize: '150%'}}>Name: {admin.name}</Col>
                            <Col span={8} style={{fontSize: '150%'}}>Email: {admin.email}</Col>
                            <Col span={8} style={{fontSize: '150%'}}>
                                <CustomButton
                                text="Edit Profile"
                                icon={<UserOutlined />}
                                onClick={onClickEditProfileButton}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {admin.role && admin.role === 'ADMIN' && <Col span={16} style={{fontSize: '150%'}}>Role: Admin</Col>}
                            {admin.role && admin.role === 'OPERATION' && <Col span={16} style={{fontSize: '150%'}}>Role: Operation</Col>}
                            {admin.role && admin.role === 'SUPPORT' && <Col span={16} style={{fontSize: '150%'}}>Role: Support</Col>}
                            <Col>    
                                <CustomButton
                                    text="Edit Password"
                                    icon={<KeyOutlined />}
                                    onClick={onClickEditPasswordButton}
                                />
                            </Col>
                        </Row>
                        
                        {/* badge list, post list, support ticket list */}
                    </Content>
                </Layout>
            }

            {/* edit profile form */}
            {admin && !isViewProfile &&
                <Layout style={styles.layout}>
                    <CustomHeader items={editProfileBreadcrumbItems}/>
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
                            initialValue={getAdminRole()}
                            >
                            <Input disabled={true}/>
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <div style={{ textAlign: "right" }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <CustomButton text="Cancel" style={{marginLeft: '20px'}} onClick={onClickCancelProfileButton} />
                                </div>
                            </Form.Item>

                            {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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
                            </Form.Item> */}
                        </Form>
                    </Content>
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
        minWidth: '100vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
    },
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};