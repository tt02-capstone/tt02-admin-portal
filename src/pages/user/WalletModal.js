import React, { useState } from 'react';
import { Modal, Select, InputNumber, Button } from 'antd';

const FundOperationModal = ({ isVisible, onClose, walletAmount }) => {
  const [operation, setOperation] = useState('Add'); // Default to 'Add Funds'
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (value) => {
    if (value < 0) {
      setAmount(0);
    } else if (operation === 'Remove' && value > walletAmount) {
      setAmount(walletAmount);
    } else {
      setAmount(value);
    }
  };

  const handleOperationChange = (value) => {
    setOperation(value);
  };

  return (
    <Modal
      title="Fund Operations"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={onClose}>
          Confirm
        </Button>,
      ]}
    >
      <div>
        <Select defaultValue={operation} style={{ width: 120 }} onChange={handleOperationChange}>
          <Select.Option value="Add">Add Funds</Select.Option>
          <Select.Option value="Remove">Remove Funds</Select.Option>
        </Select>

        <InputNumber
          min={0}
          max={operation === 'Remove' ? walletAmount : Infinity}
          value={amount}
          onChange={handleAmountChange}
          style={{ marginLeft: '20px' }}
        />
      </div>
    </Modal>
  );
};

export default FundOperationModal;
