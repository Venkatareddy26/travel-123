import React, { useState, useEffect } from "react";
import "./ESGTracking.css";
import { tripService } from "../../services/tripService";
import { useAuth } from "../../context/AuthContext";

const ESGTracking = () => {
  const { token } = useAuth();

  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch trips dynamically from backend
  useEffect(() => {
    const fetchESGData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const trips = await tripService.getMyTrips();

        // Compute emissions dynamically
        const total = trips.reduce((sum, t) => sum + (t.emissions || 0), 0);
        const thisMonth = trips
          .filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth())
          .reduce((sum, t) => sum + (t.emissions || 0), 0);

        const saved = trips.filter((t) => t.greenChoice).length * 40; // Example logic

        const esgScore = Math.max(40, 100 - total / 10);

        setCarbonData({
          totalEmissions: total,
          monthlyEmissions: thisMonth,
          savedEmissions: saved,
          esgScore,
          trips: trips.map((t) => ({
            destination: t.destination,
            emissions: t.emissions,
            mode: t.modeOfTravel,
            green: t.greenChoice
          }))
        });
      } catch (err) {
        console.error("Failed to load ESG data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchESGData();
  }, [token]);

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  if (loading) return <p>Loading ESG data...</p>;
  if (!carbonData) return <p>No ESG data available.</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">ESG & Carbon Tracking</h1>

      <div className="esg-overview">
        
        {/* ESG Score */}
        <div className="esg-score-card">
          <div className="score-circle" style={{ "--score": carbonData.esgScore }}>
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" className="score-bg" />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="score-progress"
                style={{
                  stroke: getScoreColor(carbonData.esgScore),
                  strokeDasharray: `${carbonData.esgScore * 5.65} 565`,
                }}
              />
            </svg>

            <div className="score-value">
              <span className="score-number">{carbonData.esgScore}</span>
              <span className="score-label">ESG Score</span>
            </div>
          </div>

          <p className="score-description">
            Your environmental performance is improving. Keep choosing green travel options!
          </p>
        </div>

        {/* Stats */}
        <div className="carbon-stats">
          <div className="carbon-stat">
            <div className="stat-icon">🌍</div>
            <div className="stat-info">
              <h3>{carbonData.totalEmissions} kg</h3>
              <p>Total CO₂ Emissions</p>
            </div>
          </div>

          <div className="carbon-stat">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{carbonData.monthlyEmissions} kg</h3>
              <p>This Month</p>
            </div>
          </div>

          <div className="carbon-stat success">
            <div className="stat-icon">🌱</div>
            <div className="stat-info">
              <h3>{carbonData.savedEmissions} kg</h3>
              <p>Emissions Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Emissions */}
      <div className="esg-content">
        <div className="trip-emissions">
          <h2>Trip Emissions Breakdown</h2>
          <div className="emissions-list">
            {carbonData.trips.map((trip, idx) => (
              <div key={idx} className={`emission-item ${trip.green ? "green" : ""}`}>
                <div className="emission-info">
                  <h4>{trip.destination}</h4>
                  <span className="emission-mode">{trip.mode}</span>
                </div>

                <div className="emission-value">
                  <span className="emission-amount">{trip.emissions} kg CO₂</span>
                  {trip.green && <span className="green-badge">🌱 Green Choice</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations (Static or can make dynamic) */}
        <div className="recommendations">
          <h2>Green Travel Recommendations</h2>
          <p>More suggestions coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ESGTracking;
