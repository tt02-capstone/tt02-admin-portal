import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAdmin from "./pages/CreateAdmin";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import { Layout } from "antd";
import { useState } from "react";

function App() {

  return (
    <div>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createAdmin" element={<CreateAdmin />} />
      </Routes>
    </div>
  );
}

export default App;

