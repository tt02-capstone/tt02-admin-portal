import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAdmin from "./pages/CreateAdmin";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import { MailOutlined, FileOutlined } from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
import Attraction from "./pages/Attraction";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import PendingApplications from "./pages/PendingApplications";

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const menuItems = [
      {key: '/home', label: 'Home', icon: <MailOutlined />},
      {key: '/createAdmin', label: 'Create Admin', icon: <MailOutlined />},
      {key: '/pendingApplications', label: 'Pending Requests', icon: <FileOutlined />},
      {key: '/', label: 'Logout',icon: <LogoutIcon />,}
  ];

  const onClickNewTab = (tab) => {
      console.log(tab.key);
      if (tab.key == '/') {
        localStorage.removeItem("user");
        navigate(tab.key);
      } else {
        setCurrentTab(tab.key);
        navigate(tab.key);
      }
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
          <Route path="/createAdmin" element={<CreateAdmin />} />
          <Route path="/attraction" element={<Attraction />} />
          <Route path="/pendingApplications" element={<PendingApplications />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

