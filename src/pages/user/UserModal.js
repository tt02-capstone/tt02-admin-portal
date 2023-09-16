import React from "react";
import { Modal, Row, Col } from "antd";

export default function UserModal(props) {

    const modalTitle = () => {
        if (props.user.user_type === 'VENDOR_STAFF') {
            if (props.user.is_master_account === true) {
                console.log("here")
                return props.user.name + ' (Master Account)'; 
            } else {
                return props.user.name + ' (Non-master Account)';
            }

        } else if (props.user.user_type === 'INTERNAL_STAFF') {
            if (props.user.role === 'ADMIN') {
                return props.user.name + ' (Admin)';
            } else if (props.user.role === 'OPERATION') {
                return props.user.name + ' (Operation)';
            } else {
                return props.user.name + ' (Support)';
            }

        } else {
            return props.user.name;
        }
    }

    return props.user ? (
        <div>
            <Modal
                title={modalTitle()}
                centered
                open={props.showUserCard}
                onCancel={props.onCancelProfile}
                footer={[]} // hide default buttons of modal
            >
                <Row>
                    <Col span={12} style={{fontSize: '110%'}}>Email: {props.user.email}</Col>
                    {!props.user.is_blocked && <Col span={12} style={{fontSize: '110%'}}>Login Access Status: Allowed</Col>}
                    {props.user.is_blocked && <Col span={12} style={{fontSize: '110%'}}>Login Access Status: Blocked</Col>}
                </Row>

                {props.user.user_type === 'VENDOR_STAFF' &&
                    <Row>
                        <Col span={12} style={{fontSize: '110%'}}>Business name: {props.user.vendor.business_name}</Col>
                        <Col span={12} style={{fontSize: '110%'}}>Position: {props.user.position}</Col>
                    </Row>
                }
                
                {(props.user.user_type === 'LOCAL' || props.user.user_type === 'TOURIST') &&
                    <Row>
                        <Col span={12} style={{fontSize: '110%'}}>Mobile number: {props.user.country_code} {props.user.mobile_num}</Col>
                    </Row>
                }
            </Modal>
        </div>
    ) : (<div></div>)
}