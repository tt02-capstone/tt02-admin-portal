import { getAllRestaurant, getRestaurantDish } from "../../redux/restaurantRedux";
import  { Table, Input, Button, Space , Badge, Layout, Form, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import ViewAllDishModal from "./viewAllDishModal";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';

export default function Restaurant() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [getRestaurantData, setGetRestaurantData] = useState(true);
    const [selectedRestId, setSelectedRestId] = useState("");
    const [data, setData] = useState([]); // list of restaurant 
    
    const restBreadCrumb = [
        {
          title: 'Restaurant',
        }
    ];

    useEffect(() => {
        if (getRestaurantData) {
            const fetchData = async () => {
                const response = await getAllRestaurant();
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.restaurant_id,
                    }));
                    setData(tempData);
                    setGetRestaurantData(false);
                } else {
                    console.log("List of restaurant not fetched!");
                }
            }

            fetchData();
            setGetRestaurantData(false);
        }
    }, [getRestaurantData]);

    // table filters 
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

    const datasource = Array.isArray(data) ? data.map((item, index) => {
        const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
        const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');

        return {
            key: index,
            restaurant_id : item.restaurant_id,
            name: item.name,
            description: item.description,
            address: item.address,
            opening_hours: item.opening_hours,
            contact_num: formattedContactNum,
            is_published: item.is_published,
            suggested_duration: item.suggested_duration,
            restaurant_type: item.restaurant_type,
            generic_location: formattedGenericLocation,
            estimated_price_tier: formattedPriceTier
        };
    }) : [];
    
    const columns = [
        {
            title: 'Restaurant Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
            width: 250
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
            width: 300
        },
        {
            title: 'Type',
            dataIndex: 'restaurant_type',
            key: 'restaurant_type',
            sorter: (a, b) => a.restaurant_type.localeCompare(b.restaurant_type),
            ...getColumnSearchProps('restaurant_type'),
            render: (type) => {
                let tagColor = 'default'; 
                switch (type) {
                    case 'FAST_FOOD':
                        tagColor = 'purple';
                        break;
                    case 'CHINESE':
                        tagColor = 'volcano';
                        break;
                    case 'MEIXCAN':
                        tagColor = 'magenta';
                        break;
                    case 'KOREAN':
                        tagColor = 'geekblue';
                        break;
                    case 'WESTERN':
                        tagColor = 'gold';
                        break;
                    case 'JAPANESE':
                        tagColor = 'cyan';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{type}</Tag>
                );
            },
            width: 180
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address'),
            width: 200
        },
        {
            title: 'Opening Hours',
            dataIndex: 'opening_hours',
            key: 'opening_hours',
            sorter: (a, b) => a.opening_hours.localeCompare(b.opening_hours),
            ...getColumnSearchProps('opening_hours'),
            width: 150
        },
        {
            title: 'Contact No.',
            dataIndex: 'contact_num',
            key: 'contact_num',
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num'),
            width: 150,
            
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            sorter: (a, b) => String(a.is_published).localeCompare(String(b.is_published)),
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 150,
        },
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            sorter: (a, b) => a.estimated_price_tier.localeCompare(b.estimated_price_tier),
            render: (priceTier) => {
                let tagColor = 'default'; 
                switch (priceTier) {
                    case 'TIER 0':
                        tagColor = 'grey';
                        break;
                    case 'TIER 1':
                        tagColor = 'green';
                        break;
                    case 'TIER 2':
                        tagColor = 'orange';
                        break;
                    case 'TIER 3':
                        tagColor = 'red';
                        break;
                    case 'TIER 4':
                        tagColor = 'blue';
                        break;
                    case 'TIER 5':
                        tagColor = 'yellow';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{priceTier}</Tag>
                );
            },
            width: 100,
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <CustomButton
                        text="View All Dish"
                        style ={{ fontSize : 12, fontWeight: "bold"}}
                        onClick={() => onClickViewAllDish(record.restaurant_id)}
                    />
                    <br/><br/>
                </div>
            },
            width: 200,
        },
    ];

    // view all dish 
    const[isViewAllDishModalOpen, setIsViewAllDishModalOpen] = useState(false);

    function onClickViewAllDish(restId) {
        setSelectedRestId(restId);
        setIsViewAllDishModalOpen(true);
    }

    function onClickCancelViewAllDish() {
        setIsViewAllDishModalOpen(false);
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={restBreadCrumb}/>
             <Content style={styles.content}>

                <CustomTablePagination
                    title="Restaurants"
                    column={columns}
                    data={datasource}
                    tableLayout="fixed"
                />

                {/* view all dish by restaurant */}
                <ViewAllDishModal
                    isViewAllDishModalOpen={isViewAllDishModalOpen}
                    onClickCancelViewAllDish={onClickCancelViewAllDish}
                    restId={selectedRestId}
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
        minWidth: '90vw',
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}