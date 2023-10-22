import { Layout, Card, Avatar, Image } from 'antd';
import { React, useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, useParams, Link } from 'react-router-dom';
import { getPost } from '../../redux/forumRedux';
import { PaperClipOutlined, ArrowUpOutlined , ArrowDownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { downvote, upvote } from '../../redux/forumRedux';
import { ToastContainer, toast } from 'react-toastify';

export default function PostItems() {
    let { category_name } = useParams();
    let { category_id } = useParams();
    let { category_item_name } = useParams();
    let { category_item_id } = useParams();
    let { post_title } = useParams();
    let { post_id } = useParams();

    const user = JSON.parse(localStorage.getItem("user"));
    const [post, setPost] = useState();
    const { Meta } = Card;
    const [visible, setVisible] = useState(false);
    const [trigger, setTrigger] = useState(true);

    const forumBreadCrumb = [
        {
            title: 'Forum',
            to: '/forum'
        },
        {
            title: category_name,
            to: '/forum/' + category_id + '/' + category_name
        },
        {
            title: category_item_name,
            to: '/forum/post/' + category_id + '/' + category_name + '/' + category_item_id + '/' + category_item_name
        },
        {
            title: post_title
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPost(post_id);
            if (response.status) {
                let item = response.data
                const user = item.internal_staff_user || item.local_user || item.tourist_user || item.vendor_staff_user;
                
                let fileName = ""
                const url = item.post_image_list[0]
                if (typeof url !== "undefined") {
                    const parts = url.split('/');
                    const with_extension = parts[parts.length - 1];
                    fileName = with_extension.split('_').slice(-1)[0];
                }

                const formatItem = {
                    post_id: item.post_id,
                    title: item.title,
                    content: item.content,
                    postUser: user,
                    publish_time: item.publish_time,
                    updated_time: item.updated_time,
                    post_image: item.post_image_list[0],
                    img_file : fileName,
                    upvote_list: item.upvoted_user_id_list,
                    downvote_list: item.downvoted_user_id_list,
                    comment_list: item.comment_list,
                }
                setPost(formatItem)
            } else {
                console.log("Post not fetched!");
            }
        }

        if ((post_id && trigger)) {
            fetchData();
            setTrigger(false);
        }

    }, [trigger]);

    const Comment = ({ comment }) => {
        let user;
        if (comment.tourist_user != null) {
            user = comment.tourist_user;
        } else if (comment.local_user != null) {
            user = comment.local_user;
        } else if (comment.vendor_staff_user != null) {
            user = comment.vendor_staff_user;
        } else {
            user = comment.internal_staff_user;
        }   

        return (
            <Card style={{ marginTop: '20px' }}>
                <p>{user.name}</p>
                <p>{comment.content}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>Commented on: {moment(comment.publish_time).format('L LT')}</p>
                {/* Display child comments recursively */}
                {comment.child_comment_list &&
                    comment.child_comment_list.map((child) => <Comment key={child.comment_id} comment={child} />)}
            </Card>
        );
    };

    const onUpvote = async (post_id) => {
        if (!user.upvoted_user_id_list || !user.upvoted_user_id_list.includes(user.user_id)) {
            const response = await upvote(user.user_id, post_id);
            if (response.status) {
                setTrigger(true);
                console.log('upvote success');
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }
        }
    }

    const onDownvote = async (post_id) => {
        if (!user.downvoted_user_id_list || !user.downvoted_user_id_list.includes(user.user_id)) {
            const response = await downvote(user.user_id, post_id);
            if (response.status) {
                setTrigger(true);
                console.log('downvote success');
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }
        }
    }

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={forumBreadCrumb} />
            <Content style={styles.content}>
                <Card
                    style={{
                        width: '100%',
                        height: 250,
                        marginLeft: '-5px',
                        marginRight: '50px',
                        fontSize: 20
                    }}
                    bordered={false}
                >
                    {post && (
                        <Meta
                            avatar={<Avatar size="large" src={`${post.postUser.profile_pic ? post.postUser.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}`} />}
                            title={
                                <div>
                                    {post.postUser.name}
                                    <div style={{ fontSize: '14px', color: '#666' }}>Posted on: {moment(post.publish_time).format('L')} {moment(post.publish_time).format('LT')}</div>
                                </div>
                            }
                            description={
                                <div style={{ fontSize: '16px', color: '#666', marginTop:'15px' }}>
                                    {post.content}
                                </div>
                            }
                        />
                    )}

                    { post && (
                        <div style={{display: 'flex'}}>
                            {/* display image attachment if there is any */}
                            { post.post_image && (
                                <>
                                    <p style={{ marginTop: '80px', marginLeft: '60px', color:'#FFA53F', fontWeight:"bold", fontSize:'18px'}}>
                                        <PaperClipOutlined />
                                    </p>

                                    <Link 
                                        type="text"
                                        onClick={() => setVisible(true)}
                                        style={{ marginTop: '82px', marginLeft: '5px', color:'#FFA53F', fontWeight:"bold", fontSize:'15px'}}>
                                        {post.img_file}
                                    </Link>
                                    
                                    <Image
                                        width={200}
                                        style={{ display: 'none' }}
                                        src={post.post_image}
                                        preview={{
                                            visible,
                                            src: post.post_image,
                                            onVisibleChange: (value) => {
                                                setVisible(value);
                                            }
                                        }}
                                    />
                                </>
                            )}

                            <div style={{ marginLeft: 'auto', marginTop: '80px', marginRight: 30, display:'flex'}}>
                                <Link style={{ color: (post.upvote_list && post.upvote_list.includes(user.user_id) ? "#FFA53F" : "black") , fontWeight:"bold", fontSize:'20px'}} onClick={() => onUpvote(post.post_id)} > 
                                    <ArrowUpOutlined />
                                </Link>
                                
                                <p style={{marginLeft:10, marginRight:10, marginTop: 6, fontSize:13, fontWeight:'bold'}}> {post.upvote_list.length} </p>
                            
                                <Link style={{ color: (post.downvote_list && post.downvote_list.includes(user.user_id) ? "#FFA53F" : "black") , fontWeight:"bold", fontSize:'20px'}} onClick={() => onDownvote(post.post_id)}>  
                                    <ArrowDownOutlined />
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>

                <Card style={{
                        width: '100%',
                        height: 250,
                        marginLeft: '-5px',
                        marginRight: '50px',
                        marginTop: '30px',
                        fontSize: 20,
                        border:'none'
                    }}
                    >

                      {/* Display comments here */}
                      {post && post.comment_list &&
                        post.comment_list.map((comment) => <Comment key={comment.comment_id} comment={comment} />)}
                </Card>
                

                <ToastContainer />

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