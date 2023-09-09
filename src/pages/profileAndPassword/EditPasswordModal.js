import React from "react";
import { Modal, Form, Input, Button } from "antd";

export default function EditPasswordModal(props) {

    return(
        <div>
            <Modal
                title="Change Password"
                centered
                open={props.isChangePasswordModalOpen}
                onCancel={props.onClickCancelEditPasswordButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitNewPassword}
                >
                    <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    placeholder="Old Password"
                    rules={[{ required: true, message: 'Please enter your old password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="New Password"
                    name="newPasswordOne"
                    placeholder="New Password"
                    rules={[{ required: true, message: 'Please enter your new password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="Repeat New Password"
                    name="newPasswordTwo"
                    placeholder="Repeat new Password"
                    rules={[{ required: true, message: 'Please enter your new password again!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}