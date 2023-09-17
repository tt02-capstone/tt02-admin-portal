import { Layout } from 'antd';
import { React, useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import { getPendingApplications, updateApplicationStatus } from '../redux/adminRedux';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function PendingApplications() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [vendorId, setVendorId] = useState("");
    const [newStatus, setNewStatus] = useState("");

    const breadcrumbItems = [
        {
            title: 'Pending Applications',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let listOfPendingApplications = await getPendingApplications();
                setData(listOfPendingApplications);
                setLoading(false);
            } catch (error) {
                alert('An error occurred! Failed to retrieve pending applications!');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const datasource = data.map((item, index) => {
        const formattedVendorType = item.vendor_type.charAt(0) + item.vendor_type.slice(1).toLowerCase();
        const poc_contact = item.country_code + ' ' + item.poc_mobile_num;

        return {
            key: index,
            vendor_id: item.vendor_id,
            business_name: item.business_name,
            vendor_type: formattedVendorType,
            service_description: item.service_description,
            poc_name: item.poc_name,
            poc_position: item.poc_position,
            poc_contact: poc_contact
        };
    });

    async function updateApplication() {
        setLoading(true);
        let successMessage = await updateApplicationStatus(vendorId, newStatus);
        if (newStatus === 'APPROVED') {
            successMessage = 'Application approved successfully';
        } else {
            successMessage = 'Application rejected successfully';
        }
        toast.success(successMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
        })
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    const showConfirmationDialog = (vendorId, newStatus) => {
        setVendorId(vendorId);
        setNewStatus(newStatus);
        setDialogVisible(true);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const handleConfirm = () => {
        updateApplication();
        setDialogVisible(false);
    };

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
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
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

    const columns = [
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
            dataIndex: 'poc_contact',
            key: 'poc_contact',
            width: 160,
            sorter: (a, b) => a.poc_contact.localeCompare(b.poc_contact),
            ...getColumnSearchProps('poc_contact'),
        },
        {
            title: 'Approve / Reject',
            key: 'approve_reject',
            dataIndex: 'approve_reject',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => showConfirmationDialog(record.vendor_id, 'APPROVED')} loading={loading} style={styles.button}>
                        Approve
                    </Button>
                    <br /><br />
                    <Button type="primary" onClick={() => showConfirmationDialog(record.vendor_id, 'REJECTED')} loading={loading} style={styles.button}>
                        Reject
                    </Button>
                </div>
            ),
        }
    ];

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={breadcrumbItems} />
            <Content style={styles.content}>
                <div>
                    <Table 
                        dataSource={datasource}
                        tableLayout='fixed'
                        columns={columns}
                        style={{ width: '98%' }}
                        loading={loading} />
                    <ConfirmationDialog
                        visible={isDialogVisible}
                        onCancel={handleCancel}
                        onConfirm={handleConfirm}
                    />
                    <ToastContainer />
                </div>
            </Content>
        </Layout >
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
        margin: '20px 30px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: '80%'
    }
}