import { Layout } from 'antd';
import {React, useContext, useEffect} from 'react';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import {getPendingApplications} from "../redux/adminRedux";
import axios, {Axios} from "axios";
import {AuthContext} from "../redux/AuthContext";

export default function Home() {
    const user = secureLocalStorage.getItem('user');
    console.log('getUser', user)

    return (
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />
                <Content style={styles.content}>
                    <div style={{ padding: 24, minHeight: 360 }}>content</div>
                </Content>

            </Layout>
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