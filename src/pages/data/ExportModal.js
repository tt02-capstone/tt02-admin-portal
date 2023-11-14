import React, { useState, useEffect } from "react";
import { Modal, Form,  Input, Space, Button, Select, Switch, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';


export default function ExportModal(props) {
    const [form] = Form.useForm();
    const { Option } = Select;
    let initialValues = {};
    console.log(props)
    const { TextArea } = Input;

    return(
        <div>
            <Modal
                title="Export Data"
                centered
                open={props.isExportModalOpen}
                onCancel={props.onClickCancelManageExportButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitExport}
                    initialValues={initialValues}
                >
                    
                   
                    <div>
                    

                    <Form.Item
                        label="Report Name"
                        name="reportName"
                        placeholder="Report Name"
                        rules={[{ required: true, message: 'Please indicate the report name' }]}
                    >
                         <Input/>
                    </Form.Item>

                    <Form.Item
                            label="Report Title"
                            name="reportTitle"
                            placeholder="Report Title"
                            
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Report Description"
                            name="reportDescription"
                            placeholder="Report Description"
                            
                        >
                             <TextArea rows={4} placeholder="Enter description here" />
                        </Form.Item>
                  
                    </div>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
  
                            <Button type="primary" htmlType="submit">
                            Submit
                            </Button>
                        
                        
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}