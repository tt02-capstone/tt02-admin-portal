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
import { uploadNewProfilePic } from "../../redux/userRedux";
import CustomFileUpload from "../../components/CustomFileUpload";
import AWS from 'aws-sdk';
import {adminApi} from "../../redux/api";

window.Buffer = window.Buffer || require("buffer").Buffer;

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

    // upload image
  const S3BUCKET ='tt02/user'; // if you want to save in a folder called 'attraction', your S3BUCKET will instead be 'tt02/attraction'
  const TT02REGION ='ap-southeast-1';
  const ACCESS_KEY ='AKIART7KLOHBGOHX2Y7T';
  const SECRET_ACCESS_KEY ='xsMGhdP0XsZKAzKdW3ED/Aa5uw91Ym5S9qz2HiJ0';

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadFile = async () => {
      if (file) {
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
              Key: file.name,
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

          let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/' + file.name;
          const fetchData = async (userId, str) => {
              const response = await uploadNewProfilePic({user_id: userId, profile_pic: str});
              if (response.status) {
                  console.log("image url saved in database")
                  localStorage.setItem("user", JSON.stringify(response.data));
                  setAdmin(response.data);
                  // change local storage
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