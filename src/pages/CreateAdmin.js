import Navbar from "../components/Navbar"
import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function CreateAdmin() {
    const [staffName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const navigateHome = () => {
      navigate('/home');
    };

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
        console.log(email,password,staffName)
      }
    }
  
    return (
        <div className="createAdmin">
            <Navbar />
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
                
                <Button fullWidth variant="contained" type="submit" disabled={!validateForm()} 
                onClick={navigateHome}>
                    Submit
                </Button>
    
            </form>
        </div>
  
    );
  }
