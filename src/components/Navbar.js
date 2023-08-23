import { Link } from 'react-router-dom';
import {Tabs, Tab} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
    const navBarStyle ={
        border: "1px solid #ccc",
        color : "darkblue"
    }

    const logout = {
        position: "absolute",
        right: 0
    }

    return (
        <nav style={navBarStyle}>
            <Tabs>
                <div>
                    <Tab icon={<HomeIcon />} to="/home" component={Link}/>
                </div>
                <div style={logout}>
                    <Tab label="Welcome Back" disabled/>
                    <Tab icon={<LogoutIcon />} to="/" component={Link}/>
                </div>
            </Tabs>
        </nav>
    )
}

export default Navbar;