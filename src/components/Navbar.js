import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { Menu } from "antd";
import { MailOutlined } from '@ant-design/icons';

function Navbar() {
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState('/home');

    const menuItems = [
        {key: '/home', label: 'Home', icon: <MailOutlined />},
        {key: '/createAdmin', label: 'Create Admin', icon: <MailOutlined />},
        {key: '/', label: 'Logout',icon: <LogoutIcon />,}
    ];
  
    const onClickNewTab = (tab) => {
        console.log(tab.key);
        setCurrentTab(tab.key);
        navigate(tab.key);
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Menu
                selectedKeys={[currentTab]} 
                items={menuItems}
                onClick={onClickNewTab}
                style={{display: 'flex', flexDirection: 'column', width: '100%'}}
            />

            {/* <div style={{paddingRight: '1%', paddingTop: '1%'}}>
                <Link to ="/" >
                    <LogoutIcon />
                </Link>
            </div> */}

        </div>
    )
}

export default Navbar;