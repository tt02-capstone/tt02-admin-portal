import React, { useState } from "react";
import { Menu, Button } from "antd";
import Sider from "antd/es/layout/Sider";

function Navbar(props) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            {/*<div className="demo-logo-vertical" />*/}
            <Menu
                theme="light"
                defaultSelectedKeys={['1']}
                mode="inline"
                selectedKeys={[props.currentTab]}
                items={props.menuItems}
                onClick={props.onClickNewTab}
                style={{display: 'flex', flexDirection: 'column', width: '100%'}}
            />
        </Sider>
    )
}

export default Navbar;