// src/context/AuthContext.js
/*import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Attach token to axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token: resToken, user: resUser } = res.data;

      if (resToken && resUser) {
        localStorage.setItem("token", resToken);
        setToken(resToken);
        setUser(resUser);
        return { success: true };
      } else {
        return { success: false, message: "Invalid server response" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
*/
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Load token immediately from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ⚡ Make sure app waits for auth before loading dashboard
  const [loading, setLoading] = useState(true);

  // 🔥 IMPORTANT FIX — User may not be loaded yet, but token is valid
  const isAuthenticated = !!token;

  // ========================================
  //  Attach token to axios headers globally
  // ========================================
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ========================================
  // Fetch logged-in user if token exists
  // ========================================
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);

        // If token invalid → clear it
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ========================================
  // Login Function
  // ========================================
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token: resToken, user: resUser } = res.data;

      if (resToken && resUser) {
        localStorage.setItem("token", resToken);
        setToken(resToken);
        setUser(resUser);
        return { success: true };
      } else {
        return { success: false, message: "Invalid server response" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ========================================
  // Logout Function
  // ========================================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // ========================================
  // Prevent Dashboard from loading prematurely
  // ========================================
  if (loading) {
    return <p>Loading authentication...</p>;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
