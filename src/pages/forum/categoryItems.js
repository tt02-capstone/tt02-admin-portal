import { Layout, Card, Button, Form, Modal } from 'antd';
import { React, useEffect, useState, useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { getAllByCategoryItems, createCategoryItem, deleteCategoryItem, updateCategoryItem } from '../../redux/forumRedux';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import CreateCategoryItemModal from './CreateCategoryItemModal';
import UpdateCategoryItemModal from './UpdateCategoryItemModal';

export default function ForumCategoryItems() {
    let { category_id } = useParams();
    let { category_name } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const [categoryItems, setCategoryItems] = useState([]);

    const { Meta } = Card;

    const forumBreadCrumb = [
        {
            title: 'Forum',
            to: '/forum'
        },
        {
            title: category_name,
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllByCategoryItems(category_id);
            if (response.status) {
                setCategoryItems(response.data);
            } else {
                console.log("List of categories items not fetched!");
            }
        }
        fetchData();
    }, []);

    async function retrieveCategoryItems() {
        try {
            let response = await getAllByCategoryItems(category_id);
            setCategoryItems(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve category items!');
        }
    }

    // Properties for create/update/delete category item
    const [createCategoryItemForm] = Form.useForm();
    const [updateCategoryItemForm] = Form.useForm();
    const [isCreateCategoryItemModalOpen, setIsCreateCategoryItemModalOpen] = useState(false);
    const [isUpdateCategoryItemModalOpen, setIsUpdateCategoryItemModalOpen] = useState(false);
    const [selectedCategoryItemId, setSelectedCategoryItemId] = useState(null);
    const [selectedCategoryItem, setSelectedCategoryItem] = useState(null);
    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [categoryItemIdToDelete, setCategoryItemIdToDelete] = useState('');

    // Update category item
    const handleUpdate = (item_id) => {
        console.log('update');
        console.log(item_id);
        setSelectedCategoryItemId(item_id);
        setSelectedCategoryItem(categoryItems.find(item => item.category_item_id === item_id));
        setIsUpdateCategoryItemModalOpen(true);
    }

    function onClickCancelUpdateCategoryItemModal() {
        setIsUpdateCategoryItemModalOpen(false);
        setSelectedCategoryItem(null);
        setSelectedCategoryItemId(null);
    }

    async function onClickSubmitCategoryItemUpdate(values) {
        const categoryItemObj = {
            category_item_id: selectedCategoryItemId,
            name: values.name,
            image: values.image[0]
        };

        console.log("categoryItemObj", categoryItemObj);

        let response = await updateCategoryItem(categoryItemObj);
        console.log("updateCategoryItem response", response);
        if (response.status) {
            updateCategoryItemForm.resetFields();
            setIsUpdateCategoryItemModalOpen(false);
            toast.success('Category item successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            console.log(response.data);
            setSelectedCategoryItemId(null);
            setSelectedCategoryItem(null);
            retrieveCategoryItems();
        } else {
            console.log("Category item update failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // Delete category item
    const handleDelete = (item_id) => {
        console.log('delete');
        console.log(item_id);
        openDeleteConfirmation(item_id);
    }

    const openDeleteConfirmation = (item_id) => {
        setCategoryItemIdToDelete(item_id);
        setDeleteConfirmationVisible(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
    };

    const onDeleteConfirmed = async () => {
        let response = await deleteCategoryItem(categoryItemIdToDelete);
        if (response.status) {
            toast.success(response.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            retrieveCategoryItems();
            setCategoryItemIdToDelete('');
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }

        closeDeleteConfirmation();
    };

    // Create category item
    const handleCreate = () => {
        console.log('create');
        setIsCreateCategoryItemModalOpen(true);
    }

    function onClickCancelCreateCategoryItemModal() {
        setIsCreateCategoryItemModalOpen(false);
    }

    async function onClickSubmitCategoryItemCreate(values) {
        const categoryItemObj = {
            name: values.name,
            image: values.image[0]
        };

        console.log("categoryItemObj", categoryItemObj);

        let response = await createCategoryItem(category_id, categoryItemObj);
        console.log("createCategoryItem response", response);
        if (response.status) {
            createCategoryItemForm.resetFields();
            setIsCreateCategoryItemModalOpen(false);
            toast.success('Category item successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            console.log(response.data)
            retrieveCategoryItems();
        } else {
            console.log("Category item creation failed!");
            console.log(response.data);
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
                <div style={{ display: 'flex' }}>
                    <div style={{ fontWeight: "bold", fontSize: 26 }}>
                        {category_name} Category Items
                    </div>

                    <CustomButton
                        text="Add Category Item"
                        style={{ marginLeft: 'auto', fontWeight: "bold", marginRight: '60px' }}
                        icon={<PlusOutlined />}
                        onClick={() => handleCreate()}
                    />

                    <CreateCategoryItemModal
                        form={createCategoryItemForm}
                        isCreateCategoryItemModalOpen={isCreateCategoryItemModalOpen}
                        onClickCancelCreateCategoryItemModal={onClickCancelCreateCategoryItemModal}
                        onClickSubmitCategoryItemCreate={onClickSubmitCategoryItemCreate}
                        category_id={category_id}
                    />
                </div>

                <br /><br />

                <div style={{ display: 'flex', flexWrap: 'wrap', width: 1200 }}>
                    {categoryItems.map((item, index) => (
                        <Card
                            style={{
                                width: 400,
                                height: 530,
                                marginLeft: '-5px',
                                marginRight: '50px'
                            }}
                            cover={<img alt={item.name} src={item.image} style={{ width: 400, height: 400 }} />}
                            bordered={false}
                            key={index}
                        >
                            <Meta
                                title={item.name}
                                description={"Explore Posts Related to " + item.name} />

                            <div style={{ marginTop: '10px', marginLeft: '-12px' }}>
                                <Button type="text" style={{ color: '#FFA53F' }} onClick={() => handleUpdate(item.category_item_id)}><EditOutlined /></Button>
                                <Button type="text" style={{ color: '#FFA53F', marginLeft: '-2px' }} onClick={() => handleDelete(item.category_item_id)}><DeleteOutlined /></Button>
                                <Link style={{ color: '#FFA53F', marginLeft: '10px' }} to={`/forum/post/${category_id}/${category_name}/${item.category_item_id}/${item.name}`}>< EyeOutlined /></Link>
                            </div>
                        </Card>
                    ))}
                </div>

                <UpdateCategoryItemModal
                    form={updateCategoryItemForm}
                    isUpdateCategoryItemModalOpen={isUpdateCategoryItemModalOpen}
                    onClickCancelUpdateCategoryItemModal={onClickCancelUpdateCategoryItemModal}
                    onClickSubmitCategoryItemUpdate={onClickSubmitCategoryItemUpdate}
                    category_id={category_id}
                    category_item={selectedCategoryItem}
                />

                <Modal
                    title="Confirm Delete"
                    visible={isDeleteConfirmationVisible}
                    onOk={() => onDeleteConfirmed()}
                    onCancel={closeDeleteConfirmation}
                >
                    <p>Are you sure you want to delete this category item?</p>
                </Modal>
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