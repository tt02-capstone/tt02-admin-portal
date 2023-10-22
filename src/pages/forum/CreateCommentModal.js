import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateCommentModal(props) {
    const { TextArea } = Input;

    const onFinish = async () => {
        props.onClickSubmitCommentCreate({ ...props.form.getFieldsValue() });
    };

    return (
        <div>
            <Modal
                title="New Comment"
                centered
                open={props.isCreateCommentModalOpen}
                onCancel={props.onClickCancelCreateCommentModal}
                footer={[]}
            >
                <Form
                    name="basic"
                    form={props.form}
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
                        <Button type="primary" htmlType="submit" style={{backgroundColor: '#FFA53F', fontWeight:"bold", width:120}}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}