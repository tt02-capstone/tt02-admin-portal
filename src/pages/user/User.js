import React, { useState, useEffect } from "react";
import { Layout, Menu, Form } from 'antd';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAdmin, getAllStaff } from "../../redux/adminRedux";
import CustomHeader from "../../components/CustomHeader";
import { Navigate } from 'react-router-dom';
import CreateAdminModal from './CreateAdminModal';
import CustomButton from '../../components/CustomButton'
import CustomTablePagination from "../../components/CustomTablePagination";

export default function User() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const admin = JSON.parse(localStorage.getItem("user"));

    // menu
    const menuItems = [
        {
          label: 'Admin Staff',
          key: '1',
        },
        {
            label: 'Vendor Staff',
            key: '2',
        },
        {
            label: 'Local',
            key: '3',
        },
        {
            label: 'Tourist',
            key: '4',
        },
    ];

    const [currentTab, setCurrentTab] = useState('1');
    
    const onClickTab = (tab) => {
        setCurrentTab(tab.key);
    };

    // admin users table pagination
    const [getAdminData, setGetAdminData] = useState(true);
    const [adminData, setAdminData] = useState([]); // list of admins

    const adminColumns = [
        {
            title: 'Admin Id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            // rowKey: 'user_id',
            render: (text) => {
                if (text === "ADMIN") {
                    return <p>Admin</p>
                } else if (text === "OPERATION") {
                    return <p>Operation</p>
                } else {
                    return <p>Support</p>
                }
            }
        },
        {
            title: 'Allowed Portal Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
            rowKey: 'user_id',
            render: (text) => {
                if (text === "true") {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
    ];

    // vendor staff
    const [getVendorStaffData, setGetVendorStaffData] = useState(true);
    const [vendorStaffData, setVendorStaffData] = useState([]); // list of vendor staff

    const vendorStaffColumns = [
        {
            title: 'Vendor Staff Id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
    ];

    // locals
    const [getLocalData, setGetLocalData] = useState(true);
    const [localData, setLocalData] = useState([]); // list of locals

    const localColumns = [
        {
            title: 'Local Id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
    ];

    // tourist
    const [getTouristData, setGetTouristData] = useState(true);
    const [touristData, setTouristData] = useState([]); // list of tourists

    const touristColumns = [
        {
            title: 'Tourist Id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
    ];

    useEffect(() => { // fetch list of admin
        if (getAdminData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllStaff(); // need to replace with id from local storage
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val, 
                        key: val.user_id,
                    }));
                    setAdminData(tempData);
                    setGetAdminData(false);
                } else {
                    console.log("List of admin not fetched!");
                }
            }
    
            fetchData();
        }
    },[getAdminData]);
    
    // form inputs for admin creation
    const [createAdminForm] = Form.useForm();
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false); // boolean to open modal
    
    // create new admin modal open button
    function onClickOpenCreateAdminModal() {
        setIsCreateAdminModalOpen(true);
    }
    // create new admin modal cancel button
    function onClickCancelAdminModal() {
        setIsCreateAdminModalOpen(false);
    }

    // create new admin modal create button
    async function onClickSubmitAdminCreate(values) {

        let adminObj = {
            name: values.name,
            email: values.email,
            password: values.password,
            is_blocked: values.is_blocked === "true" ? true : false,
            role: values.role
        }
            
        let response = await createAdmin(adminObj);
        if (response.status) {
            createAdminForm.resetFields();
            setGetAdminData(true);
            setIsCreateAdminModalOpen(false);
            toast.success('Admin creation successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Admin creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    return admin ? (
        <div>
            <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            <CustomButton 
                                text="Create Admin"
                                // icon=
                                onClick={onClickOpenCreateAdminModal}
                            />

                            {/* Tab and Tables to view various users */}
                            <Menu 
                                onClick={onClickTab} 
                                selectedKeys={[currentTab]}
                                mode="horizontal"
                                items={menuItems}
                            >
                            </Menu>
                            {currentTab === '1' && 
                                <CustomTablePagination
                                    title="Admin Staff"
                                    column={adminColumns}
                                    data={adminData}
                                />
                            }
                            {currentTab === '2' && 
                                <CustomTablePagination
                                    title="Vendor Staff"
                                    column={vendorStaffColumns}
                                    data={vendorStaffData}
                                />
                            }
                            {/* locals */}
                            {currentTab === '3' && 
                                <CustomTablePagination
                                    title="Locals"
                                    column={localColumns}
                                    data={localData}
                                />
                            }
                            {/* tourist */}
                            {currentTab === '4' && 
                                <CustomTablePagination
                                    title="Tourists"
                                    column={touristColumns}
                                    data={touristData}
                                />
                            }

                            {/* Modal to create new admin account */}
                            <CreateAdminModal
                                form={createAdminForm}
                                isCreateAdminModalOpen={isCreateAdminModalOpen}
                                onClickCancelAdminModal={onClickCancelAdminModal}
                                onClickSubmitAdminCreate={onClickSubmitAdminCreate}
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
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}