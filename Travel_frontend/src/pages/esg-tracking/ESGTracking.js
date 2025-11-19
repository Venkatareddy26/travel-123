/*import React, { useState } from 'react';
import './ESGTracking.css';

const ESGTracking = () => {
  const [carbonData] = useState({
    totalEmissions: 1145,
    monthlyEmissions: 245,
    savedEmissions: 180,
    esgScore: 72,
    trips: [
      { destination: 'New York', emissions: 245, mode: 'Flight', green: false },
      { destination: 'Boston', emissions: 45, mode: 'Train', green: true },
      { destination: 'London', emissions: 380, mode: 'Flight', green: false },
      { destination: 'Paris', emissions: 95, mode: 'Train', green: true },
      { destination: 'Tokyo', emissions: 520, mode: 'Flight', green: false }
    ]
  });

  const [recommendations] = useState([
    {
      title: 'Take the train to Boston',
      savings: 200,
      description: 'Reduce emissions by 82% compared to flying'
    },
    {
      title: 'Choose direct flights',
      savings: 150,
      description: 'Direct routes emit 30% less CO₂ than connecting flights'
    },
    {
      title: 'Use video conferencing',
      savings: 500,
      description: 'Replace short-haul trips with virtual meetings'
    }
  ]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">ESG & Carbon Tracking</h1>

      <div className="esg-overview">
        <div className="esg-score-card">
          <div className="score-circle" style={{ '--score': carbonData.esgScore }}>
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" className="score-bg" />
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                className="score-progress"
                style={{ 
                  stroke: getScoreColor(carbonData.esgScore),
                  strokeDasharray: `${carbonData.esgScore * 5.65} 565`
                }}
              />
            </svg>
            <div className="score-value">
              <span className="score-number">{carbonData.esgScore}</span>
              <span className="score-label">ESG Score</span>
            </div>
          </div>
          <p className="score-description">
            Your environmental performance is <strong>Good</strong>. 
            Keep up the sustainable travel practices!
          </p>
        </div>

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

      <div className="esg-content">
        <div className="trip-emissions">
          <h2>Trip Emissions Breakdown</h2>
          <div className="emissions-list">
            {carbonData.trips.map((trip, idx) => (
              <div key={idx} className={`emission-item ${trip.green ? 'green' : ''}`}>
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

        <div className="recommendations">
          <h2>Green Travel Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-card">
                <div className="rec-header">
                  <h4>{rec.title}</h4>
                  <span className="savings-badge">-{rec.savings} kg CO₂</span>
                </div>
                <p>{rec.description}</p>
                <button className="apply-btn">Apply Suggestion</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGTracking;*/
// Temporary comment out ESGTracking component for revision
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ESGTracking.css";

const ESGTracking = () => {
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch ESG data from backend
  useEffect(() => {
    const fetchESGData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/esg");
        if (res.data && res.data.length > 0) {
          const latest = res.data[0]; // latest ESG record from DB
          setCarbonData(latest);
        }
      } catch (err) {
        console.error("❌ Error fetching ESG data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchESGData();
  }, []);

  // Dynamic score color
  const getScoreColor = (score) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  if (loading) {
    return <div className="loading">Loading ESG data...</div>;
  }

  if (!carbonData) {
    return (
      <div className="page-container">
        <h1 className="page-title">ESG & Carbon Tracking</h1>
        <p>No ESG data available. Please add data from the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">ESG & Carbon Tracking</h1>

      <div className="esg-overview">
        <div className="esg-score-card">
          <div
            className="score-circle"
            style={{ "--score": carbonData.esgscore }}
          >
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" className="score-bg" />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="score-progress"
                style={{
                  stroke: getScoreColor(carbonData.esgscore),
                  strokeDasharray: `${carbonData.esgscore * 5.65} 565`,
                }}
              />
            </svg>
            <div className="score-value">
              <span className="score-number">{carbonData.esgscore}</span>
              <span className="score-label">ESG Score</span>
            </div>
          </div>
          <p className="score-description">
            ESG performance for year <strong>{carbonData.year}</strong>
          </p>
        </div>

        <div className="carbon-stats">
          <div className="carbon-stat">
            <div className="stat-icon">🌍</div>
            <div className="stat-info">
              <h3>{carbonData.co2reduction} kg</h3>
              <p>CO₂ Reduction</p>
            </div>
          </div>
          <div className="carbon-stat">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>{carbonData.compliancerate}%</h3>
              <p>Compliance Rate</p>
            </div>
          </div>
          <div className="carbon-stat success">
            <div className="stat-icon">💚</div>
            <div className="stat-info">
              <h3>{carbonData.sustainabilityindex}</h3>
              <p>Sustainability Index</p>
            </div>
          </div>
        </div>
      </div>

      <div className="esg-content">
        <div className="recommendations">
          <h2>Recommendations</h2>
          <p>
            Keep improving your ESG performance by adopting greener travel
            choices and reducing carbon footprint in future trips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ESGTracking;
