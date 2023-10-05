import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import {getAllDealList} from "../../redux/dealRedux";
import { SearchOutlined, StarFilled, PlusCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ViewDealModal from "./ViewDealModal";
import moment from "moment/moment";

export default function DealManagement() {

    const navigate = useNavigate();
    const [form] = Form.useForm(); // create
    const [editForm] = Form.useForm(); // create
    const { Content } = Layout;
    const user = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
            title: 'Deals',
        },
    ];

    // view deal modal
    const [viewDealModal, setViewDealModal] = useState(false);
    const [viewDealId, setViewDealId] = useState();


    // table
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

    const column = [
        {
            title: 'Cover Image',
            dataIndex: 'deal_image_list',
            key: 'deal_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Deal"
                                style={styles.image}
                            />
                        </div>
                    );
                }
                return 'No Image';
            },
        },{
            title: 'Promo Code',
            dataIndex: 'promo_code',
            key: 'promo_code',
            sorter: (a, b) => a.promo_code.localeCompare(b.promo_code),
            ...getColumnSearchProps('promo_code'),
        },
        {
            title: 'Discount',
            dataIndex: 'discount_percent',
            key: 'discount_percent',
            sorter: (a, b) => a.discount_percent > b.discount_percent,
            ...getColumnSearchProps('discount_percent'),
            render: (discount_percent) => `${discount_percent}%`,
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            filters: [
                {
                    text: 'Published',
                    value: true,
                },
                {
                    text: 'Hidden',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_published === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>Yes</p>
                } else {
                    return <p>No</p>
                }
            }
        },
        {
            title: 'Government Voucher',
            dataIndex: 'is_govt_voucher',
            key: 'is_govt_voucher',
            filters: [
                {
                    text: 'Yes',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_govt_voucher === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>Yes</p>
                } else {
                    return <p>No</p>
                }
            }
        },
        {
            title: 'Type',
            dataIndex: 'deal_type',
            key: 'deal_type',
            filters: [
                {
                    "text": "CHINESE NEW YEAR",
                    "value": "CHINESE_NEW_YEAR"
                },
                {
                    "text": "NATIONAL DAY",
                    "value": "NATIONAL_DAY"
                },
                {
                    "text": "DEEPAVALLI",
                    "value": "DEEPAVALLI"
                },
                {
                    "text": "VALENTINES",
                    "value": "VALENTINES"
                },
                {
                    "text": "NEW YEAR DAY",
                    "value": "NEW_YEAR_DAY"
                },
                {
                    "text": "HARI RAYA",
                    "value": "HARI_RAYA"
                },
                {
                    "text": "NUS WELLBEING DAY",
                    "value": "NUS_WELLBEING_DAY"
                },
                {
                    "text": "SINGLES DAY",
                    "value": "SINGLES_DAY"
                },
                {
                    "text": "BLACK FRIDAY",
                    "value": "BLACK_FRIDAY"
                },
                {
                    "text": "CHRISTMAS",
                    "value": "CHRISTMAS"
                },
                {
                    "text": "GOVERNMENT",
                    "value": "GOVERNMENT"
                }
            ],
            onFilter: (value, record) => record.deal_type === value,
            render: (text, record) => { //"pink", "red", "orange", "yellow", "volcano", "geekblue", "lime", "gold"
                if (text === 'CHINESE_NEW_YEAR') {
                    return <Tag color="green">CHINESE NEW YEAR</Tag>
                } else if (text === 'NATIONAL_DAY') {
                    return <Tag color="cyan">NATIONAL DAY</Tag>
                } else if (text === 'DEEPAVALLI') {
                    return <Tag color="blue">DEEPAVALLI</Tag>
                } else if (text === 'NUS_WELLBEING_DAY') {
                    return <Tag color="geekblue">NUS WELLBEING DAY</Tag>
                } else if (text === 'SINGLES_DAY') {
                    return <Tag color="purple">SINGLES DAY</Tag>
                } else if (text === 'VALENTINES') {
                    return <Tag color="pink">VALENTINES</Tag>
                } else if (text === 'HARI_RAYA') {
                    return <Tag color="yellow">HARI RAYA</Tag>
                } else if (text === 'NEW_YEAR_DAY') {
                    return <Tag color="volcano">NEW YEAR DAY</Tag>
                } else if (text === 'BLACK_FRIDAY') {
                    return <Tag color="lime">BLACK FRIDAY</Tag>
                } else if (text === 'CHRISTMAS') {
                    return <Tag color="gold">CHRISTMAS</Tag>
                } else if (text === 'GOVERNMENT') {
                    return <Tag color="orange">GOVERNMENT</Tag>
                } else {
                    return <p>Bug</p>
                }

                return <Tag color="magenta">{text}</Tag>
            }
        },
        {
            title: 'Publish Date',
            dataIndex: 'publish_date',
            key: 'publish_date',
            sorter: (a, b) => a.publish_date > b.publish_date,
            ...getColumnSearchProps('publish_date'),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
            sorter: (a, b) => new Date(a.start_datetime) > new Date(b.start_datetime),
            ...getColumnSearchProps('start_datetime'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
            sorter: (a, b) => new Date(a.end_datetime) > new Date(b.end_datetime),
            ...getColumnSearchProps('end_datetime'),
        },
        {
            title: 'Action(s)',
            dataIndex: 'deal_id',
            key: 'deal_id',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <CustomButton key='1' text="View" onClick={() => onOpenViewModal(record.deal_id)} style={{marginRight: '10px', fontWeiight:"bold"}} />
                </div>
            ),
        }
    ];

    // fetch deal list
    const [dealList, setDealList] = useState([]);
    const [fetchDealList, setFetchDealList] = useState(true);

    useEffect(() => {
        console.log('hereee')
        console.log(user && user.user_type === 'INTERNAL_STAFF' && fetchDealList)
        if (user && user.user_type === 'INTERNAL_STAFF' && fetchDealList) {
            const fetchData = async () => {
                const response = await getAllDealList();
                if (response.status) {
                    console.log(response)
                    var tempData = response.data.map((val) => ({
                        ...val,
                        publish_date: moment(val.publish_date).format('ll'),
                        start_datetime: moment(val.start_datetime).format('llll'),
                        end_datetime: moment(val.end_datetime).format('llll'),
                        key: val.user_id,
                    }));
                    setDealList(tempData);
                    setFetchDealList(false);
                } else {
                    console.log("Deal list not fetched!");
                }
            }

            fetchData();
        }
    },[user, fetchDealList]);


    // open view modal
    function onOpenViewModal(id) {
        setViewDealId(id);
        setViewDealModal(true);
    }

    // close view modal
    function onCancelViewModal() {
        setViewDealModal(false);
    }

    return user ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={breadcrumbItems}/>
                <Content style={styles.content}>
                    <br /><br />
                    <CustomTablePagination column={column} data={dealList} rowKey="deal_id" tableLayout={"fixed"}/>

                    {/* Modal to view deal */}
                    <ViewDealModal
                        selectedDealId={viewDealId}
                        viewDealModal={viewDealModal}
                        onCancelViewModal={onCancelViewModal}
                    />

                    <ToastContainer />
                </Content>
            </Layout>
        </div>
    ) : (
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
        marginTop: -45
    },
    imageContainer: {
        // maxWidth: '180px',
        // maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}