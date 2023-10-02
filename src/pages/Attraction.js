import { Layout } from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';
import { getAttractionList } from '../redux/AttractionRedux';
import  { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CustomTablePagination from '../components/CustomTablePagination';

export default function Attraction() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const breadCrumbItems = [
        {
            title: 'Attraction',
        },
    ]

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

        const activityList = item.seasonal_activity_list;

            const validActivityList = activityList.filter(item => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0'); // format to current timezone 
    
                const todayFormatted = `${year}-${month}-${day}`;
    
                return item.start_date >= todayFormatted && item.end_date >=  todayFormatted;
            });

            let activityListString; 

            if (validActivityList.length > 0) {
                activityListString = validActivityList.map((item, index) => {
                    return `${index + 1}. ${item.name} from ${item.start_date} to ${item.end_date}`;
                }).join('\n');
            } else {
                activityListString = 'No Activities Created!';
            }

        return {
            key: index,
            name: item.name,
            address: item.address,
            age_group: item.age_group,
            category: item.attraction_category, 
            description: item.description,
            status: publishedStatus,
            price_list: priceListString,
            seasonal_activity_list: activityListString
        };
    });
    
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
            width: 130
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address'),
            width: 180
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
            sorter: (a, b) => a.age_group.localeCompare(b.age_group),
            ...getColumnSearchProps('age_group'),
            width: 130
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category', 
            sorter: (a, b) => a.category.localeCompare(b.category),
            ...getColumnSearchProps('category'),
            width: 130
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
            width: 180
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status', 
            sorter: (a, b) => a.status.localeCompare(b.status),
            ...getColumnSearchProps('status'),
            width: 100
        },
        {
            title: 'Seasonal Activity',
            dataIndex: 'seasonal_activity_list',
            key: 'seasonal_activity_list',
            sorter: (a, b) => a.seasonal_activity_list.localeCompare(b.seasonal_activity_list),
            ...getColumnSearchProps('seasonal_activity_list'),
            width: 150
        },
        {
            title: 'Price List',
            dataIndex: 'price_list',
            key: 'price_list', 
            sorter: (a, b) => a.price_list.localeCompare(b.price_list),
            ...getColumnSearchProps('price_list'),
            width: 150
        }
    ];
    
    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={breadCrumbItems} />
             <Content style={styles.content}>
             {/* <div>
                <Table dataSource={datasource} columns={columns} style={{ width : '98%' }} />
            </div> */}
             <CustomTablePagination
                title="Attraction"
                column={columns}
                data={datasource}
                tableLayout="fixed"
            />
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