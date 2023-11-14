import { React , useEffect, useState , useRef} from 'react';
import { Content } from "antd/es/layout/layout";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from '../../components/CustomButton';
import { Layout, Space, Tag, Tabs, Badge, Input, Button } from 'antd';
import { Navigate, useParams, Link } from 'react-router-dom';
import { viewAllReportedPost, viewAllReportedComment, approveCommentReport, approvePostReport, rejectReport } from '../../redux/forumRedux';
import { ToastContainer, toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import CustomTablePagination from '../../components/CustomTablePagination';
import moment from 'moment';
import Highlighter from 'react-highlight-words';

export default function ManageForumReport() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { TabPane } = Tabs;
    const [triggerPost, setTriggerPost] = useState(true);
    const [triggerComment, setTriggerComment] = useState(true);
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])

    const forumBreadCrumb = [
        {
          title: 'Manage Forum Report',
        }
    ];

    const handleTabChange = (activeKey) => {
        if (activeKey === 'reportPost') {
            setTriggerPost(true); 
        } else if (activeKey === 'reportComment') {
            setTriggerComment(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let response = await viewAllReportedComment();
            if (response.status) {
                setComments([]);
                setComments(response.data);
            } else {
                console.log("Reported Comments not fetch!");
            }
        };

        if (triggerComment) {
            setTriggerComment(false);
            fetchData();
        }

    }, [triggerComment]);

    useEffect(() => {
        const fetchData = async () => {
            let response = await viewAllReportedPost();
            console.log(response.data)
            if (response.status) {
                setPosts([]);
                setPosts(response.data);
            } else {
                console.log("Reported Posts not fetch!");
            }
        };

        if (triggerPost) {
            fetchData();
            setTriggerPost(false)
        }
        
    }, [triggerPost]);

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

    const post_datasource = posts.length ? posts.map((item, index) => {
        return {
            key: index,
            creation_date: moment(item.creation_date).format('LL'),
            report_id: item.report_id,
            reason_type: item.reason_type,
            reason: item.content,
            post: item.reported_post,
            post_name: item.reported_post.title,
            resolved: item.is_resolved
        };
    }): []

    const post_columns = [
        {
            title: 'Post Title',
            dataIndex: 'post_name',
            key: 'post_name',
            sorter: (a, b) => a.post_name.localeCompare(b.post_name),
            ...getColumnSearchProps('post_name')
        },
        {
            title: 'Reason Type',
            dataIndex: 'reason_type',
            key: 'reason_type',
            render: (reason_type) => {
                let tagColor = 'default';
                switch (reason_type) {
                    case 'OTHER':
                        tagColor = 'purple';
                        break;
                    case 'OFFENSIVE_BEHAVIOUR':
                        tagColor = 'volcano';
                        break;
                    case 'INAPPROPRIATE_CONTENT':
                        tagColor = 'magenta';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{reason_type}</Tag>
                );
            }, 
            filters: [
                {
                    text: 'Other',
                    value: 'OTHER',
                },
                {
                    text: 'Offensive Behaviour',
                    value: 'OFFENSIVE_BEHAVIOUR',
                },
                {
                    text: 'Inappropriate Content',
                    value: 'INAPPROPRIATE_CONTENT',
                },
            ],
            onFilter: (value, record) => record.reason_type === value,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            sorter: (a, b) => a.reason.localeCompare(b.reason),
            ...getColumnSearchProps('reason')
        },
        {
            title: 'Reported On',
            dataIndex: 'creation_date',
            key: 'creation_date',
            sorter: (a, b) => a.creation_date.localeCompare(b.creation_date),
            ...getColumnSearchProps('creation_date')
        },
        {
            title: 'Resolved',
            dataIndex: 'resolved',
            key: 'resolved',
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
            onFilter: (value, record) => record.resolved === value,
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            }
        },
        {
            title: 'Action(s)',
            key: 'view',
            dataIndex: 'view',
            width: 300,
            align: 'center',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="vertical">
                            <Link to={`/forumReport/${record.post.post_id}/${record.post.title}`} >
                                <CustomButton style={styles.button} text="View Post"/>
                            </Link>
                            {!record.resolved && ( 
                                <>
                                <CustomButton
                                    text="Approve"
                                    style={{ fontWeight: "bold", fontSize: 12 }}
                                    onClick={() => approve_post(record.report_id, record.post.post_id) }
                                />
                                <CustomButton text="Reject" onClick={() => reject_report(record.report_id) } style={styles.button} />
                                </>
                            )}
                        </Space>
                    </div>
                </div>
            ),
        },
    ]

    const comment_datasource = comments.length ? comments.map((item, index) => {
        let rcomment = item.reported_comment
        const user = rcomment.internal_staff_user || rcomment.local_user || rcomment.tourist_user || rcomment.vendor_staff_user;

        return {
            key: index,
            creation_date: moment(item.creation_date).format('LL'),
            report_id: item.report_id,
            reason_type: item.reason_type,
            reason: item.content,
            comment: rcomment,
            comment_content: item.reported_comment.content,
            comment_user : user.name,
            resolved: item.is_resolved
        };
    }): []

    const comment_columns = [
        {
            title: 'Reason Type',
            dataIndex: 'reason_type',
            key: 'reason_type',
            render: (reason_type) => {
                let tagColor = 'default';
                switch (reason_type) {
                    case 'OTHER':
                        tagColor = 'purple';
                        break;
                    case 'OFFENSIVE_BEHAVIOUR':
                        tagColor = 'volcano';
                        break;
                    case 'INAPPROPRIATE_CONTENT':
                        tagColor = 'magenta';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{reason_type}</Tag>
                );
            }, 
            filters: [
                {
                    text: 'Other',
                    value: 'OTHER',
                },
                {
                    text: 'Offensive Behaviour',
                    value: 'OFFENSIVE_BEHAVIOUR',
                },
                {
                    text: 'Inappropriate Content',
                    value: 'INAPPROPRIATE_CONTENT',
                },
            ],
            onFilter: (value, record) => record.reason_type === value,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            sorter: (a, b) => a.reason.localeCompare(b.reason),
            ...getColumnSearchProps('reason')
        },
        {
            title: 'Commented By',
            dataIndex: 'comment_user',
            key: 'comment_user',
            sorter: (a, b) => a.comment_user.localeCompare(b.comment_user),
            ...getColumnSearchProps('comment_user')
        },
        {
            title: 'Comment Content',
            dataIndex: 'comment_content',
            key: 'comment_content',
            sorter: (a, b) => a.comment_content.localeCompare(b.comment_content),
            ...getColumnSearchProps('comment_content')
        },
        {
            title: 'Reported On',
            dataIndex: 'creation_date',
            key: 'creation_date',
            sorter: (a, b) => a.creation_date.localeCompare(b.creation_date),
            ...getColumnSearchProps('creation_date')
        },
        {
            title: 'Resolved',
            dataIndex: 'resolved',
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
            onFilter: (value, record) => record.resolved === value,
            key: 'resolved',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            }
        },
        {
            title: 'Action(s)',
            key: 'view',
            dataIndex: 'view',
            width: 300,
            align: 'center',
            render: (text, record) => {
                if (record.resolved) {
                    return <span style={{fontSize: 13,fontWeight: "bold", color:"#FFA53F"}}>No Action Is Required</span>;
                }
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <Space direction="vertical">
                                <CustomButton
                                    text="Approve"
                                    style={{ fontWeight: "bold", fontSize: 12 }}
                                    onClick={() => approve_comment(record.report_id, record.comment.comment_id) }
                                />
                                <CustomButton text="Reject" onClick={() => reject_report(record.report_id) } style={styles.button} />
                            </Space>
                        </div>
                    </div>
                )
            },
        },
    ]
    
    const approve_post = async (report_id, post_id) => {
        const response = await approvePostReport(report_id, post_id);
        if (response.status) {
            toast.success('Post Reported Approved!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerPost(true);
            setTriggerComment(true);
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const approve_comment = async (report_id, comment_id) => {
        const response = await approveCommentReport(report_id, comment_id);
        if (response.status) {
            toast.success('Comment Reported Approved!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerPost(true);
            setTriggerComment(true);
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const reject_report = async (report_id) => {
        const response = await rejectReport(report_id);
        if (response.status) {
            toast.success('Rejected Report!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerPost(true);
            setTriggerComment(true);
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={forumBreadCrumb} />
            <Content style={styles.content}>
                <Tabs defaultActiveKey="forumReport" onChange={handleTabChange}>
                    <TabPane tab="Posts" key="reportPost">
                        <CustomTablePagination
                            title="Reported Post(s)"
                            column={post_columns}
                            data={post_datasource}
                            tableLayout="fixed"
                        />
                    </TabPane>
                    <TabPane tab="Comments" key="reportComment">
                        <CustomTablePagination
                            title="Reported Comment(s)"
                            column={comment_columns}
                            data={comment_datasource}
                            tableLayout="fixed"
                        />
                    </TabPane>
                </Tabs>

            <ToastContainer />
            </Content>
        </Layout>
        
    ) :
    (
        <Navigate to="/"/>
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
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 60,
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}