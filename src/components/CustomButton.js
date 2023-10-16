import React, { useState } from "react";
import { Button } from "antd";

export default function CustomButton(props) {

    // properties
    // text --> button text
    // style --> css style
    // icon --> button icon
    // onClick --> onClick function

    return (
        <Button
            type="primary"
            style={{ ...props.style, backgroundColor: '#FFA53F', fontWeight:"bold" }}
            onClick={props.onClick}
            icon={props.icon}>
            {props.text}
        </Button>
    )
}