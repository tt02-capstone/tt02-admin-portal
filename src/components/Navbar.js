import { Link } from 'react-router-dom';
import {Tabs, Tab} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
    const navBarStyle ={
        border: "1px solid #ccc",
        backgroundColor: "#f8f8f8"
    }

    const logout = {
        position: "absolute",
        right: 0
    }

    return (
        <Tabs style={navBarStyle}>
            <div>
                <Tab icon={<HomeIcon />} value="/home" to="/home" component={Link}/>
            </div>
            <div style={logout}>
                <Tab label="Welcome Back" disabled/>
                <Tab icon={<LogoutIcon />} value="/" to="/" component={Link}/>
            </div>
        </Tabs>
    )
}

export default Navbar;