import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Button, Tag, DatePicker, Row, Input, Col, Space } from 'antd';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getNumOf0AvailableRoomsListOnDateRange } from "../../redux/accommodationRedux";
import moment from 'moment';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;


export default function ViewRoomCount() {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state;
    const { Header, Content, Sider, Footer } = Layout;
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
            title: 'Room Count',
        }
    ];

    const [data, setData] = useState([]);

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

    const columns = [
        {
            title: 'Room Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                {
                  text: 'Standard',
                  value: 'STANDARD',
                },
                {
                    text: 'Double',
                    value: 'DOUBLE',
                },
                {
                    text: 'Suite',
                    value: 'SUITE',
                },
                {
                    text: 'Junior Suite',
                    value: 'JUNIOR_SUITE',
                },
                {
                    text: 'Deluxe Suite',
                    value: 'DELUXE_SUITE',
                },
            ],
            onFilter: (value, record) => record.type === value,
            render: (text, record) => {
                let color = 'default';
                let temp = text;
                switch (text) {
                    case 'STANDARD':
                        color = 'magenta';
                        temp = 'Standard'
                        break;
                    case 'DOUBLE':
                        color = 'volcano';
                        temp = 'Double'
                        break;
                    case 'SUITE':
                        color = 'geekblue';
                        temp = 'Suite'
                        break;
                    case 'JUNIOR_SUITE':
                        color = 'purple';
                        temp = 'Junior Suite'
                        break;
                    case 'DELUXE_SUITE':
                        color = 'cyan';
                        temp = 'Deluxe Suite'
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={color}>{temp}</Tag>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date > b.date,
            render(text) {
                return moment(text).format('LL');
            }
        },
        {
            title: 'Room Count',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count > b.count,
            ...getColumnSearchProps('count')
        },
    ];

    useEffect(() => {
        if (id) {
            form.resetFields();
        }
    }, [id]);

    async function onSearch(values) {

        var startDate = values.dateRange[0].format('YYYY-MM-DD');
        var endDate = values.dateRange[1].format('YYYY-MM-DD');

        let response = await getNumOf0AvailableRoomsListOnDateRange(id, startDate, endDate);
        if (response.status) {
            setData(response.data);
        } else {
            console.log("Room count list fetch failed!");
        }
    }

    return id ? (
            <div>
                <Layout style={styles.layout}>
                    <CustomHeader items={breadcrumbItems} />
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>

                            {/* form */}
                            <Form 
                                name="form"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600, marginTop: '10px' }}
                                required={true}
                                requiredMark={true}
                                onFinish={onSearch}
                            >
                                <Row>
                                    <Col>
                                        <Form.Item
                                            name="dateRange"
                                            label="Select Date Range:"
                                            labelAlign='left'
                                            rules={[{ required: true, message: 'Date range is required!'}]}
                                        >
                                            <RangePicker
                                                format="YYYY-MM-DD"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                                            <Button type="primary" style={{backgroundColor: '#FFA53F'}} htmlType="submit">
                                                Search
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>

                            {/* table */}
                            <CustomTablePagination
                                column={columns}
                                data={data}
                                tableLayout="fixed"
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
        alignSelf: 'left',
        alignItems: 'left',
        justifyContent: 'left',
        width: "90%"
    },
}