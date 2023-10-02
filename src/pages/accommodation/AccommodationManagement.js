import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {getAllAccommodations} from "../../redux/accommodationRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewAccommodationModal from "./ViewAccommodationModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

export default function AccommodationManagement() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const admin = JSON.parse(localStorage.getItem("user"));

    const [getAccommodationsData, setGetAccommodationsData] = useState(true);
    const [accommodationsData, setAccommodationsData] = useState([]);
    const [selectedAccommodationId, setSelectedAccommodationId] = useState(null);
    const [selectedAccommodation, setSelectedAccommodation] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [accommodationImages, setAccommodationImages] = useState({});

    const viewAccommodationBreadCrumb = [
        {
            title: 'Accommodation',
        }
    ];

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

    const accommodationsColumns = [
        {
            title: 'Cover Image',
            dataIndex: 'accommodation_image_list',
            key: 'accommodation_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Accommodation"
                                style={styles.image}
                            />
                        </div>
                    );
                }
                return 'No Image';
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
            ...getColumnSearchProps('type'),
            render: (type) => {
                let tagColor = 'default';
                switch (type) {
                    case 'HOTEL':
                        tagColor = 'purple';
                        break;
                    case 'AIRBNB':
                        tagColor = 'volcano';
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
            title: 'Area',
            dataIndex: 'generic_location',
            key: 'generic_location',
            sorter: (a, b) => a.generic_location.localeCompare(b.generic_location),
            ...getColumnSearchProps('generic_location'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Contact Num',
            dataIndex: 'contact_num',
            key: 'contact_num',
            width: 120,
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num'),
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 100,
        },
        // total rooms
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            render: (priceTier) => {
                let tagColor = 'default';
                switch (priceTier) {
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
            sorter: (a, b) => {
                const tierA = a.estimated_price_tier || '';
                const tierB = b.estimated_price_tier || '';
            
                return tierA.localeCompare(tierB);
              },
            width: 100,
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="vertical">
                            <CustomButton
                                text="View Details"
                                onClick={() => onClickOpenViewAccommodationModal(record.accommodation_id)}
                            />
                            <CustomButton
                                text="View Room Count"
                                onClick={() => onClickViewRoomCount(record.accommodation_id)}
                            />
                        </Space>
                    </div>
                </div>

            },
            width: 160,
        },
    ];

    function formatAccommodationData(accommodationDataArray) {
        return accommodationDataArray.map(item => {
            // const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
            // const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            // const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
            const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;

            return {
                accommodation_id: item.accommodation_id,
                name: item.name,
                description: item.description,
                address: item.address,
                // contact_num: formattedContactNum,
                contact_num: item.contact_num,
                accommodation_image_list: item.accommodation_image_list,
                is_published: item.is_published,
                check_in_time: item.check_in_time,
                check_out_time: item.check_out_time,
                type: item.type,
                generic_location: item.generic_location,
                estimated_price_tier: item.estimated_price_tier,
                // generic_location: formattedGenericLocation,
                // estimated_price_tier: formattedPriceTier,
                room_list: item.room_list,
            };
        });
    }

    useEffect(() => {
        if (getAccommodationsData) {
            const fetchData = async () => {
                const response = await getAllAccommodations();
                console.log('response:', response);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setAccommodationsData(tempData);
                    setGetAccommodationsData(false);
                } else {
                    console.log("List of accommodations not fetched!");
                }
            }

            fetchData();
            setGetAccommodationsData(false);
        }
    }, [getAccommodationsData]);

    // view room count page
    function onClickViewRoomCount(id) {
        navigate('/accommodation/viewRoomCount', { state: { id } });
    }
    
    // view attraction
    const [isViewAccommodationModalOpen, setIsViewAccommodationModalOpen] = useState(false);

    //view attraction modal open button
    function onClickOpenViewAccommodationModal(accommodationId) {
        setSelectedAccommodationId(accommodationId);
        setIsViewAccommodationModalOpen(true);

    }

    // view attraction modal cancel button
    function onClickCancelViewAccommodationModal() {
        setIsViewAccommodationModalOpen(false);
    }

    useEffect(() => {
    }, [selectedAccommodation, selectedAccommodationId, roomList, accommodationsData])

    return admin ? (
            <div>
                <Layout style={styles.layout}>
                    <CustomHeader items={viewAccommodationBreadCrumb} />
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>

                            <CustomTablePagination
                                title="Accommodations"
                                column={accommodationsColumns}
                                data={formatAccommodationData(accommodationsData)}
                                tableLayout="fixed"
                            />

                            <ViewAccommodationModal
                                isViewAccommodationModalOpen={isViewAccommodationModalOpen}
                                onClickCancelViewAccommodationModal={onClickCancelViewAccommodationModal}
                                accommodationId={selectedAccommodationId}
                            />

                        </Content>
                    </Layout>
                </Layout>

                <ToastContainer />
            </div>
        ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '91.5vw'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%"
    },
    customRow: {
        height: '280px',
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