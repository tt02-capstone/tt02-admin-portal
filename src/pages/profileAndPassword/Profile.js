import React, { useState, useEffect, useContext } from "react";
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
import { uploadNewProfilePic } from "../../redux/userRedux";
import CustomFileUpload from "../../components/CustomFileUpload";
import {AuthContext, TOKEN_KEY} from "../../redux/AuthContext";
import axios from 'axios';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function Profile() {

    // const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const authContext = useContext(AuthContext);

    const viewProfileBreadcrumbItems = [
        {
            title: <strong>Profile</strong>,
        },
    ];

    const editProfileBreadcrumbItems = [
        {
            title: <strong>Profile</strong>,
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
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem(TOKEN_KEY, response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
            authContext.setAuthState({
                authenticated: true
            });
            setAdmin(response.data.user);

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
        console.log("a")
        if (val.oldPassword && val.newPasswordOne === val.newPasswordTwo) {
            var passwordChecker=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
            console.log("b")
            if (val.newPasswordOne.match(passwordChecker)) {
                let response = await editPassword(admin.user_id, val.oldPassword, val.newPasswordOne);
                console.log("c")
                if (response.status) {
                    toast.success('Password changed successfully!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                    setIsChangePasswordModalOpen(false);
                
                } else {
                    console.log("e")
                    console.log(response.data);
                    toast.error(response.data.errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                }
                console.log("f")
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
        console.log("z")
    }

    // upload image
    const S3BUCKET ='tt02/user'; // if you want to save in a folder called 'attraction', your S3BUCKET will instead be 'tt02/attraction'
    const TT02REGION ='ap-southeast-1';
    const ACCESS_KEY ='AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY ='xsMGhdP0XsZKAzKdW3ED/Aa5uw91Ym5S9qz2HiJ0';

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.file;
        setFile(file);
        toast.success(e.file.name + ' selected!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
        });
    };

    const uploadFile = async () => {
        let finalURL;
        if (file) {
            finalURL = "user_" + admin.user_id + "_" + file.name;
            const S3_BUCKET = S3BUCKET;
            const REGION = TT02REGION;
        
            AWS.config.update({
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            });
            const s3 = new AWS.S3({
                params: { Bucket: S3_BUCKET },
                region: REGION,
            });
        
            const params = {
                Bucket: S3_BUCKET,
                Key: finalURL,
                Body: file,
            };
        
            var upload = s3
                .putObject(params)
                .on("httpUploadProgress", (evt) => {
                console.log(
                    "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                );
                })
                .promise();
        
            await upload.then((err, data) => {
                console.log(err);
            });

            let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/' + finalURL;
            const fetchData = async (userId, str) => {
                const response = await uploadNewProfilePic({user_id: userId, profile_pic: str});
                if (response.status) {
                    console.log("image url saved in database")
                    setAdmin(response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    setFile(null);
                    toast.success('User profile image successfully uploaded!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });

                } else {
                    console.log("User image URL in database not updated!");
                }
            }

          fetchData(admin.user_id, str);
          setFile(null);
        } else {
            toast.error('Please select an image!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    };

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
                            <Col span={8} style={{marginLeft: '50px'}}>
                                <img 
                                    src={admin.profile_pic ? admin.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}
                                    style={{borderRadius: '50%', width: '200px', height: '200px'}}
                                />
                            </Col>
                            <Col span={8} >
                                <Row style={{fontSize: '150%', marginBottom: '5px'}}>Name: {admin.name}</Row>
                                <Row style={{fontSize: '150%', marginBottom: '5px'}}>Email: {admin.email}</Row>
                                {admin.role && admin.role === 'ADMIN' && <Row style={{fontSize: '150%'}}>Role: Admin</Row>}
                                {admin.role && admin.role === 'OPERATION' && <Row style={{fontSize: '150%'}}>Role: Operation</Row>}
                                {admin.role && admin.role === 'SUPPORT' && <Row style={{fontSize: '150%'}}>Role: Support</Row>}
                            </Col>
                            <Col>
                                <Row>
                                <CustomFileUpload handleFileChange={handleFileChange} uploadFile={uploadFile}/>
                                </Row>
                                <Row>
                                <CustomButton
                                    text="Edit Profile"
                                    style={{marginBottom: '5px', marginTop: '5px'}}
                                    icon={<UserOutlined />}
                                    onClick={onClickEditProfileButton}
                                />
                                </Row>
                                <Row>
                                <CustomButton
                                    text="Edit Password"
                                    style={{marginBottom: '5px'}}
                                    icon={<KeyOutlined />}
                                    onClick={onClickEditPasswordButton}
                                />
                                </Row>
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

                            <Form.Item
                            label="Password (Validation)"
                            name="password"
                            tooltip="Password is required for validation. This is not to change password!"
                            rules={[{ required: true, message: 'Password is required!' }]}
                            >
                            <Input.Password placeholder="Enter password" />
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <div style={{ textAlign: "right" }}>
                                <Button type="primary" htmlType="submit" style={{backgroundColor: '#FFA53F'}}>
                                    Submit
                                </Button>
                                <CustomButton text="Cancel" style={{marginLeft: '20px'}} onClick={onClickCancelProfileButton} />
                                </div>
                            </Form.Item>
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