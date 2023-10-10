import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import { getLastCategoryItemId } from "../../redux/forumRedux";
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdateCategoryItemModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [categoryItemId, setCategoryItemId] = useState(null);
    const [form] = Form.useForm();
    const [lastCategoryItemId, setLastCategoryItemId] = useState(null);
    const [category, setCategory] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [uploadedImage, setUploadedImage] = useState([]);

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    function handleRemove(file) {
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        setImageFiles(updatedFiles);
    }

    // upload file
    const S3BUCKET = 'tt02/categoryItem';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const fileList = e.fileList;
        setImageFiles(fileList);
    }

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
            const categoryItemImageName = 'CategoryItem_' + categoryItemId + '_' + file.name;
            const blob = new Blob([file.originFileObj]);

            if (blob) {
                const S3_BUCKET = S3BUCKET;
                const REGION = TT02REGION;

                AWS.config.update({
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_ACCESS_KEY,
                });
                const s3 = new AWS.S3({
                    params: { Bucket: S3_BUCKET },
                    region: REGION,
                });

                const params = {
                    Bucket: S3_BUCKET,
                    Key: categoryItemImageName,
                    Body: blob,
                };

                return new Promise((resolve, reject) => {
                    s3.putObject(params)
                        .on("httpUploadProgress", (evt) => {
                            console.log(
                                "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                            );
                        })
                        .send((err, data) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/categoryItem/${categoryItemImageName}`;
                                console.log("imageUrl", imageUrl);
                                resolve(imageUrl);
                            }
                        });
                });
            }
        });

        try {
            const uploadedImage = await Promise.all(uploadPromises);
            console.log("Image uploaded:", uploadedImage);

            setUploadedImage(uploadedImage);

            const newCategoryItemId = categoryItemId + 1;
            setCategoryItemId(newCategoryItemId);
            console.log("nextCategoryItemId", categoryItemId);

            props.onClickSubmitCategoryItemCreate({ ...props.form.getFieldsValue(), image: uploadedImage });

        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        setCategory(props.category);
        console.log("category", category);
    }, []);

    useEffect(() => {
        if (props.isUpdateCategoryItemModalOpen) {

            form.setFieldsValue({
                name: props.category_item.name,
                category_item_id: props.category_item.category_item_id,
            });
        }


    }, [props.isUpdateCategoryItemModalOpen]);

    return (
        <div>
            <Modal
                title="Update Category Item"
                centered
                open={props.isUpdateCategoryItemModalOpen}
                onCancel={props.onClickCancelUpdateCategoryItemModal}
                footer={[]}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}

                >
                    <Form.Item
                        label="Name"
                        name="name"
                        placeholder="Category Item Name"
                        rules={[{ required: true, message: 'Please enter name of category item!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                            { required: true, message: 'Please upload an image!' },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false} // To prevent auto-upload on file selection
                            maxCount={1}
                            fileList={imageFiles}
                            onRemove={handleRemove}
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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