import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button } from 'antd';
import { updateLocalWallet } from '../../redux/localRedux';
import { updateVendorWallet } from '../../redux/vendorRedux';

export default function WalletModal(props) {
  const [operation, setOperation] = useState('Add'); // Default to 'Add Funds'
  const [amount, setAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(Infinity);

  useEffect(() => {
    if (!props.isWalletModalOpen) {
      props.form.resetFields();
    }
  }, [props.isWalletModalOpen, props.form]);

  useEffect(() => {
    if (operation === 'Remove') {
      setMaxAmount(props.walletAmount);
    } else {
      setMaxAmount(Infinity);
    }
  }, [operation, props.walletAmount]);

  const handleOperationChange = (value) => {
    setOperation(value);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleSubmit = async (id, type, amount) => {
    if (operation === 'Remove') {
      amount = -amount;
    }
    try {
      const response = type === 'LOCAL' ? await updateLocalWallet(id, amount) : await updateVendorWallet(id, amount);

      if (response.status) {
        console.log(response.data)
        props.onCloseWalletModal();
      } else {
        console.log("List of vendor staff not fetched!");
      }
      } catch (error) {
        console.log('API Exception:', error);
      }
    
  };

  return (
    <Modal
      title="Add/Remove Wallet Funds"
      centered
      open={props.isWalletModalOpen}
      onCancel={props.onCancelWalletModal}

      footer={[]}
    >
       <Form
        form={props.form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 500 }}
        onFinish={props.onSubmitUpdateWallet}
        initialValues={{
          operation: 'Add',  // default operation
          amount: 0.00,  // default amount
          id: props.id,  // pass id as initial value
          type: props.type
        }}
      >
        <Form.Item name="operation" label="Operation">
          <Select style={{ width: 150 }} onChange={handleOperationChange}>
            <Select.Option value="Add">Add Funds</Select.Option>
            <Select.Option value="Remove">Remove Funds</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="amount" label="Amount">
        <InputNumber
            min={0.00}
            max={maxAmount}
            step={0.01}
            precision={2}
            onChange={handleAmountChange}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#FFA53F', fontWeight:"bold" }}>
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};


