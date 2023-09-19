import React from "react";
import { Modal, Form, Input, Button, Select, Spin, Row } from "antd";

export default function CreateAdminModal(props) {

    const { Option } = Select;

    return(
        <div>
            <Modal
                title="Create Admin"
                centered
                open={props.isCreateAdminModalOpen}
                onCancel={props.onClickCancelAdminModal}
                footer={[]} // hide default buttons of modal
            >
                <Row align='middle' justify='center'>
                    <Spin tip="Creating" size="small" spinning={props.loading}></Spin>
                </Row>
                
                <Form 
                    name="basic"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitAdminCreate}
                >
                    <Form.Item
                    label="Admin Name"
                    labelAlign="left"
                    name="name"
                    rules={[{ required: true, message: 'Please enter new admin name!' }]}
                    >
                    <Input placeholder="Admin Name"/>
                    </Form.Item>

                    <Form.Item
                    label="Admin Email"
                    labelAlign="left"
                    name="email"
                    placeholder="Admin Email"
                    rules={[{ required: true, message: 'Please enter new admin email!' }]}
                    >
                    <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Current Login Access"
                        labelAlign="left"
                        name="is_blocked"
                        rules={[{ required: true, message: 'Please select a login access right!' }]}
                    >
                        <Select
                            placeholder="Please select a login access right"
                            allowClear
                        >
                            <Option value="false">Allow</Option>
                            <Option value="true">Deny</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        labelAlign="left"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select
                            placeholder="Please select a role"
                            allowClear
                        >
                            <Option value="ADMIN">Admin</Option>
                            <Option value="OPERATION">Operation</Option>
                            <Option value="SUPPORT">Support</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={props.loading}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}