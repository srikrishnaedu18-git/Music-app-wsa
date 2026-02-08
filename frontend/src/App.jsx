import React, { use } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setError , setLoading, setUser, clearError, logout } from "./redux/slices/authSlice";
import Homepage from "./pages/Homepage.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import "./css/auth/Auth.css";
import { closeAuthModal , openAuthModal } from "./redux/slices/uiSlice";
import "./App.css";
import ResetPassword  from "./components/auth/ResetPassword";
function App() {
  const dispatch = useDispatch();
  const {token,user} = useSelector((state) => state.auth);
  
  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if(!storedToken || user ) return;
    const fetchUser = async () => {
      try{
        dispatch(setLoading(true));
        dispatch(clearError());

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        dispatch(setUser({ user: res.data, token: storedToken }));
        console.log("User authenticated");
      }catch(error){
        console.error("getme failed", error);
        dispatch(logout());
        dispatch(
          setError(
            error?.response?.data?.message || "Session expired. Please log in again.",
          ),
        );
      }finally{
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  },[dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
