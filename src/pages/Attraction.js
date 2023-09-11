import { Layout } from 'antd';
import { React , useEffect, useState } from 'react';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';
import { getAttractionList } from '../redux/AttractionRedux';
import  {  Space, Table, Tag  } from 'antd';

export default function Attraction() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try {
                let listOfAttractions = await getAttractionList();
                setData(listOfAttractions);
                setLoading(false);
            } catch (error) {
                alert ('An error occur! Failed to retrieve attraction list!');
                setLoading(false);
            }    
        };
        fetchData();
    }, []);

    const datasource = data.map((item, index) => {
        const publishedStatus = item.is_published ? 'Published' : 'Not Published';
        const priceList = item.price_list;

        const formatPriceList = priceList.map(item => {
            return `${item.ticket_type}: Local $${item.local_amount}, Tourist $${item.tourist_amount}`;
        });

        const priceListString = formatPriceList.join('\n');

        return {
            key: index,
            name: item.name,
            address: item.address,
            age_group: item.age_group,
            category: item.attraction_category, 
            description: item.description,
            status: publishedStatus,
            price_list: priceListString
        };
    });
    

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
            width: 350
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category', 
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            width: 800
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status', 
        },
        {
            title: 'Price List',
            dataIndex: 'price_list',
            key: 'price_list', 
            width: 220
        }
    ];
    
    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader text={"Attractions"}/>
             <Content style={styles.content}>
             <div>
                <h1>List of Attractions</h1>
                <Table dataSource={datasource} columns={columns} style={{ width : '98%' }} />
            </div>
             </Content>
        </Layout>
    ):
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
}