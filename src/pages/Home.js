import {Card, Col, Layout, Row} from 'antd';
import {React, useContext, useEffect} from 'react';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import {Link, Navigate} from 'react-router-dom';
import {getPendingApplications} from "../redux/adminRedux";
import {AuthContext, TOKEN_KEY} from "../redux/AuthContext";

export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'));
    const context = useContext(AuthContext);
    console.log('getUser', user)

    const { Meta } = Card;

    const breadCrumbItems = [
        {
            title: 'Home',
        },
    ]


    return (
            <Layout style={styles.layout}>
                <CustomHeader items={breadCrumbItems} />
                <Content style={styles.content}>
                    <div>
                        <Row gutter={100}>
                            <Col span={8}>
                                <Link to={'/attraction'}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 350,
                                            height: 400,
                                            margin: '15px 0'
                                        }}
                                        cover={<img alt="attractions" src="http://tt02.s3-ap-southeast-1.amazonaws.com/static/web/attractions.png" style={{width:300, height:300}}/>}
                                        bordered={false}
                                    >
                                        <Meta
                                            title="Attraction"
                                            description="Attraction Overview"/>
                                    </Card>
                                </Link>
                            </Col>
                            <Col span={8}>
                                <Link to={'/'}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 350,
                                            height: 400,
                                            margin: '15px 0'
                                        }}
                                        cover={<img alt="example" src="http://tt02.s3-ap-southeast-1.amazonaws.com/static/web/hotel.png" style={{width:300, height:300}}/>}
                                        bordered={false}
                                    >
                                        <Meta title="Accomodation" description="Accomodation Overview"/>
                                    </Card>
                                </Link>
                            </Col>
                            <Col span={8}>
                                <Link to={'/'}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 350,
                                            height: 400,
                                            margin: '15px 0'
                                        }}
                                        cover={<img alt="restaurant" src="http://tt02.s3-ap-southeast-1.amazonaws.com/static/web/restaurant.png" style={{width:300, height:300}} />}
                                        bordered={false}
                                    >
                                        <Meta title="Restaurant" description="Restaurant Overview"/>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>
                        <Row gutter={100}>
                            <Col span={8}>
                                <Link to={'/telecom'}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 350,
                                            height: 400,
                                            margin: '100px 0'
                                        }}
                                        cover={<img alt="telecom" src="http://tt02.s3-ap-southeast-1.amazonaws.com/static/web/telecom.png" style={{width:300, height:300}}/>}
                                        bordered={false}
                                    >
                                        <Meta
                                            title="Telecom Packages"
                                            description="Telecom Package Overview"/>
                                    </Card>
                                </Link>
                            </Col>
                            <Col span={8}>
                                <Link to={'/'}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 350,
                                            height: 400,
                                            margin: '100px 0'
                                        }}
                                        cover={<img alt="deals" src="http://tt02.s3-ap-southeast-1.amazonaws.com/static/web/discount.png" style={{width:300, height:300}}/>}
                                        bordered={false}
                                    >
                                        <Meta
                                            title="Deals and Discount"
                                            description="Deals and Discount Overview"/>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>
                    </div>

                </Content>

            </Layout>
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
        justifyContent: 'center'
    },
}