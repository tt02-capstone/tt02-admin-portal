import React, { useState } from "react";
import {Header} from "antd/es/layout/layout";

export default function CustomHeader(props) {
    return(
        <Header style={{ background: 'white', textAlign: 'center' }}>
            {props.text}
        </Header>
    )
}