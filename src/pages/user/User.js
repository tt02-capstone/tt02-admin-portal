import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Form, Input, Space, Button, Popover } from 'antd';
import Highlighter from 'react-highlight-words';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import { Navigate } from 'react-router-dom';
import CreateAdminModal from './CreateAdminModal';
import CustomButton from '../../components/CustomButton'
import CustomTablePagination from "../../components/CustomTablePagination";
import { toggleUserBlock, viewUserProfile } from "../../redux/userRedux";
import { createAdmin, getAllAdmin } from "../../redux/adminRedux";
import { getAllVendorStaff } from '../../redux/vendorStaffRedux';
import { getAllVendors } from "../../redux/vendorRedux";
import { getAllLocal } from "../../redux/localRedux";
import { getAllTourist } from "../../redux/touristRedux";
import UserModal from "./UserModal";
import { UserAddOutlined, SearchOutlined }  from "@ant-design/icons";
import WalletModal from "./WalletModal";
import { updateLocalWallet } from '../../redux/localRedux';
import { updateVendorWallet } from '../../redux/vendorRedux';
import TransactionsModal from "./TransactionsModal";
import { getSubscriptionStatuses, getSubscription, unsubscribe, subscribe } from "../../redux/dataRedux";
import SubscriptionModal from "./SubscriptionModal";
import { set, sub } from "date-fns";


export default function User() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const admin = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
            title: 'User',
        },
    ];

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
        {
            label: 'Vendor',
            key: '5',
        },
    ];

    const [currentTab, setCurrentTab] = useState('1');
    
    const onClickTab = (tab) => {
        setCurrentTab(tab.key);
    };

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [operation, setOperation] = useState("");
    const [subscriptionInfo, setSubscriptionInfo] = useState({});
    const [isSubscribed, setIsSubscribed] = useState(false);

    function onClickCancelManageSubButton() {
        setIsSubModalOpen(false);
      }
    
    async function onClickManageSubButton(user_id, user_type, status) {
        
        try {

            setCurrentId(user_id);
            setCurrentType(user_type);
            
            if (status === "active") {
                const response = await getSubscription(user_id, user_type);
    
                if (response.status) {
                    const details = response.data;
                    console.log(details)
                    setSubscriptionInfo(response.data);
                    setIsSubscribed(true);
                    setOperation("REMOVE");

                
                
                } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
                }
            } else {
                setOperation("ADD");
            }

            
            
            
          } catch (error) {
            toast.error(error, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
          }

          setIsSubModalOpen(true);
        
    }

      async function onClickSubmitSubscription(subscriptionFormDetails) {
        try {

            if (operation == "REMOVE") {

            const response = await unsubscribe(subscriptionInfo.subscription_id);
            if (response.status) {
                console.log(response.data)
                setIsSubscribed(false);
                setIsSubModalOpen(false);
                if (currentType === "LOCAL") {
                    setGetLocalData(true)
                } else if (currentType === "VENDOR") {
                    setGetVendorData(true);
                }

                toast.success("Successfully Removed Vendor from Subscription Service", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                    });
                
            } else {
                toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
                });
            }

            } else if (operation == "ADD") {
          const response = await subscribe(currentId, currentType, subscriptionFormDetails.subscriptionType, subscriptionFormDetails.autoRenew);
          if (response.status) {
            setIsSubscribed(true);
            setIsSubModalOpen(false);
            if (currentType === "LOCAL") {
                setGetLocalData(true)
            } else if (currentType === "VENDOR") {
                setGetVendorData(true);
            }

            toast.success("Successfully Added Vendor to Subscription Service", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
                });
          } else {
            toast.error(response.data.errorMessage, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
          }
            }
    

    
    
        } catch (error) {
          toast.error(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }
    
    
      }

    // admin users table pagination
    const [getAdminData, setGetAdminData] = useState(true);
    const [adminData, setAdminData] = useState([]); // list of admins

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const adminColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: (a, b) => a.user_id > b.user_id,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                {
                  text: 'Admin',
                  value: 'ADMIN',
                },
                {
                  text: 'Operation',
                  value: 'OPERATION',
                },
                {
                    text: 'Support',
                    value: 'SUPPORT',
                },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
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
            filters: [
                {
                  text: 'Allowed',
                  value: false,
                },
                {
                  text: 'Denied',
                  value: true,
                },
            ],
            onFilter: (value, record) => record.is_blocked === value,
            render: (text) => {
                if (text === true) {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text, record) => {
                let actions = [];
                actions.push(<CustomButton
                    key={2}
                    text="View"
                    style={{marginRight: '10px'}}
                    onClick={() => viewProfile(record.user_id)}
                />)

                if (record.is_blocked) {
                    actions.push(<CustomButton
                        key={1}
                        text="Unblock" 
                        onClick={() => toggleBlock(record.user_id)}
                    />)
                }

                return actions;
            }
        }
    ];

    useEffect(() => { // fetch list of admin
        if (getAdminData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllAdmin();
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

    // vendor staff
    const [getVendorStaffData, setGetVendorStaffData] = useState(true);
    const [vendorStaffData, setVendorStaffData] = useState([]); // list of vendor staff
    const [createWalletForm] = Form.useForm();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [currentType, setCurrentType] = useState(null);
    const [currentAmount, setCurrentAmount] = useState(null);

    function onClickOpenTransactionsModal(id, type) {
        setCurrentId(id);
        setCurrentType(type);
        setIsTransactionsModalOpen(true);

        
    }

    function onCancelTransactionsModal() {
        setIsTransactionsModalOpen(false);
    }

    // create new admin modal open button
    function onClickOpenWallet(id, type , wallet_balance) {
        setCurrentId(id);
        setCurrentType(type);
        setCurrentAmount(wallet_balance);
        setIsWalletModalOpen(true);

    }
    // create new admin modal cancel button
    function onCancelWalletModal() {
        setIsWalletModalOpen(false);
    }

    async function onSubmitUpdateWallet(values) {

        const operation = values.operation
        let amount = values.amount

        if (operation === 'Remove') {
            amount = -amount;
          }
          try {
            const response = currentType === 'LOCAL' ? await updateLocalWallet(currentId, amount) : await updateVendorWallet(currentId, amount);
      
            if (response.status) {
              console.log(response.data)
              onCancelWalletModal();
              if (currentType === 'LOCAL') {
                setGetLocalData(true);
              } else {
                setGetVendorData(true);
              }

              toast.success('Wallet Funds Is Updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            } else {
              console.log("List of vendor staff not fetched!");
            }
            } catch (error) {
              console.log('API Exception:', error);
            }
    }

    

    const content = (id, type, wallet_balance) => (
        <div>
          <CustomButton
                        //key={1}
                        text="Add/Remove Wallet Funds"
                        onClick={() => onClickOpenWallet(id, type, wallet_balance)}
                        style={{ marginRight: '20px' }}
                        />
          <CustomButton
                        //key={1}
                        text="View Wallet Transactions"
                        onClick={() => onClickOpenTransactionsModal(id, type)}
                        />

        </div>
      );

    const [getVendorData, setGetVendorData] = useState(true);
    const [vendorData, setVendorData] = useState([]); // list of locals

    const vendorColumns = [

        {
            title: 'Business Name',
            dataIndex: 'business_name',
            key: 'business_name',
            width: 160,
            sorter: (a, b) => a.business_name.localeCompare(b.business_name),
            ...getColumnSearchProps('business_name'),
        },
        {
            title: 'Vendor Type',
            dataIndex: 'vendor_type',
            key: 'vendor_type',
            width: 160,
            sorter: (a, b) => a.vendor_type.localeCompare(b.vendor_type),
            ...getColumnSearchProps('vendor_type'),
        },
        {
            title: 'Service Description',
            dataIndex: 'service_description',
            key: 'service_description',
            width: 240,
            sorter: (a, b) => a.service_description.localeCompare(b.service_description),
            ...getColumnSearchProps('service_description'),
        },
        {
            title: 'POC Name',
            dataIndex: 'poc_name',
            key: 'poc_name',
            width: 160,
            sorter: (a, b) => a.poc_name.localeCompare(b.poc_name),
            ...getColumnSearchProps('poc_name'),
        },
        {
            title: 'POC Position',
            dataIndex: 'poc_position',
            key: 'poc_position',
            width: 160,
            sorter: (a, b) => a.poc_position.localeCompare(b.poc_position),
            ...getColumnSearchProps('poc_position'),
        },
        {
            title: 'POC Contact',
            dataIndex: 'poc_mobile_num',
            key: 'poc_mobile_num',
            width: 160,
            sorter: (a, b) => a.poc_mobile_num.localeCompare(b.poc_mobile_num),
            ...getColumnSearchProps('poc_mobile_num'),
        },
        {
            title: 'Subscription Status',
            dataIndex: 'subscription_status',
            key: 'subscription_status',
            sorter: (a, b) => (a.subscription_status) > b.subscription_status,
            ...getColumnSearchProps('subscription_status'),
            render: (text) => {
                if (text === 'active') {
                    return 'Subscribed';
                } else if (text === 'Never subscribed') {
                    return 'Not Subscribed';
                } else {
                    return text;
                }
            },
        },
        {
            title: 'Wallet Balance',
            dataIndex: 'wallet_balance',
            key: 'wallet_balance',
            sorter: (a, b) => (a.wallet_balance) > b.wallet_balance,
            ...getColumnSearchProps('wallet_balance'),
            render: (text, record) => {
                return `$${parseFloat(record.wallet_balance).toFixed(2)}`;
            },
            
        }, 
       
        {
            title: 'Action(s)',
            dataIndex: 'vendor_id',
            key: 'vendor_id',
            render: (text, record) => {
                let actions = [];

                actions.push(
                    <div>
                    <Popover content={content(record.vendor_id, "VENDOR", record.wallet_balance)} title="Additional Actions" trigger="click" key={3}>
                        <CustomButton
                    text="Wallet"
                    style={{marginRight: '10px', width: 120, fontSize: 14}}
                   />

                    </Popover>

                    <CustomButton
                    text="Subscription"
                    style={{marginTop: 10, marginRight: '10px', width: 120, fontSize: 14}}
                    onClick={() => onClickManageSubButton(record.vendor_id, "VENDOR", record.subscription_status)}
                   />
                    
                    </div>
                  );   

                return actions;
            }
        }
    ];


      useEffect(() => { // fetch list of vendor staff
        if (getVendorData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllVendors();
                const subscription_response = await getSubscriptionStatuses("VENDOR");
                console.log(subscription_response.data)
                if (response.status && subscription_response.status) {
                    console.log(response.data)
                    var tempData = response.data.map((val, index) => ({
                        ...val, 
                        key: val.vendor_id,
                        subscription_status: subscription_response.data[index]
                    }));
                    setVendorData(tempData);
                    setGetVendorData(false);
                } else {
                    console.log("List of vendor staff not fetched!");
                }
            }
    
            fetchData();
        }
    },[getVendorData]);

    const vendorStaffColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: (a, b) => a.user_id > b.user_id,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            sorter: (a, b) => a.position.localeCompare(b.position),
            ...getColumnSearchProps('position'),
        },
        {
            title: 'Master Account',
            dataIndex: 'is_master_account',
            key: 'is_master_account',
            filters: [
                {
                  text: 'Master',
                  value: true,
                },
                {
                  text: 'Non-master',
                  value: false,
                },
            ],
            onFilter: (value, record) => record.is_master_account === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>Yes</p>
                } else {
                    return <p>No</p>
                }
            }
        },
        {
            title: 'Allowed Login Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
            filters: [
                {
                  text: 'Allowed',
                  value: false,
                },
                {
                  text: 'Denied',
                  value: true,
                },
            ],
            onFilter: (value, record) => record.is_blocked === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text, record) => {
                let actions = [];
                
                actions.push(<CustomButton
                    key={2}
                    text="View"
                    style={{marginRight: '10px'}}
                    onClick={() => viewProfile(record.user_id)}
                />)
                
                if (record.is_blocked) {
                    actions.push(<CustomButton
                        key={1}
                        text="Unblock" 
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                } else {
                    actions.push(<CustomButton
                        key={1}
                        text="Block"
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                }

                return actions;
            }
        }
    ];

    useEffect(() => { // fetch list of vendor staff
        if (getVendorStaffData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllVendorStaff();
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val, 
                        key: val.user_id,
                    }));
                    setVendorStaffData(tempData);
                    setGetVendorStaffData(false);
                } else {
                    console.log("List of vendor staff not fetched!");
                }
            }
    
            fetchData();
        }
    },[getVendorStaffData]);

    // locals
    const [getLocalData, setGetLocalData] = useState(true);
    const [localData, setLocalData] = useState([]); // list of locals
    
    const localColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: (a, b) => a.user_id > b.user_id,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobile_num',
            key: 'mobile_num',
            sorter: (a, b) => (a.country_code + a.mobile_num).localeCompare((b.country_code + b.mobile_num)),
            ...getColumnSearchProps('mobile_num'),
            render: (text, record) => {
                return record.country_code + ' ' + record.mobile_num;
            }
        },
        {
            title: 'Wallet Balance',
            dataIndex: 'wallet_balance',
            key: 'wallet_balance',
            sorter: (a, b) => (a.wallet_balance) > b.wallet_balance,
            ...getColumnSearchProps('wallet_balance'),
            render: (text, record) => {
                return `$${parseFloat(record.wallet_balance).toFixed(2)}`;
              },
            
        }, 
        {
            title: 'Allowed Login Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
            filters: [
                {
                  text: 'Allowed',
                  value: false,
                },
                {
                  text: 'Denied',
                  value: true,
                },
            ],
            onFilter: (value, record) => record.is_blocked === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text, record) => {
                let actions = [];

                actions.push(<CustomButton
                    key={2}
                    text="View"
                    style={{marginRight: '10px'}}
                    onClick={() => viewProfile(record.user_id)}
                />)

                actions.push(
                    <Popover content={content(record.user_id, "LOCAL", record.wallet_balance)} title="Additional Actions" trigger="click" key={3}>
                        <CustomButton
                    text="Manage Wallet"
                    style={{marginRight: '10px'}}
                   />

                    </Popover>
                  );

                if (record.is_blocked) {
                    actions.push(<CustomButton
                        key={1}
                        text="Unblock" 
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                } else {
                    actions.push(<CustomButton
                        key={1}
                        text="Block"
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                }

                

                return actions;
            }
        }
    ];

    useEffect(() => { // fetch list of locals
        if (getLocalData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllLocal();
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val, 
                        key: val.user_id,
                    }));
                    setLocalData(tempData);
                    setGetLocalData(false);
                } else {
                    console.log("List of locals not fetched!");
                }
            }
    
            fetchData();
        }
    },[getLocalData]);

    // tourist
    const [getTouristData, setGetTouristData] = useState(true);
    const [touristData, setTouristData] = useState([]); // list of tourists

    const touristColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: (a, b) => a.user_id > b.user_id,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobile_num',
            key: 'mobile_num',
            sorter: (a, b) => (a.country_code + a.mobile_num).localeCompare((b.country_code + b.mobile_num)),
            ...getColumnSearchProps('mobile_num'),
            render: (text, record) => {
                return record.country_code + ' ' + record.mobile_num;
            }
        },
        {
            title: 'Allowed Login Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
            filters: [
                {
                  text: 'Allowed',
                  value: false,
                },
                {
                  text: 'Denied',
                  value: true,
                },
            ],
            onFilter: (value, record) => record.is_blocked === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text, record) => {
                let actions = [];

                actions.push(<CustomButton
                    key={2}
                    text="View"
                    style={{marginRight: '10px'}}
                    onClick={() => viewProfile(record.user_id)}
                />)

                if (record.is_blocked) {
                    actions.push(<CustomButton
                        key={1}
                        text="Unblock"
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                } else {
                    actions.push(<CustomButton
                        key={1}
                        text="Block"
                        onClick={() => toggleBlock(record.user_id)}
                        />)
                }

                return actions;
            }
        }
    ];
    
    useEffect(() => { // fetch list of tourist
        if (getTouristData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllTourist();
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val, 
                        key: val.user_id,
                    }));
                    setTouristData(tempData);
                    setGetTouristData(false);
                } else {
                    console.log("List of tourists not fetched!");
                }
            }
    
            fetchData();
        }
    },[getTouristData]);
    
    // form inputs for admin creation
    const [createAdminForm] = Form.useForm();
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false); // boolean to open modal
    const [createLoading, setCreateLoading] = useState(false);
    
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
        setCreateLoading(true);

        let adminObj = {
            name: values.name,
            email: values.email,
            is_blocked: values.is_blocked === "true" ? true : false,
            role: values.role,
            user_type: 'INTERNAL_STAFF'
        }
            
        let response = await createAdmin(adminObj);
        if (response.status) {
            createAdminForm.resetFields();
            setGetAdminData(true);
            setIsCreateAdminModalOpen(false);
            setCreateLoading(false);
            toast.success('Admin successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Admin creation failed!");
            console.log(response.data);
            setCreateLoading(false);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // blocking related
    const [blockedId, setBlockedId] = useState();

    function toggleBlock(id) {
        setBlockedId(id);
    }

    useEffect(() => {
        if (blockedId) {
            async function innerToggleBlock(blockedId) {
                let response = await toggleUserBlock(blockedId);
                if (response.status) {
                    console.log("User toggle block success!");
                    if (currentTab === '1') {
                        setGetAdminData(true);
                    } else if (currentTab === '2') {
                        setGetVendorStaffData(true);
                    } else if (currentTab === '3') {
                        setGetLocalData(true);
                    } else if (currentTab === '4') {
                        setGetTouristData(true);
                    }
                    toast.success('User login access successfully updated!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                } else {
                    console.log("User toggle block failed!");
                    toast.error(response.data.errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                }
            }

            innerToggleBlock(blockedId);
            setBlockedId(undefined);
        }
    },[blockedId])

    // view user profile related
    const [profileId, setProfileId] = useState();
    const [profileUser, setProfileUser] = useState();
    const [showUserCard, setShowUserCard] = useState(false);

    function viewProfile(id) {
        setProfileId(id);
    }

    useEffect(() => {
        if (profileId) {
            async function innerViewProfile(profileId) {
                let response = await viewUserProfile(profileId);
                if (response.status) {
                    console.log("User profile fetch success!");
                    console.log(response.data);
                    setProfileUser(response.data);
                    setShowUserCard(true);
                } else {
                    console.log("User profile fetch failed!");
                    toast.error(response.data.errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                }
            }

            innerViewProfile(profileId);
            setProfileId(undefined);
        }
    },[profileId])

    // close edit password modal
    function onCancelProfile() {
        setShowUserCard(false);
    }

    return admin ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={breadcrumbItems} />
                <Content style={styles.content}>
                    <CustomButton 
                        text="Create Admin"
                        style={{marginLeft: '3px', marginBottom: '20px'}}
                        icon={<UserAddOutlined />}
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
                            column={adminColumns}
                            data={adminData}
                        />
                    }
                    {currentTab === '2' && 
                        <CustomTablePagination
                            column={vendorStaffColumns}
                            data={vendorStaffData}
                        />
                    }
                    {/* locals */}
                    {currentTab === '3' && 
                        <CustomTablePagination
                            column={localColumns}
                            data={localData}
                        />
                    }
                    {/* tourist */}
                    {currentTab === '4' && 
                        <CustomTablePagination
                            column={touristColumns}
                            data={touristData}
                        />
                    }

                    {/* vendor */}
                    {currentTab === '5' && 
                        <CustomTablePagination
                            column={vendorColumns}
                            data={vendorData}
                        />
                    }

                    {/* Modal to create new admin account */}
                    <CreateAdminModal
                        form={createAdminForm}
                        loading={createLoading}
                        isCreateAdminModalOpen={isCreateAdminModalOpen}
                        onClickCancelAdminModal={onClickCancelAdminModal}
                        onClickSubmitAdminCreate={onClickSubmitAdminCreate}
                    />

                    {/* Modal to view user profile */}
                    <UserModal
                        user={profileUser}
                        showUserCard={showUserCard}
                        onCancelProfile={onCancelProfile}
                    />

                    <WalletModal
                        form={createWalletForm}
                        id={currentId}
                        type={currentType}
                        walletAmount={currentAmount}
                        isWalletModalOpen={isWalletModalOpen}
                        onCancelWalletModal={onCancelWalletModal}
                        onSubmitUpdateWallet={onSubmitUpdateWallet}
                    />

                    <TransactionsModal
                        id={currentId}
                        type={currentType}
                        isTransactionsModalOpen={isTransactionsModalOpen}
                        onCancelTransactionsModal={onCancelTransactionsModal}

                    />

                    {isSubModalOpen &&
                        <SubscriptionModal
                            operation={operation}
                            subscriptionDetails={subscriptionInfo}
                            isSubModalOpen={isSubModalOpen}
                            onClickSubmitSubscription={onClickSubmitSubscription}
                            onClickCancelManageSubButton={onClickCancelManageSubButton}
                        />
                    } 
                </Content>
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
        backgroundColor: 'white'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10
    },
}