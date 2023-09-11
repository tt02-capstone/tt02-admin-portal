import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAdmin from "./pages/CreateAdmin";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import { MailOutlined } from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const menuItems = [
      {key: '/home', label: 'Home', icon: <MailOutlined />},
      {key: '/createAdmin', label: 'Create Admin', icon: <MailOutlined />},
      {key: '/', label: 'Logout',icon: <LogoutIcon />}
  ];

  const onClickNewTab = (tab) => {
      setCurrentTab(tab.key);
      if (tab.key == '/') {
        localStorage.removeItem("user");
        navigate(tab.key);
      }
  };

  return (
    <Layout hasSider={location.pathname !== '/'}>
      {location.pathname !== '/' &&
          <Navbar
              currentTab={currentTab}
              menuItems={menuItems}
              onClickNewTab={onClickNewTab}
          />
      }
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createAdmin" element={<CreateAdmin />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

