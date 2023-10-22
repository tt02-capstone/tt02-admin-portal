import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdateCommentModal(props) {

    const { TextArea } = Input;
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        props.onClickSubmitCommentUpdate({ ...form.getFieldsValue() });
    };

    useEffect(() => {
        if (props.isUpdateCommentModalOpen) {
            form.setFieldsValue({
                content: props.comment.content,
            });
        }
    }, [props.isUpdateCommentModalOpen]);

    return (
        <div>
            <Modal
                title="Update Comment"
                centered
                open={props.isUpdateCommentModalOpen}
                onCancel={props.onClickCancelUpdateCommentModal}
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
                        label="Content"
                        name="content"
                        placeholder="Content of Comment"
                        rules={[{ required: true, message: 'Please enter content of comment!' },
                        { max: 1000, message: 'Content should not exceed 1000 characters!' }]}
                    >
                        <TextArea rows={5} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#FFA53F', fontWeight: "bold", width: 100 }}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}