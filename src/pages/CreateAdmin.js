import Navbar from "../components/Navbar"
import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import { Layout } from 'antd';
import {useNavigate, Navigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { createAdmin } from "../redux/adminRedux";
import CustomHeader from "../components/CustomHeader";

export default function CreateAdmin() {
    const [staffName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [createAdminMsg, setCreateAdminMsg] = useState();

    const user = JSON.parse(localStorage.getItem("user")); // check if the user is logged in

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;

    const formStyle ={
      maxWidth: "800px",
      margin: "10% auto",
      padding: "20px"
    }
  
    function validateForm() {
      return email.length > 0 && password.length > 0 && staffName.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();

      if (email && password && staffName) {
        let staff = {
          staff_num: "10",
          role: "ADMIN",
          name: staffName,
          email: email, 
          password: password,
          is_blocked: false
        };

        let createAdminStatus = createAdmin(staff);
        console.log(createAdminStatus);
        if (createAdminStatus) {
          setCreateAdminMsg(true);
        } else {
          createAdminMsg(false);
        }
      }
    }
  
    return user ? (
          <Layout style={styles.layout}>
                <CustomHeader text={"Header"}/>
                {createAdminMsg && <p>Admin Created Successfully!</p>}
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>
                      <form onSubmit={handleSubmit} style={formStyle}>
                          <FormLabel>Staff Name</FormLabel>
                          <TextField
                              type="staffName"
                              value={staffName}
                              onChange={(e) => setName(e.target.value)}
                              required
                              fullWidth
                              sx={{mb: 3}}
                          />

                          <FormLabel>Email</FormLabel>
                          <TextField
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              fullWidth
                              sx={{mb: 3}}
                          />
              
                          <FormLabel>Password</FormLabel>
                          <TextField
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              fullWidth
                              sx={{mb: 3}}
                          />
                          
                          <Button fullWidth variant="contained" type="submit" disabled={!validateForm()}>
                              Submit
                          </Button>    
                      </form>
                    </Content>
            </Layout>
        </Layout>
    ) :
    ( 
      <Navigate to="/" />
    )
  }

  const styles = {
    layout: {
        minHeight: '100vh',
        backgroundColor: 'white'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
}