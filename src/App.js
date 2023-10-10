import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAdmin from "./pages/CreateAdmin";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {
    MailOutlined,
    FileOutlined,
    HomeOutlined,
    UserOutlined,
    UsergroupAddOutlined,
    MoneyCollectOutlined, BankOutlined, FormOutlined
} from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import PendingApplications from "./pages/PendingApplications";
import {AuthContext, AuthProvider} from "./redux/AuthContext";
import Attraction from "./pages/attraction/Attraction";
import User from "./pages/user/User";
import Profile from "./pages/profileAndPassword/Profile"
import TelecomManagement from "./pages/telecom/TelecomManagement";
import Restaurant from "./pages/restaurant/restaurant";
import DealManagement from "./pages/deal/DealManagement";
import AccommodationManagement from "./pages/accommodation/AccommodationManagement";
import TourManagement from "./pages/tour/TourManagement";
import BookingManagement from "./pages/booking/BookingManagement";
import ViewRoomCount from "./pages/accommodation/ViewRoomCount";
import ForumCategory from "./pages/forum/forumCategory";
import ForumCategoryItems from "./pages/forum/categoryItems";
import Post from "./pages/forum/post";
import PostItems from "./pages/forum/postItem";

export function AppLayout() {

    const navigate = useNavigate();
    const {authState, logout} = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState('/home');

  const menuItems = [
      {key: '/home', label: 'Home', icon: <HomeOutlined />},
      {key: '/profile', label: 'Profile', icon: <UserOutlined />},
      {key: '/user', label: 'User', icon: <UsergroupAddOutlined />},
      {key: '/forum', label: 'Forum', icon: <FormOutlined />,},
      {key: '/booking', label: 'Bookings', icon: <MoneyCollectOutlined />,},
      {key: '/pendingApplications', label: 'Pending Requests', icon: <FileOutlined />},
      {key: '/', label: 'Logout',icon: <LogoutIcon />,}
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
                        <Route path="/user" element={<User />} />
                        <Route path="/createAdmin" element={<CreateAdmin/>}/>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/attraction" element={<Attraction />} />
                        <Route path="/accommodation" element={<AccommodationManagement/>}/>
                        <Route path="/pendingApplications" element={<PendingApplications/>}/>
                        <Route path="/telecom" element={<TelecomManagement />}/>
                        <Route path="/restaurant" element={<Restaurant />}/>
                        <Route path="/deal" element={<DealManagement />}/>
                        <Route path="/booking" element={<BookingManagement />}/>
                        <Route path="/tour" element={<TourManagement />}/>
                        <Route path="/accommodation/viewRoomCount" element={<ViewRoomCount />}/>
                        <Route path="/forum" element={<ForumCategory />}/>
                        <Route path="/forum/:category_id/:category_name" element={<ForumCategoryItems />}/>
                        <Route path="/forum/post/:category_id/:category_name/:category_item_id/:category_item_name" element={< Post/>}/>
                        <Route path="/forum/post/:category_id/:category_name/:category_item_id/:category_item_name/:post_id/:post_title" element={< PostItems/>}/>
                        <Route path="*" element={<Home/>}/>
                    </>) : (<>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/passwordreset" element={<PasswordReset/>}/>
                        <Route path="/forgetpassword" element={<ForgetPassword/>}/>
                        <Route path="*" element={<Login/>}/>
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

