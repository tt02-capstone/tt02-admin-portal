import React, {useContext, useEffect, useState} from "react";
import { FormLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button
} from 'antd';
import secureLocalStorage from "react-secure-storage";
import {AuthContext, TOKEN_KEY} from "../redux/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const navigate = useNavigate(); // route navigation
  const passwordResetRouteChange = () => {
    let path = `/forgetpassword`;
    navigate(path);
  }

  const baseURL = "http://localhost:8080/admin";

  const formStyle = {
    maxWidth: "800px",
    margin: "10% auto",
    padding: "20px"
  }

  // localStorage.removeItem("user");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (email && password) {
      setLoading(true);
      axios.post(`${baseURL}/staffLogin/${email}/${password}`).then((response) => {
        console.log(response);
        if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
          setLoading(false);
        } else {
          toast.success('Login Successful!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });

          secureLocalStorage.setItem("user", response.data.user);
          secureLocalStorage.setItem(TOKEN_KEY, response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

          console.log('login', response.data)

          setLoading(false);

          authContext.setAuthState({
            accessToken: response.data.token,
            authenticated: true
          });
          setTimeout(() => {
            navigate('/home')
          }, 2000);
        }
      })
        .catch((error) => {
          console.error("Axios Error : ", error)
          setLoading(false);
        });
    }
  }

  return (
    <div className="Login" style={{backgroundColor: 'white'}}>
      <br /><br /><br />
      <center><h1>WithinSG Admin Portal</h1></center>
      <form onSubmit={handleSubmit} style={formStyle}>
        <FormLabel>Email</FormLabel>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 3 }}
        />

        <FormLabel>Password</FormLabel>
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          sx={{ mb: 3 }}
        />

        <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!validateForm()}>Login</Button>
          <br /><br />
          <Button type="link" onClick={passwordResetRouteChange}>Forgotten your password?</Button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
}

export default Login;