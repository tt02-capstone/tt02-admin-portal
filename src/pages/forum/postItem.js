import { Layout, Card, Button, List, Avatar, Modal, InputNumber, Image } from 'antd';
import { React, useEffect, useState, useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { getPost } from '../../redux/forumRedux';
import moment from 'moment';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleModalVisible = () => {
        setModalVisible(!modalVisible);
    };

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
                    comment_list: item.comment_list
                }

                setPost(formatItem)
            } else {
                console.log("Post not fetched!");
            }
        }
        fetchData();
    }, []);

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
                            avatar={<Avatar size="large" src={`${post.postUser.profile_pic}`} />}
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
                    {post && post.post_image && (
                    <div>
                        <Button 
                            type="text"
                            onClick={() => setVisible(true)}
                            style={{ marginTop: '80px', marginLeft: '40px', color:'#FFA53F', fontWeight:"bold"}}>
                            {post.img_file}
                        </Button>
                        
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
                    </div>
                )}

                {/* Display comments here */}
                {post &&
                post.comment_list &&
                post.comment_list.map((comment) => <Comment key={comment.comment_id} comment={comment} />)}
                </Card>

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