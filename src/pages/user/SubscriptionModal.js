import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, Switch, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';


export default function SubscriptionModal(props) {
    const [buttonText, setButtonText] = useState("");
    const [form] = Form.useForm();
    const { Option } = Select;
    let initialValues = {};
    console.log(props)
    if (props.subscriptionDetails) {
        if (props.subscriptionDetails.plan) {
            initialValues.subscriptionType = props.subscriptionDetails.plan;
          }
        
          if (props.subscriptionDetails.autoRenewal) {
            
            initialValues.autoRenew = props.subscriptionDetails.auto_renewal;
            console.log(initialValues)
          }
    }
  

  useEffect(() => {
    // Check the values in the console
    
    
    // Set the initial values
    if (props.subscriptionDetails) {
        form.setFieldsValue({
            subscriptionType: props.subscriptionDetails.plan,
            autoRenew: props.subscriptionDetails.auto_renewal,
          });
    }

    if (props.operation == "ADD") {
        setButtonText("Add Subscription");
    } else if (props.operation == "REMOVE") {
        setButtonText("Remove Subscription");
    }
    
  }, [form, props.subscriptionDetails, props.operation]);

    function generateTitle() {
        if (props.operation == "Add") {
            return "Update Subscription";
        } else if (props.operation == "RENEW") {
            return "Renew Subscription";
        } else if (props.operation == "SUBSCRIBE") {
            return "Subscribe to Data Dashboard";
        }

    }

    return(
        <div>
            <Modal
                title="Subscription Details"
                centered
                open={props.isSubModalOpen}
                onCancel={props.onClickCancelManageSubButton}
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
                    onFinish={props.onClickSubmitSubscription}
                    initialValues={initialValues}
                >

                {props.operation == "ADD" &&
                <div>

                
                    <Form.Item
                    label="Subscription Type"
                    labelAlign="left"
                    name="subscriptionType"
                    rules={[{ required: true, message: 'Please select the subscription type' }]}
                    >
                    
                    <Select>
                            <Option value='Monthly'>Monthly</Option>
                            <Option value='Yearly'>Yearly</Option>
                    </Select>
                    </Form.Item>

                    <Form.Item
                    label="Auto Renew"
                    labelAlign="left"
                    name="autoRenew"
                    rules={[{ required: true, message: 'Please indicate whether to auto-renew or not' },]}
                    valuePropName="checked"
                    >
                    <Switch/>
                    </Form.Item>
                    </div>
                    }

                {props.operation == "REMOVE" &&
                <div>
                    <Form.Item
                    label="Subscription Type"
                    labelAlign="left"
                    name="subscriptionType"
                    
                    >
                    
                    <Input readOnly />
                    </Form.Item>

                    <Form.Item
                    label="Auto Renew"
                    labelAlign="left"
                    name="autoRenew"
                    

                    >
                    <Input readOnly />
                    </Form.Item>
                    </div>
                    }

                   

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                    {props.operation == "REMOVE" &&
                        <Button type="primary" danger htmlType="submit">
                            {buttonText}
                        </Button>
                    }  
                    {props.operation == "ADD" &&
                        <Button type="primary" htmlType="submit">
                            {buttonText}
                        </Button>
                    }   
                        
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}