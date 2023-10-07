import { Layout , Badge, Tag} from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';
import { getAttractionList } from '../../redux/AttractionRedux';
import  { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CustomTablePagination from '../../components/CustomTablePagination';
import ViewTicketModal from './ViewTicketModal';
import CustomButton from '../../components/CustomButton';


export default function Attraction() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewId, setViewId] = useState();

    const breadCrumbItems = [
        {
            title: 'Attraction',
        },
    ]

    const showViewModal = (id) => {
        setViewId(id)
        setViewModal(true);
    }

    const viewModalCancel = () => {
        setViewModal(false);
        setViewId(null);
    }

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
        const priceList = item.price_list;

        const formatPriceList = priceList.map(priceItem => {
            return (
                <tr key={priceItem.ticket_type}>
                    <td>{priceItem.ticket_type}</td>
                    <td>${priceItem.local_amount} (Local)</td>
                    <td>${priceItem.tourist_amount} (Tourist)</td>
                </tr>
            );
        });

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

            const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');

        return {
            key: index,
            attraction_id : item.attraction_id,
            name: item.name,
            address: item.address,
            age_group: item.age_group,
            category: item.attraction_category, 
            description: item.description,
            status: item.is_published, // change to match others
            price_list: (
                <table>
                    <tbody>
                        {formatPriceList}
                    </tbody>
                </table>
            ),
            seasonal_activity_list: activityListString,
            estimated_price_tier: formattedPriceTier,
            attraction_image_list: item.attraction_image_list
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
            title: 'Cover Image',
            dataIndex: 'attraction_image_list',
            key: 'attraction_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Attraction"
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
            ...getColumnSearchProps('name')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address')
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
            sorter: (a, b) => a.age_group.localeCompare(b.age_group),
            ...getColumnSearchProps('age_group')
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
            ...getColumnSearchProps('category'),
            render: (attractionCategory) => {
                let tagColor = 'default'; 
                switch (attractionCategory) {
                    case 'HISTORICAL':
                        tagColor = 'purple';
                        break;
                    case 'CULTURAL':
                        tagColor = 'volcano';
                        break;
                    case 'NATURE':
                        tagColor = 'magenta';
                        break;
                    case 'ADVENTURE':
                        tagColor = 'geekblue';
                        break;
                    case 'SHOPPING':
                        tagColor = 'gold';
                        break;
                    case 'ENTERTAINMENT':
                        tagColor = 'cyan';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{attractionCategory}</Tag>
                );
            },
            width:140
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
            width:300
        },
        {
            title: 'Published',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width:100
        },
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            sorter: (a, b) => a.estimated_price_tier.localeCompare(b.estimated_price_tier),
            ...getColumnSearchProps('estiminated_price_tier'),
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
            width: 100,
        },
        {
            title: 'Seasonal Activity',
            dataIndex: 'seasonal_activity_list',
            key: 'seasonal_activity_list',
            sorter: (a, b) => a.seasonal_activity_list.localeCompare(b.seasonal_activity_list),
            ...getColumnSearchProps('seasonal_activity_list'),
            width:150
        },
        {
            title: 'Price List',
            dataIndex: 'price_list',
            key: 'price_list', 
            width: 250
        }, 
        {
            title: 'Action(s)',
            key: 'view',
            dataIndex: 'view',
            width: 200,
            align: 'center',
            render: (text, record) => (
                <div>
                    <CustomButton text="View Current Ticket(s)" onClick={() => showViewModal(record.attraction_id)} style={styles.button} />
                </div>
            ),
        }
    ];
    
    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={breadCrumbItems} />
             <Content style={styles.content}>
             
                <CustomTablePagination
                    title="Attraction"
                    column={columns}
                    data={datasource}
                    tableLayout="fixed"
                />

                <ViewTicketModal
                    isVisible={viewModal}
                    onCancel={viewModalCancel}
                    id={viewId}
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
        fontSize: 12,
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