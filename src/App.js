import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import { MailOutlined, FileOutlined } from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import PendingApplications from "./pages/PendingApplications";
import User from './pages/user/User';
import CreateAdmin from "./pages/CreateAdmin";
import Profile from "./pages/profileAndPassword/Profile"

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const menuItems = [
      {key: '/home', label: 'Home', icon: <MailOutlined />},
      {key: '/viewProfile', label: 'Profile', icon: <MailOutlined />},
      {key: '/user', label: 'User', icon: <MailOutlined />},
      {key: '/createAdmin', label: 'Create Admin', icon: <MailOutlined />},
      {key: '/pendingApplications', label: 'Pending Requests', icon: <FileOutlined />},
      {key: '/', label: 'Logout',icon: <LogoutIcon />,}
  ];

  const onClickNewTab = (tab) => {
      console.log(tab.key);
      setCurrentTab(tab.key);
      navigate(tab.key);
  };

  return (
    <Layout hasSider={location.pathname !== '/' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword'}>
      {location.pathname !== '/' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword' &&
          <Navbar
              currentTab={currentTab}
              menuItems={menuItems}
              onClickNewTab={onClickNewTab}
          />
      }
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/viewProfile" element={<Profile />} />
          <Route path="/createAdmin" element={<CreateAdmin />} />
          <Route path="/pendingApplications" element={<PendingApplications />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

