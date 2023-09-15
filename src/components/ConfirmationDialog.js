import React, { useState } from "react";
import { Modal } from "antd";

const ConfirmationDialog = ({ visible, onConfirm, onCancel }) => {
    return (
      <Modal
        title="Confirmation"
        visible={visible}
        onOk={onConfirm}
        onCancel={onCancel}
      >
        <p>Are you sure you want to perform this action?</p>
      </Modal>
    );
  };

  export default ConfirmationDialog;