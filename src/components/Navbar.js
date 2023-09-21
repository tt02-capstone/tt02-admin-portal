import React, { useState } from "react";
import {Menu, Button, Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {MenuOutlined} from "@ant-design/icons";

function Navbar(props) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider
            theme="light"
            breakpoint="lg"
            collapsedWidth="80"
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
                setCollapsed(collapsed)
            }}
            collapsible collapsed={collapsed}
            style={{backgroundColor: 'orange'}}
        >
            <Menu
                theme="light"
                defaultSelectedKeys={['1']}
                mode="inline"
                selectedKeys={[props.currentTab]}
                items={props.menuItems}
                onClick={props.onClickNewTab}
                style={{backgroundColor: 'orange'}}
            />
        </Sider>
    )
}

export default Navbar;