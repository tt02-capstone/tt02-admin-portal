import React from "react";
import { Modal } from "antd";

export default function UserModal(props) {

    return props.user ? (
        <div>
            <Modal
                title={props.user.name}
                centered
                open={props.showUserCard}
                onCancel={props.onCancelProfile}
                footer={[]} // hide default buttons of modal
            >
                {props.user.email}
                <br />
                {props.user.is_blocked}

                {props.user.user_type === 'INTERNAL_STAFF' && <br />}
                {props.user.user_type === 'INTERNAL_STAFF' && props.user.role}

                {props.user.user_type === 'VENDOR_STAFF' && <br />}
                {props.user.user_type === 'VENDOR_STAFF' && props.user.position}
                {props.user.user_type === 'VENDOR_STAFF' && <br />}
                {props.user.user_type === 'VENDOR_STAFF' && props.user.is_master_account}
                {props.user.user_type === 'VENDOR_STAFF' && <br />}
                {props.user.user_type === 'VENDOR_STAFF' && props.user.vendor.business_name}

                {/* none for tourist and local uniquely */}
            </Modal>
        </div>
    ) : (<div></div>)
}