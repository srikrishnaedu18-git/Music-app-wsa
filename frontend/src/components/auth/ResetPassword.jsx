import React, { useState } from "react";
import axios from "axios";
import Input from "../common/Input";
import "../../css/auth/ResetPassword.css";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // "success" or "error"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    try {
      setLoading(true);
      setStatus("info");
      setMessage("Resetting password...");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${token}`,
        { password },
      );

      setStatus("success");
      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message || "Reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <h3 className="reset-title">Reset Password</h3>
      <p className="reset-subtitle">
        Enter your new password to regain access to your account
      </p>
      <div className="reset-form">
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {status === "error" && <div className="reset-error">{message}</div>}
        {status === "success" && <div className="reset-success">{message}</div>}

        <button
          className="reset-submit-btn"
          onClick={handleReset}
          disabled={loading}
        >
          <span>{loading ? "Resetting..." : "Reset Password"}</span>
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
