import { Layout, Card, Avatar, Image, Input, Tag, Modal as AntdModal } from 'antd';
import { React, useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, useParams, Link } from 'react-router-dom';
import { createComment, deleteComment, getPost, updateComment, getAllPostComment, upvoteComment, downvoteComment, autoApproveCommentReport, autoApprovePostReport, getPrimaryBadge } from '../../redux/forumRedux';
import { PaperClipOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { downvote, upvote } from '../../redux/forumRedux';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Comment, Header, Form, Modal, Tab } from 'semantic-ui-react';
import { viewUserProfile } from '../../redux/userRedux';

export default function PostItems() {
    let { category_name } = useParams();
    let { category_id } = useParams();
    let { category_item_name } = useParams();
    let { category_item_id } = useParams();
    let { post_title } = useParams();
    let { post_id } = useParams();

    let { reportPostTitle } = useParams();

    const user = JSON.parse(localStorage.getItem("user"));
    const [post, setPost] = useState();
    const { Meta } = Card;
    const [visible, setVisible] = useState(false); // to check if the post have an img or not 
    const [triggerPost, setTriggerPost] = useState(true);

    // comments 
    const [comments, setComments] = useState([]);
    const [triggerComment, setTriggerComment] = useState(true);
    const [newComment, setNewComment] = useState("");

    // badge 
    const [postBadge, setPostBadge] = useState();
    const [commentBadge, setCommentBadge] = useState();

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

    const reportCrumb = [
        {
            title: 'Manage Forum Report',
            to: '/forumReport'
        },
        {
            title: reportPostTitle,
        },
    ]

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
                    img_file: fileName,
                    upvote_list: item.upvoted_user_id_list,
                    downvote_list: item.downvoted_user_id_list,
                    is_published: item.is_published
                }
                setPost(formatItem);
                get_post_badge(user.user_id);
            } else {
                console.log("Post not fetched!");
            }
        }

        if ((post_id && triggerPost)) {
            fetchData();
            setTriggerPost(false);
        }

    }, [triggerPost]);

    const onUpvotePost = async (post_id) => {
        if (!user.upvoted_user_id_list || !user.upvoted_user_id_list.includes(user.user_id)) {
            const response = await upvote(user.user_id, post_id);
            if (response.status) {
                setTriggerPost(true);
                console.log('upvote success');
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }
        }
    }

    const onDownvotePost = async (post_id) => {
        if (!user.downvoted_user_id_list || !user.downvoted_user_id_list.includes(user.user_id)) {
            const response = await downvote(user.user_id, post_id);
            if (response.status) {
                setTriggerPost(true);
                console.log('downvote success');
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            let response = await getAllPostComment(post_id);
            if (response.status) {
                setComments([]);
                setComments(response.data);
            } else {
                console.log("Comments not fetch!");
            }
        };

        if ((post_id && triggerComment)) {
            fetchData(post_id);
            setTriggerComment(false);
        }
    }, [post_id, triggerComment]);

    async function reply_comment(values) {
        const replyObj = {
            content: values.content
        };

        let response = await createComment(post_id, values.parent_comment_id, user.user_id, replyObj);

        if (response.status) {
            toast.success('Reply Successful!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            setTriggerPost(true);
            setTriggerComment(true);
        } else {
            console.log("Reply Failed!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function create_comment() {
        const commentObj = {
            content: newComment,
        };

        let response = await createComment(post_id, 0, user.user_id, commentObj);

        if (response.status) {
            toast.success('Comment Added!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            setNewComment("");
            setTriggerPost(true);
            setTriggerComment(true);
        } else {
            console.log("Comment Failed!");
            setNewComment("");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const handleDelete = (commentIdToDelete) => {
        openDeleteConfirmation(commentIdToDelete);
    }

    const openDeleteConfirmation = (commentIdToDelete) => {
        setCommentIdToDelete(commentIdToDelete);
        setDeleteConfirmationVisible(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
    };

    async function remove_comment() {
        let response = await deleteComment(commentIdToDelete);
        if (response.status) {
            toast.success('Comment Deleted!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerPost(true);
            setTriggerComment(true);

        } else {
            const temp_comment = {
                comment_id: commentIdToDelete,
                content: '[deleted]',
                updated_time: new Date(),
                is_published: false
            };

            const response = await updateComment(temp_comment); // to update any comments w child to be 'deleted'
            if (response.status) {
                setTriggerPost(true);
                setTriggerComment(true);

                toast.success('Comment cannot be deleted, but is modified!!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            } else { // cant update to 'deleted'
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }
        }

        setCommentIdToDelete('');
        closeDeleteConfirmation();
    }

    async function edit_comment(values) {
        const commentObj = {
            comment_id: values.comment_id,
            content: values.content,
            is_published: true
        };

        let response = await updateComment(commentObj);

        if (response.status) {
            toast.success('Comment Updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerComment(true);
            setTriggerPost(true);

        } else {
            console.log("Comment Update Failed!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function report_comment(comment_id) {
        let response = await autoApproveCommentReport(comment_id);

        if (response.status) {
            toast.success('Comment Reported!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerComment(true);
            setTriggerPost(true);

        } else {
            console.log("Report Comment Failed!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function report_post(post_id) {
        let response = await autoApprovePostReport(post_id);

        if (response.status) {
            toast.success('Post Reported!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setTriggerComment(true);
            setTriggerPost(true);

        } else {
            console.log("Report Post Failed!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const DataComment = (props) => {
        let comment = props.data;
        const [hideReply, setHideReply] = useState(true); // to hide and display the REPLY text area
        const [hideEdit, setHideEdit] = useState(true); // to hide and display the EDIT text area

        const [userReply, setUserReply] = useState(""); // REPLY CONTENT FIELD
        const [editComment, setEditComment] = useState(""); // EDIT CONTENT FIELD

        let commenter;
        if (comment.tourist_user != null) {
            commenter = comment.tourist_user;
        } else if (comment.local_user != null) {
            commenter = comment.local_user;
        } else if (comment.vendor_staff_user != null) {
            commenter = comment.vendor_staff_user;
        } else {
            commenter = comment.internal_staff_user;
            commenter.profile_pic = "http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg"
        }


        return (
            <Comment>
                <Comment.Avatar src={commenter.profile_pic} />
                <Comment.Content>
                    <Link onClick={() => viewProfile(commenter.user_id)}>
                        <Comment.Author as="a" style={{ fontSize: 18 }}>{commenter.name}</Comment.Author>
                    </Link>
                    <Comment.Metadata style={{ fontSize: 18 }}>
                        <div> {moment(comment.publish_time).format('L LT')}</div>
                        {comment.is_published && commenter.user_id !== user.user_id && commenter.user_type !== "INTERNAL_STAFF" && (   // user can report any comment except for theirs + admin 
                            <>
                                <Comment.Action
                                    onClick={() => report_comment(comment.comment_id)}
                                    style={{ color: '#FFA53F', marginLeft: 4, fontWeight: 'bold' }}>
                                    Report
                                </Comment.Action>
                            </>
                        )}
                    </Comment.Metadata>
                    <Comment.Text style={{ fontSize: 18 }}>
                        {comment.content}
                    </Comment.Text>
                    <Comment.Actions>
                        <div style={{ display: 'flex' }}>

                            {comment.is_published && ( // cnnt reply to a reported comment 
                                <Comment.Action style={{ color: '#FFA53F', fontWeight: 'bold' }}
                                    onClick={() => { setHideReply(!hideReply); setHideEdit(true); }}>
                                    Reply
                                </Comment.Action>
                            )}

                            {commenter.user_id === user.user_id && comment.is_published && (   // only the user that commented can edit / delete  
                                <>
                                    <Comment.Action style={{ color: '#FFA53F', fontWeight: 'bold' }}
                                        onClick={() => { setHideEdit(!hideEdit); setHideReply(true); }}>
                                        Edit
                                    </Comment.Action>
                                    <Comment.Action style={{ color: '#FFA53F', fontWeight: 'bold' }}
                                        onClick={() => { handleDelete(comment.comment_id); }}>
                                        Delete
                                    </Comment.Action>
                                </>
                            )}

                            {comment.is_published && ( // remove upvote and downvote for reported comment  
                                <>
                                    <Comment.Action
                                        onClick={() => { onUpvoteComment(comment.comment_id); }}
                                        style={{ color: (comment.upvoted_user_id_list && comment.upvoted_user_id_list.includes(user.user_id) ? "red" : "black") }} >
                                        <ArrowUpOutlined />
                                    </Comment.Action>

                                    <div style={{ marginRight: 10 }}> {comment.upvoted_user_id_list.length} </div>

                                    <Comment.Action
                                        onClick={() => { onDownvoteComment(comment.comment_id); }}
                                        style={{ color: (comment.downvoted_user_id_list && comment.downvoted_user_id_list.includes(user.user_id) ? "red" : "black") }} >
                                        <ArrowDownOutlined />
                                    </Comment.Action>
                                </>
                            )}

                            <div style={{ marginLeft: 2, color: '#grey', fontWeight: 'bold' }}> {comment.child_comment_list.length} Replies </div>
                        </div>

                        <Form // form to reply to a comment 
                            reply
                            hidden={hideReply}
                            onSubmit={() => {
                                console.log(userReply);
                                if (!userReply || userReply === "") return;

                                const reply = {
                                    parent_comment_id: comment.comment_id,
                                    content: userReply
                                };

                                reply_comment(reply);
                                setUserReply("");
                                setHideReply(true);
                            }}
                        >
                            <Form.TextArea
                                value={userReply}
                                onChange={(e) => setUserReply(e.target.value)}
                            />
                            <Button
                                type="submit"
                                content="Add a Reply"
                                labelPosition="left"
                                icon="add"
                                color='yellow'
                            />
                        </Form>

                        <Form // form to edit the existing comment 
                            reply
                            hidden={hideEdit}
                            onSubmit={() => {
                                console.log(editComment);
                                if (!editComment || editComment === "") return;

                                const new_comment = {
                                    comment_id: comment.comment_id,
                                    content: editComment
                                };

                                edit_comment(new_comment);
                                setEditComment("");
                                setHideEdit(true);
                            }}
                        >
                            <Form.TextArea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                            />
                            <Button
                                type="submit"
                                content="Edit Comment"
                                labelPosition="left"
                                icon="edit"
                                color='yellow'
                            />
                        </Form>
                    </Comment.Actions>
                    <div style={{ marginBottom: -18 }}>
                        <Comment.Group>
                            {comment.parent_comment == null && comment.child_comment_list.length > 0 &&
                                comment.child_comment_list.map((e, i) => {
                                    return <DataComment data={e} />;
                                })}
                        </Comment.Group>
                    </div>
                </Comment.Content>
            </Comment>
        );
    }

    const onUpvoteComment = async (comment_id) => {
        const response = await upvoteComment(user.user_id, comment_id);
        if (response.status) {
            setTriggerComment(true);
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const onDownvoteComment = async (comment_id) => {
        const response = await downvoteComment(user.user_id, comment_id);
        if (response.status) {
            setTriggerComment(true);
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // to view the commenter / poster profile 
    const viewProfile = async (user_id) => {
        const response = await viewUserProfile(user_id)
        if (response.status) {
            setUserProfile(response.data)

            const postList = response.data.post_list.length > 0 ? (
                response.data.post_list.map((post) => (
                    <Card key={post.post_id} style={{ marginBottom: 10 }}>
                        <h3 style={{ fontSize: 15 }}>{post.title}</h3>
                        <p style={{ fontSize: 13 }}>{post.content}</p>
                        <p style={{ fontSize: 12, color: 'grey' }}> posted on: {moment(post.publish_time).format('L LT')} </p>
                    </Card>
                )))
                : (
                    <div> No post created! </div>
                );

            const commentList = response.data.comment_list.length > 0 ? (
                response.data.comment_list.map((comment) => (
                    <Card key={comment.comment_id} style={{ marginBottom: 10 }}>
                        <h3 style={{ fontSize: 15 }} >{comment.content}</h3>
                        <p style={{ fontSize: 12, color: 'grey' }}> commented on: {moment(comment.publish_time).format('L LT')} </p>
                    </Card>
                )))
                : (
                    <div> No comments posted! </div>
                );


            const tabInfo = [
                {
                    menuItem: 'Post(s)',
                    render: () => <Tab.Pane attached={false}> {postList}</Tab.Pane>,
                },
                {
                    menuItem: 'Comment(s)',
                    render: () => <Tab.Pane attached={false}>{commentList}</Tab.Pane>,
                }
            ]
            setTabs(tabInfo)
            get_comment_badge(user_id)
        } else {
            console.log('user profile not fetched')
        }

        setOpen(true)
    }

    const get_post_badge = async (user_id) => {
        const response = await getPrimaryBadge(user_id);
        if (response.status) {
            setPostBadge(response.data);
        } else {
            console.log('No badge found for this user!');
        }
    }

    const get_comment_badge = async (user_id) => {
        const response = await getPrimaryBadge(user_id);
        if (response.status) {
            setCommentBadge(response.data);
        } else {
            console.log('No badge found for this user!');
        }
    }

    const [open, setOpen] = useState(false)
    const [userProfile, setUserProfile] = useState('')
    const [tabs, setTabs] = useState([]);

    return user ? (
        <Layout style={styles.layout}>
            {reportPostTitle ? <CustomHeader items={reportCrumb} /> : <CustomHeader items={forumBreadCrumb} />}
            {/* <CustomHeader items={forumBreadCrumb} /> */}
            <Content style={styles.content}>
                {userProfile && tabs && (
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                    >

                        <Modal.Header>User Profile</Modal.Header>
                        <Modal.Content>
                            <Modal.Description style={{ marginLeft: 0 }}>
                                <div style={{ display: 'flex' }}>
                                    <Image size='small' src={userProfile.profile_pic ? userProfile.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'} wrapped />
                                    <div style={{ marginLeft: 15 }}>
                                        <div style={{ display: "flex" }}>
                                            <Header>{userProfile.name}</Header>
                                            {commentBadge && (
                                                <Tag color='green' style={{ marginLeft: 12, height: 23, fontWeight: "bold" }}>{commentBadge.badge_type}</Tag>
                                            )}
                                        </div>
                                        <p style={{ fontWeight: "bold" }}> Recent Forum Activity </p>
                                        <Tab menu={{ pointing: true }} panes={tabs} style={{ width: 750 }} />
                                    </div>
                                </div>
                            </Modal.Description>
                        </Modal.Content>

                    </Modal>
                )}

                <Card
                    style={{
                        width: '97%',
                        marginLeft: '-5px',
                        marginRight: '50px',
                        fontSize: 20,
                        height: '21%'
                    }}
                    bordered={false}
                >
                    {post && (
                        <Meta
                            avatar={<Avatar size="large" src={`${post.postUser.profile_pic ? post.postUser.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}`} />}
                            title={
                                <div>
                                    <Link style={{ color: 'black', fontSize: 18 }} onClick={() => viewProfile(post.postUser.user_id)}>
                                        {post.postUser.name}
                                        {postBadge && (
                                            <Tag color='green' style={{ marginLeft: 10, height: 23, fontWeight: "bold", marginBottom: 5 }}>{postBadge.badge_type}</Tag>
                                        )}
                                        {post.is_published ? (
                                            <Tag style={{ marginLeft: 6, height: 23, fontWeight: "bold", marginBottom: 5 }} color={'geekblue'}>PUBLISHED</Tag>
                                        ) : (
                                            <Tag style={{ marginLeft: 6, height: 23, fontWeight: "bold", marginBottom: 5 }} color={'volcano'}>UNPUBLISHED</Tag>
                                        )}
                                    </Link>
                                    <div style={{ fontSize: '16px', color: '#666' }}>Posted on: {moment(post.publish_time).format('L')} {moment(post.publish_time).format('LT')}</div>

                                </div>
                            }
                            description={
                                <div style={{ fontSize: '20px', color: '#666', marginTop: '15px' }}>
                                    {post.content}
                                </div>
                            }
                        />
                    )}

                    {post && (
                        <div style={{ display: 'flex', marginTop: -60 }}>
                            {post.post_image && (
                                <>
                                    <p style={{ marginTop: '80px', marginLeft: '60px', color: '#FFA53F', fontWeight: "bold", fontSize: '18px' }}>
                                        <PaperClipOutlined />
                                    </p>

                                    {/* display image attachment if there is any */}
                                    <Link
                                        type="text"
                                        onClick={() => setVisible(true)}
                                        style={{ marginTop: '82px', marginLeft: '5px', color: '#FFA53F', fontWeight: "bold", fontSize: '15px' }}>
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

                            <div style={{ marginLeft: 'auto', marginTop: '80px', marginRight: 30, display: 'flex' }}>
                                {post.is_published && (
                                    <Link style={{ color: '#FFA53F', fontWeight: 'bold', fontSize: '15px', marginRight: 20, marginTop: 4 }} onClick={() => report_post(post.post_id)}>
                                        Report
                                    </Link>
                                )}

                                <Link style={{ color: (post.upvote_list && post.upvote_list.includes(user.user_id) ? "red" : "black"), fontWeight: "bold", fontSize: '20px' }} onClick={() => onUpvotePost(post.post_id)} >
                                    <ArrowUpOutlined />
                                </Link>

                                <p style={{ marginLeft: 10, marginRight: 10, marginTop: 6, fontSize: 13, fontWeight: 'bold' }}> {post.upvote_list.length} </p>

                                <Link style={{ color: (post.downvote_list && post.downvote_list.includes(user.user_id) ? "red" : "black"), fontWeight: "bold", fontSize: '20px' }} onClick={() => onDownvotePost(post.post_id)}>
                                    <ArrowDownOutlined />
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>

                {post && (
                    <Card style={{
                        width: '100%',
                        height: 250,
                        marginLeft: '-5px',
                        marginRight: '50px',
                        marginTop: '5px',
                        fontSize: 20,
                        border: 'none'
                    }}
                    >
                        {/* Display comments here */}
                        <Header as="h3" dividing>
                            Comments
                        </Header>

                        {post && comments &&
                            comments.map((comment) =>
                                <div style={{ marginBottom: -20 }}>
                                    <Comment.Group>
                                        <DataComment data={comment} />
                                    </Comment.Group>
                                </div>
                            )}
                        
                        {post && comments.length == 0 && (
                                <div style={{ marginBottom: -20 , marginLeft:530}}>
                                    <div style={{ color: '#FFA53F', fontWeight: 'bold', fontSize: 30, marginTop: 40 }}> ---- NO COMMENTS ----</div>
                                </div>
                        )}

                        {post.is_published && (
                            <Content style={styles.replyInput}>
                                <Input
                                    placeholder="Type a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onPressEnter={create_comment}
                                    style={{ flex: 1, marginRight: '10px', height: '40px' }}
                                />
                                <Button
                                    type="submit"
                                    content="Comment"
                                    color='yellow'
                                    onClick={create_comment}
                                />
                            </Content>
                        )}
                    </Card>
                )}
                <AntdModal
                    title="Confirm Delete"
                    visible={isDeleteConfirmationVisible}
                    onOk={() => remove_comment()}
                    onCancel={closeDeleteConfirmation}
                    okButtonProps={{ style: { fontWeight: "bold" } }}
                    cancelButtonProps={{ style: { fontWeight: "bold" } }}
                >
                    <p>Are you sure you want to delete this comment?</p>
                </AntdModal>
                <ToastContainer />
            </Content>
        </Layout>
    ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    replyInput: {
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
    },
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