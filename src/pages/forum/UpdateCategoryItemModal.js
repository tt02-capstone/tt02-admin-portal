import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdateCategoryItemModal(props) {

    const [categoryItemId, setCategoryItemId] = useState(null);
    const [form] = Form.useForm();
    const [categoryId, setCategoryId] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [uploadedImage, setUploadedImage] = useState([]);

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    function handleRemove(file) {
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        console.log('at handle remove')
        console.log(updatedFiles)
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

            props.onClickSubmitCategoryItemUpdate({ ...form.getFieldsValue(), image: uploadedImage });
            form.resetFields();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        setCategoryId(props.category_id);
        console.log("Category ID", categoryId);
    }, []);

    useEffect(() => {
        if (props.isUpdateCategoryItemModalOpen) {
            form.setFieldsValue({
                name: props.category_item.name,
                category_item_id: props.category_item.category_item_id
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
                    labelCol={{ span: 6 }}
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

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{backgroundColor: '#FFA53F', fontWeight:"bold", width:100}}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}