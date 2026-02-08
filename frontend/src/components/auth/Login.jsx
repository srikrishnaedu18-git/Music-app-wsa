import React, { useState } from "react";
import Input from "../common/Input";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setLoading,
  setUser,
  setError,
} from "../../redux/slices/authSlice";
import axios from "axios";
import "../../css/auth/Login.css";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { authMode } = useSelector((state) => state.ui);
  const isForgot = authMode === "forgot";

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email address"));
      return;
    }
    if (!password) {
      dispatch(setError("Please enter your Password"));
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      const data = res.data || {};
      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        }),
      );
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Login successful");
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Login failed "));
    }
  };

  const handleForgotPassword = async (e) => {
    if (!forgotEmail) {
      setForgotMsg("Please enter your email");
      return;
    }
    try {
      setForgotMsg("Sending reser link...");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        {
          email: forgotEmail,
        },
      );
      setForgotMsg("Reset link sent! Please check your email.");
    } catch (error) {
      setForgotMsg(
        error?.response?.data?.message || "Failed to send reset link",
      );
    }
  };
  return (
    <div className="login-wrapper">
      <h3 className="login-title">Welcome Back</h3>
      <p className="login-subtitle">Please enter your details to login</p>
      <form className="login-form" onSubmit={handleLogin}>
        {!isForgot && (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label={"Email Address"}
              placeholder="Johndoe@gmail.com"
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label={"Password"}
              placeholder={"Min 8 character"}
              type="password"
            />
          </>
        )}
        <div className="forgot-wrapper">
          {!isForgot ? (
            <>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Forgot Password?
              </span>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Don't have an account? Sign Up
              </span>
            </>
          ) : (
            <div className="forgot-box">
              <Input
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                label={"Email Address"}
                placeholder="Enter you registered email "
                type="email"
              />
              {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-btn"
              >
                Send Reset Link
              </button>
            </div>
          )}
        </div>
        {error && <div className="login-error">{error}</div>}
        {!isForgot && (
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? "Logging in..." : "Login"}</span>
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
