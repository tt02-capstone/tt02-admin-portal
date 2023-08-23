import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const navigateHome = () => {
      navigate('/home');
    };

    const formStyle ={
      maxWidth: "800px",
      margin: "300px auto",
      padding: "20px",
    }
  
    function validateForm() {
      return username.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();

      if (username && password) {
        console.log(username,password)
      }
    }
  
    return (
      <div className="Login">
        <form onSubmit={handleSubmit} style={formStyle}>

            <FormLabel>Username</FormLabel>
            <TextField
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            
            <Button fullWidth variant="contained" type="submit" onSubmit={handleSubmit} disabled={!validateForm()} 
            onClick={navigateHome}>
              Login
            </Button>
  
        </form>
      </div>
  
    );
  }

  export default Login;