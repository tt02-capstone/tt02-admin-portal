import Navbar from "../components/Navbar"
import {Layout} from 'antd';
import React from "react";

export default function Home() {

    const { Header, Content, Sider, Footer } = Layout;

    return (
            <Layout style={{minHeight: '100vh'}}>
                <Header style={{ padding: 0, background: 'blue' }} />

                    
                        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                            Content
                        </Content>

                <Footer>
                            Footer
                </Footer>
            </Layout>
    )
}