import { Layout } from 'antd';
import { React, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import { getPendingApplications, updateApplicationStatus } from '../redux/adminRedux';
import { Table } from 'antd';
import {
    Button
} from 'antd';

export default function PendingApplications() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    async function updateApplication(vendorId, newStatus) {
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

    const columns = [
        {
            title: 'Business Name',
            dataIndex: 'business_name',
            key: 'business_name',
            width: 160
        },
        {
            title: 'Vendor Type',
            dataIndex: 'vendor_type',
            key: 'vendor_type',
            width: 160
        },
        {
            title: 'Service Description',
            dataIndex: 'service_description',
            key: 'service_description',
            width: 240
        },
        {
            title: 'POC Name',
            dataIndex: 'poc_name',
            key: 'poc_name',
            width: 160
        },
        {
            title: 'POC Position',
            dataIndex: 'poc_position',
            key: 'poc_position',
            width: 160
        },
        {
            title: 'POC Contact',
            dataIndex: 'poc_contact',
            key: 'poc_contact',
            width: 160
        },
        {
            title: 'Approve / Reject',
            key: 'approve_reject',
            dataIndex: 'approve_reject',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => updateApplication(record.vendor_id, 'APPROVED')} loading={loading} style={styles.button}>
                        Approve
                    </Button>
                    <br /><br />
                    <Button type="primary" onClick={() => updateApplication(record.vendor_id, 'REJECTED')} loading={loading} style={styles.button}>
                        Reject
                    </Button>
                </div>
            ),
        }
    ];

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader text={"Pending Applications"} />
            <Content style={styles.content}>
                <div>
                    <h1>List of Pending Applications</h1>
                    <Table dataSource={datasource} columns={columns} style={{ width: '98%' }} loading={loading} />
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