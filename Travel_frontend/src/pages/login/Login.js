import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_BASE = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectBasedOnRole = (role, token, user) => {
    // Store for both portals (Admin Portal checks these keys)
    localStorage.setItem("app_token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("currentRole", role);
    
    if (role === "admin" || role === "manager") {
      // Redirect to Admin Portal - use index.html to load the SPA
      window.location.href = "/admin/index.html#/dashboard";
    } else {
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = res.data;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        redirectBasedOnRole(user.role, token, user);
      } else {
        setError("Invalid server response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ Corporate Travel Portal</h1>
          <p>Unified Sign-In</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">⚠️ {error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@company.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="login-footer">
          <div className="role-info">
            <p><strong>Admin/Manager:</strong> → Admin Portal</p>
            <p><strong>Employee:</strong> → Employee Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
