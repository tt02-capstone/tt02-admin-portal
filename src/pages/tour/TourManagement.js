import { React, useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import { getAllTourTypesCreated, adminUpdateTourType } from '../../redux/tourRedux';
import { Layout, Form, Input, Badge, Space, Tag, Button, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from "axios";
import ViewTourTypeModal from "./ViewTourTypeModal";
import CustomButton from "../../components/CustomButton";

export default function TourManagement() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTourTypeId, setSelectedTourTypeId] = useState(null);

    const breadcrumbItems = [
        {
            title: 'Tours',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let listOfTourTypes = await getAllTourTypesCreated();
                setData(listOfTourTypes.data);
                setLoading(false);

            } catch (error) {
                alert('An error occurred! Failed to retrieve list of tours!');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const datasource = data.length
        ? data.map((val) => ({
            ...val,
            no_of_tours: val && val.tour_list ? val.tour_list.length : 0,
            key: val.user_id,
        }))
        : [];

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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 50,
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 70,
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Price per Pax',
            dataIndex: 'price',
            key: 'price',
            width: 40,
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price'),
            render: (text, record) => {
                // Assuming 'text' is the price value from your data
                return `$${text}`;
            },
        },
        {
            title: 'No. of Pax',
            dataIndex: 'recommended_pax',
            key: 'recommended_pax',
            width: 40,
            sorter: (a, b) => a.recommended_pax - b.recommended_pax,
            ...getColumnSearchProps('recommended_pax'),
        },
        {
            title: 'Est. Duration',
            dataIndex: 'estimated_duration',
            key: 'estimated_duration',
            width: 40,
            sorter: (a, b) => a.estimated_duration - b.estimated_duration,
            ...getColumnSearchProps('estimated_duration'),
            render: (text, record) => {
                // Assuming 'text' is the price value from your data
                return `${text} Hours`;
            },
        },
        {
            title: 'No. of Tours',
            dataIndex: 'no_of_tours',
            key: 'no_of_tours',
            width: 40,
            sorter: (a, b) => a.no_of_tours - b.no_of_tours,
            ...getColumnSearchProps('no_of_tours')
        },
        {
            title: 'Special Notes',
            dataIndex: 'special_note',
            key: 'special_note',
            width: 60,
            sorter: (a, b) => a.special_note.localeCompare(b.special_note),
            ...getColumnSearchProps('special_note'),
            render: (text) => {
                if (text === null) {
                    return "-";
                }
                return text;
            },
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
            width: 40,
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
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <Space>
                        <CustomButton key='1' text="View" style={{ fontWeight: "bold" }} onClick={() => onClickOpenViewTourTypeModal(record.tour_type_id)} />
                        {record.is_published && <CustomButton key='1' text="Unpublish" style={{ fontWeight: "bold" }} onClick={() => updatePublishedStatus(record)} />}
                        {!record.is_published && <CustomButton key='1' text="Publish" style={{ fontWeight: "bold" }} onClick={() => updatePublishedStatus(record)} />}
                    </Space>
                </div>
            },
            width: 70,
        }
    ];

    // View details of Tour Type
    const [isViewTourTypeModalOpen, setIsViewTourTypeModalOpen] = useState(false);

    function onClickOpenViewTourTypeModal(tourTypeId) {
        setSelectedTourTypeId(tourTypeId);
        setIsViewTourTypeModalOpen(true);
    }

    function onClickCancelViewTourTypeModal() {
        setIsViewTourTypeModalOpen(false);
    }

    const updatePublishedStatus = async (record) => {
        try {
            let newPublishedStatus;
            if (record.is_published) {
                newPublishedStatus = false;
            } else {
                newPublishedStatus = true;
            }

            setLoading(true);
            console.log(record.tour_type_id);
            await adminUpdateTourType(record.tour_type_id, newPublishedStatus);
            toast.success(`Tour type ${newPublishedStatus ? 'published' : 'unpublished'} successfully.`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            let listOfTourTypes = await getAllTourTypesCreated();
            setData(listOfTourTypes.data);
            setLoading(false);
        } catch (error) {
            toast.error(`Failed to update published status: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setLoading(false);
        }
    };

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={breadcrumbItems} />
            <Content style={styles.content}>
                <div>
                    <Table
                        dataSource={datasource}
                        tableLayout='fixed'
                        columns={columns}
                        style={{ width: '98%' }}
                        loading={loading} />

                    {/* Modal to view tour type */}
                    <ViewTourTypeModal
                        isViewTourTypeModalOpen={isViewTourTypeModalOpen}
                        onClickCancelViewTourTypeModal={onClickCancelViewTourTypeModal}
                        tourTypeId={selectedTourTypeId}
                    />
                    <ToastContainer />
                </div>
            </Content>
        </Layout >
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
        justifyContent: 'center',
        marginTop: -10
    },
    button: {
        width: '80%'
    }
}