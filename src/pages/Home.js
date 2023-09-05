import {Layout} from 'antd';
import React from "react";
import CustomHeader from "../components/CustomHeader";
import {Content} from "antd/es/layout/layout";

export default function Home() {


    return (
            <Layout style={{minHeight: '100vh'}}>
                <CustomHeader text={"Header"} />

                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360 }}>content</div>
                </Content>

            </Layout>
    )
}