import { getAllRestaurant, getRestaurantDish } from "../../redux/restaurantRedux";
import { Table, Input, Button, Space, Badge, Layout, Form, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { React, useEffect, useState, useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import ViewAllDishModal from "./viewAllDishModal";
import ViewRestaurantModal from './ViewRestaurantModal';
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

    // view restaurant details  
    const [isViewRestaurantModalOpen, setIsViewRestaurantModalOpen] = useState(false);

    function onClickOpenViewRestaurantModal(restId) {
        setSelectedRestId(restId);
        setIsViewRestaurantModalOpen(true);
    }

    function onClickCancelViewRestaurantModal() {
        setIsViewRestaurantModalOpen(false);
    }

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
        const formatType = item.restaurant_type.split('_').join(' ');

        return {
            key: index,
            restaurant_id: item.restaurant_id,
            name: item.name,
            description: item.description,
            address: item.address,
            opening_hours: item.opening_hours,
            contact_num: formattedContactNum,
            is_published: item.is_published,
            suggested_duration: item.suggested_duration,
            restaurant_type: formatType,
            generic_location: formattedGenericLocation,
            estimated_price_tier: formattedPriceTier,
            restaurant_image_list: item.restaurant_image_list
        };
    }) : [];

    const columns = [
        {
            title: 'Cover Image',
            dataIndex: 'restaurant_image_list',
            key: 'restaurant_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Restaurant"
                                style={styles.image}
                            />
                        </div>
                    );
                }
                return 'No Image';
            },
        },
        {
            title: 'Restaurant Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description')
        },
        {
            title: 'Restaurant Type',
            dataIndex: 'restaurant_type',
            key: 'restaurant_type',
            filters: [
                {
                    text: 'Fast Food',
                    value: 'FAST FOOD',
                },
                {
                    text: 'Chinese',
                    value: 'CHINESE',
                },
                {
                    text: 'Mexican',
                    value: 'MEXICAN',
                },
                {
                    text: 'Korean',
                    value: 'KOREAN',
                },
                {
                    text: 'Western',
                    value: 'WESTERN',
                },
                {
                    text: 'Japanese',
                    value: 'JAPANESE',
                }
            ],
            onFilter: (value, record) => record.restaurant_type.indexOf(value) === 0,
            render: (type) => {
                let tagColor = 'default';
                switch (type) {
                    case 'FAST FOOD':
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
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address')
        },
        {
            title: 'Opening Hours',
            dataIndex: 'opening_hours',
            key: 'opening_hours',
            sorter: (a, b) => a.opening_hours.localeCompare(b.opening_hours),
            ...getColumnSearchProps('opening_hours')
        },
        {
            title: 'Contact No.',
            dataIndex: 'contact_num',
            key: 'contact_num',
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num')
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
            width: 100
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
            width: 100
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="horizontal">
                            <CustomButton
                                text="View"
                                style={{ fontWeight: "bold" }}
                                onClick={() => onClickOpenViewRestaurantModal(record.restaurant_id)}
                            />
                            <CustomButton
                                text="View Menu"
                                style={{ fontSize: 12, fontWeight: "bold" }}
                                onClick={() => onClickViewAllDish(record.restaurant_id)}
                            />
                        </Space>
                    </div>
                </div>
            },
            width: 180
        },
    ];

    // view all dish 
    const [isViewAllDishModalOpen, setIsViewAllDishModalOpen] = useState(false);

    function onClickViewAllDish(restId) {
        setSelectedRestId(restId);
        setIsViewAllDishModalOpen(true);
    }

    function onClickCancelViewAllDish() {
        setIsViewAllDishModalOpen(false);
    }

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={restBreadCrumb} />
            <Content style={styles.content}>

                <CustomTablePagination
                    title="Restaurants"
                    column={columns}
                    data={datasource}
                    tableLayout="fixed"
                />

                <ViewRestaurantModal
                    isViewRestaurantModalOpen={isViewRestaurantModalOpen}
                    onClickCancelViewRestaurantModal={onClickCancelViewRestaurantModal}
                    restId={selectedRestId}
                />

                {/* view all dish by restaurant */}
                <ViewAllDishModal
                    isViewAllDishModalOpen={isViewAllDishModalOpen}
                    onClickCancelViewAllDish={onClickCancelViewAllDish}
                    restId={selectedRestId}
                />
            </Content>
        </Layout>
    ) :
        (
            <Navigate to="/" />
        )
}


const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    },
    imageContainer: {
        maxWidth: '180px',
        maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}