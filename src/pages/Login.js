import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate} from 'react-router-dom';

function Login() {
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
      return email.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      if (email && password) {
        console.log(email,password)
      }
    }
  
    return (
      <div className="Login">
        <form onSubmit={handleSubmit} style={formStyle}>
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
              Login
            </Button>

        </form>
      </div>
    );
  }

  export default Login;