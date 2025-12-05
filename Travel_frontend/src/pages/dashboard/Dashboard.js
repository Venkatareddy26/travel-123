// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";        // ⭐ use single socket instance
import "./Dashboard.css";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quickActions, setQuickActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    activeTrips: 0,
    pendingExpenses: 0,
    alerts: 0,
    esgScore: 0,
    co2ThisMonth: 0,
    budgetUsed: 0,
  });

  // =====================================================
  // Fetch Dashboard Data
  // =====================================================
  const fetchDashboardData = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuickActions(
        res.data.quickActions?.length
          ? res.data.quickActions
          : [
              { title: "New Trip Request", path: "/trip-request", icon: "✈️", color: "#3498db" },
              { title: "View Itinerary", path: "/itinerary", icon: "📋", color: "#27ae60" },
              { title: "Safety Checklist", path: "/safety", icon: "✅", color: "#f39c12" },
              { title: "Upload Expenses", path: "/expenses", icon: "💰", color: "#9b59b6" },
              { title: "ESG Tracking", path: "/esg-tracking", icon: "🌱", color: "#10b981" },
              { title: "Trip History", path: "/trip-history", icon: "📊", color: "#8b5cf6" },
            ]
      );

      setRecentActivity(res.data.recentActivity || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Load dashboard initially
  // =====================================================
  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // =====================================================
  // Socket.io Real-time Updates
  // =====================================================
  useEffect(() => {
    if (!user || !token) return;

    // Connect socket only once
    if (!socket.connected) {
      socket.connect();
      console.log("🔗 Dashboard socket connected.");
    }

    // Join room for user
    socket.emit("joinUser", user.id);

    // Global REAL-TIME dashboard update
    socket.on("dashboardUpdated", () => {
      console.log("📡 Dashboard updated (realtime)");
      fetchDashboardData();
    });

    return () => {
      socket.off("dashboardUpdated");
    };
  }, [user, token]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="page-title">Welcome back, {user?.name}!</h1>
        <p className="dashboard-subtitle">Manage your travel requests and expenses</p>
      </div>

      <div className="dashboard-grid">

        {/* ====================== Quick Actions ====================== */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="action-card"
                style={{ borderLeftColor: action.color }}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-title">{action.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================== Recent Activity ====================== */}
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <p className="activity-action">{item.action}</p>
                  <span className="activity-date">{item.date}</span>
                </div>
                <span className={`activity-status ${item.status}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ====================== Stats Overview ====================== */}
        <section className="stats-overview">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.activeTrips || 0}</h3>
              <p>Active Trips</p>
            </div>
            <div className="stat-card">
              <h3>${stats.pendingExpenses || 0}</h3>
              <p>Pending Expenses</p>
            </div>
            <div className="stat-card">
              <h3>{stats.alerts || 0}</h3>
              <p>Alerts</p>
            </div>
            <div className="stat-card">
              <h3>{stats.esgScore || 0}</h3>
              <p>ESG Score</p>
            </div>
            <div className="stat-card">
              <h3>{stats.co2ThisMonth || 0} kg</h3>
              <p>CO₂ This Month</p>
            </div>
            <div className="stat-card">
              <h3>${stats.budgetUsed || 0}</h3>
              <p>Budget Used</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
