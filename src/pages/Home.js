import Navbar from "../components/Navbar"
import {Layout} from 'antd';

export default function Home() {

    const { Header, Content, Sider, Footer } = Layout;

    return (
        <div>
            <Layout style={{height: '100%'}}>
                <Sider width={200} style={{backgroundColor: 'white'}}>
                    <Navbar />
                </Sider>

                <Layout>
                    <Header style={{ backgroundColor: 'white' }}>
                        Header
                    </Header>
                    
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                            Content
                        </Content>
                    
                        <Footer>
                            Footer
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}