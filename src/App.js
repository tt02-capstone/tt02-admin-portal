import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAdmin from "./pages/CreateAdmin";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {MailOutlined, FileOutlined} from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import PendingApplications from "./pages/PendingApplications";
import {AuthContext, AuthProvider} from "./redux/AuthContext";


export function AppLayout() {

    const navigate = useNavigate();
    const location = useLocation();
    const {authState, logout} = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState('/home');

    const menuItems = [
        {key: '/home', label: 'Home', icon: <MailOutlined/>},
        {key: '/createAdmin', label: 'Create Admin', icon: <MailOutlined/>},
        {key: '/pendingApplications', label: 'Pending Requests', icon: <FileOutlined/>},
        {key: '/', label: 'Logout', icon: <LogoutIcon/>,}
    ];

    const onClickNewTab = async (tab) => {
        if (tab.key === '/') {
            console.log('In logout')
            await logout();
        }
        console.log(authState)
        setCurrentTab(tab.key);
        navigate(tab.key);
    };

    return (

        <Layout hasSider={authState?.authenticated} >
            {authState?.authenticated &&
                <Navbar
                    currentTab={currentTab}
                    menuItems={menuItems}
                    onClickNewTab={onClickNewTab}
                />
            }
            <Routes>
                {authState?.authenticated ? (
                    <>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/createAdmin" element={<CreateAdmin/>}/>
                        <Route path="/pendingApplications" element={<PendingApplications/>}/>
                    </>) : (<>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/passwordreset" element={<PasswordReset/>}/>
                        <Route path="/forgetpassword" element={<ForgetPassword/>}/>
                    </>
                )}
            </Routes>
            {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
        </Layout>
    );
}

const App = () => {

    return (
        <AuthProvider>
            <AppLayout>
            </AppLayout>
        </AuthProvider>
    )
}


export default App;

