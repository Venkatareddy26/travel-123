import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = ({ currentPath }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/trip-request', label: 'Trip Request', icon: '✈️' },
    { path: '/itinerary', label: 'Itinerary', icon: '📋' },
    { path: '/safety', label: 'Safety', icon: '✅' },
    { path: '/employee/safety-compliance', label: 'Safety & Compliance', icon: '🛡️' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/esg-tracking', label: 'ESG Tracking', icon: '🌱' },
    { path: '/trip-history', label: 'History', icon: '📊' }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-user-info">
          <div className="nav-user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="nav-user-details">
            <span className="nav-user-name">{user?.name || 'User'}</span>
            <span className="nav-user-email">{user?.email || 'user@company.com'}</span>
          </div>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-label">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;