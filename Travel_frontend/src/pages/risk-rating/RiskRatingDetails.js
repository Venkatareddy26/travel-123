// RiskRatingDetails.js
/*import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import './RiskRatingDetails.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const levelColors = {
  Low: '#4caf50',
  Medium: '#ffeb3b',
  High: '#f44336',
};

const levelIcons = {
  Low: '🟢',
  Medium: '🟡',
  High: '🔴',
};

function countByLevel(data, level) {
  return data.filter(d => d.level === level).length;
}

const RiskRatingDetails = () => {
  // Load from localStorage or start empty
  const [riskData, setRiskData] = useState(() => {
    const savedData = localStorage.getItem('riskData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [modal, setModal] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [form, setForm] = useState({ country: '', city: '', level: 'Low', description: '', date: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Save updates to localStorage
  useEffect(() => {
    localStorage.setItem('riskData', JSON.stringify(riskData));
  }, [riskData]);

  // Filtering and sorting
  let filtered = riskData.filter(d =>
    (filter === 'All' || d.level === filter) &&
    (search === '' || d.country.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()))
  );

  if (sortBy === 'date') filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sortBy === 'level') filtered = filtered.sort((a, b) => ['High', 'Medium', 'Low'].indexOf(a.level) - ['High', 'Medium', 'Low'].indexOf(b.level));

  const openModal = (row) => setModal(row);
  const closeModal = () => setModal(null);

  const openAdmin = () => {
    setAdminMode(true);
    setForm({ country: '', city: '', level: 'Low', description: '', date: '' });
  };
  const closeAdmin = () => setAdminMode(false);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const saveForm = e => {
    e.preventDefault();
    setRiskData([...riskData, form]);
    setAdminMode(false);
  };

  const requestTravel = (row) => {
    if (row.level === 'High') setShowAlert(true);
    else alert('Travel request submitted!');
  };

  const closeAlert = () => setShowAlert(false);

  const findCountryData = (mapCountryName) => {
    if (!mapCountryName) return null;
    const name = mapCountryName.toLowerCase().trim();
    return riskData.find(d => d.country.toLowerCase() === name);
  };

  const countryRisk = {};
  riskData.forEach(d => {
    const key = d.country.toLowerCase();
    countryRisk[key] = d.level;
  });

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => window.history.back()}>
        ← Back
      </button>

      <h1 className="page-title">Risk Rating System</h1>
      <p className="page-subtitle">Check the latest travel risk levels and safety alerts for upcoming destinations.</p>

      {/* Search and Filter Controls *}
      <div className="controls-bar">
        <input
          placeholder="Search country/city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
          <option value="All">All Risks</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
          <option value="date">Sort by Date</option>
          <option value="level">Sort by Severity</option>
        </select>
      </div>

      {/* Risk Summary Cards *}
      <div className="risk-summary-cards">
        <div className="risk-card low-risk" onClick={() => setFilter('Low')}>
          <div className="risk-icon">🟢</div>
          <div className="risk-label">Low Risk</div>
          <div className="risk-count">{countByLevel(riskData, 'Low')} destinations</div>
        </div>
        <div className="risk-card medium-risk" onClick={() => setFilter('Medium')}>
          <div className="risk-icon">🟡</div>
          <div className="risk-label">Medium Risk</div>
          <div className="risk-count">{countByLevel(riskData, 'Medium')} destinations</div>
        </div>
        <div className="risk-card high-risk" onClick={() => setFilter('High')}>
          <div className="risk-icon">🔴</div>
          <div className="risk-label">High Risk</div>
          <div className="risk-count">{countByLevel(riskData, 'High')} destinations</div>
        </div>
      </div>

      {/* Risk Table *}
      <div className="risk-table-container">
        <table className="risk-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>City</th>
              <th>Risk Level</th>
              <th>Description</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx}>
                <td>{row.country}</td>
                <td>{row.city || '-'}</td>
                <td>
                  <span className={`risk-badge ${row.level.toLowerCase()}`}>
                    {levelIcons[row.level]} {row.level}
                  </span>
                </td>
                <td>{row.description}</td>
                <td>{row.date}</td>
                <td>
                  <button className="btn-view" onClick={() => openModal(row)}>View Details</button>
                  <button className="btn-request" onClick={() => requestTravel(row)}>Request Travel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend *}
      <div className="legend">
        <strong>Legend:</strong>
        <span className="legend-item">🟢 = Safe</span>
        <span className="legend-item">🟡 = Caution</span>
        <span className="legend-item">🔴 = Avoid travel</span>
      </div>

      {/* Admin Controls *}
      <div className="admin-controls">
        <button className="btn-admin" onClick={openAdmin}>
          Add or Update Risk Data
        </button>
      </div>

      {/* Interactive Map *}
      <div className="map-section">
        <div className="map-header"><h3>🗺️ Interactive Risk Map</h3></div>
        <div className="map-instructions">
          <p>Click on any country to view detailed risk assessment and travel advisories</p>
        </div>
        <div className="map-container">
          <ComposableMap projectionConfig={{ scale: 120 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const name = (geo.properties?.NAME || geo.properties?.name || '').toLowerCase();
                  const risk = countryRisk[name];
                  let fill = '#e0e0e0';
                  if (risk === 'Low') fill = '#4caf50';
                  if (risk === 'Medium') fill = '#ffeb3b';
                  if (risk === 'High') fill = '#f44336';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#fff"
                      style={{ default: { outline: 'none' }, hover: { outline: 'none', cursor: 'pointer', fill: '#999' } }}
                      onClick={() => {
                        const countryName = geo.properties?.NAME || geo.properties?.name || 'Unknown';
                        const found = findCountryData(countryName);
                        setSelectedCountry(found || { 
                          country: countryName, 
                          level: 'No Data', 
                          description: 'No risk assessment available for this country yet.',
                          date: 'N/A'
                        });
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        <div className="map-legend">
          <span style={{ color: '#4caf50', fontWeight: 600 }}>● Low</span>
          <span style={{ color: '#ffeb3b', fontWeight: 600 }}>● Medium</span>
          <span style={{ color: '#f44336', fontWeight: 600 }}>● High</span>
        </div>
      </div>

      {/* Modals *}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.country}{modal.city ? ` - ${modal.city}` : ''}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className={`risk-badge ${modal.level.toLowerCase()}`} style={{ marginBottom: '1rem' }}>
                {levelIcons[modal.level]} {modal.level}
              </div>
              <p><strong>Description:</strong> {modal.description}</p>
              <p><strong>Last Updated:</strong> {modal.date}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {adminMode && (
        <div className="modal-overlay" onClick={closeAdmin}>
          <form className="modal-content" onClick={e => e.stopPropagation()} onSubmit={saveForm}>
            <div className="modal-header">
              <h2>Add/Update Risk Data</h2>
              <button type="button" className="close-btn" onClick={closeAdmin}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Country</label>
                <input name="country" value={form.country} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Risk Level</label>
                <select name="level" value={form.level} onChange={handleFormChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input name="description" value={form.description} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="date" value={form.date} onChange={handleFormChange} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={closeAdmin}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showAlert && (
        <div className="modal-overlay" onClick={closeAlert}>
          <div className="modal-content alert-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-body">
              <div className="alert-icon">⚠️</div>
              <h2>High Risk Destination</h2>
              <p>This destination is flagged as High Risk. Please confirm or contact HR before proceeding.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-danger" onClick={closeAlert}>Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedCountry && (
        <div className="modal-overlay" onClick={() => setSelectedCountry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCountry.country}</h2>
              <button className="close-btn" onClick={() => setSelectedCountry(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className={`risk-badge ${selectedCountry.level.toLowerCase()}`} style={{ marginBottom: '1rem' }}>
                {levelIcons[selectedCountry.level] || ''} {selectedCountry.level}
              </div>
              <p>{selectedCountry.description}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedCountry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskRatingDetails;
*/
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import './RiskRatingDetails.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const levelColors = {
  Low: '#4caf50',
  Medium: '#ffeb3b',
  High: '#f44336',
};

const levelIcons = {
  Low: '🟢',
  Medium: '🟡',
  High: '🔴',
};

function countByLevel(data, level) {
  return data.filter(d => d.level === level).length;
}

const RiskRatingDetails = () => {

  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [modal, setModal] = useState(null); // used for row "View Details"
  const [adminMode, setAdminMode] = useState(false);

  const [form, setForm] = useState({
    country: '',
    city: '',
    level: 'Low',
    description: '',
    date: '',
    weather: null, // will hold { main, icon, tempC, humidity, windKmh, recommendation }
  });

  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [liveRiskLevel, setLiveRiskLevel] = useState("Low");

  const [showAlert, setShowAlert] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // ---------- WEATHER API KEY (replace with your own) ----------
  const API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE";

  // ---------- Fetch risk data from backend ----------
  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/risk", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setRiskData(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching risk data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRiskData();
  }, []);

  // ---------- Helper: compute recommendation from weather + numeric thresholds ----------
  const computeRecommendation = ({ main = '', tempC = null, windKmh = null, humidity = null } = {}) => {
    const weather = (main || '').toLowerCase();
    // Basic rules - tweak as desired
    if (weather.includes('thunder') || weather.includes('storm') || weather.includes('extreme')) {
      return { label: 'Avoid Travel', color: 'red' };
    }
    if (weather.includes('rain') || weather.includes('snow') || weather.includes('sleet')) {
      // heavy precipitation -> avoid or caution depending on intensity — we don't have intensity here so use Caution
      return { label: 'Caution', color: 'orange' };
    }
    // numeric thresholds that push to avoid
    if ((windKmh || 0) >= 60) return { label: 'Avoid Travel', color: 'red' };
    if ((tempC || 0) >= 45 || (tempC || 0) <= -15) return { label: 'Avoid Travel', color: 'red' };
    if ((humidity || 0) >= 95) return { label: 'Caution', color: 'orange' };

    // default safe
    return { label: 'Safe', color: 'green' };
  };

  // ---------- AUTO WEATHER RISK: fetch weather details and update form + live risk ----------
  const autoWeatherRisk = async (cityName) => {
    if (!cityName) return;

    try {
      // Use q=cityName - OpenWeather recognizes many city names; optionally add country code for better accuracy
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.weather || !data.weather[0]) return;

      const weatherMain = data.weather[0].main || '';
      const icon = data.weather[0].icon || ''; // icon code (e.g., "10d")
      const tempK = data.main?.temp;
      const tempC = typeof tempK === 'number' ? Math.round(tempK - 273.15) : null;
      const humidity = data.main?.humidity ?? null;
      const windMs = data.wind?.speed ?? null; // m/s
      const windKmh = windMs != null ? Math.round(windMs * 3.6) : null;

      // Map weather to risk level (basic)
      let level = "Low";
      const wm = weatherMain.toLowerCase();
      if (wm.includes("thunder") || wm.includes("storm") || wm.includes("extreme")) {
        level = "High";
      } else if (wm.includes("rain") || wm.includes("wind") || wm.includes("snow") || wm.includes("sleet")) {
        level = "Medium";
      } else if (wm.includes("drizzle") || wm.includes("mist") || wm.includes("fog")) {
        level = "Medium";
      } else {
        level = "Low";
      }

      const recommendation = computeRecommendation({
        main: weatherMain,
        tempC,
        windKmh,
        humidity,
      });

      // update form with weather object and level & description
      setForm(prev => ({
        ...prev,
        level,
        description: `Weather: ${weatherMain}`,
        weather: {
          main: weatherMain,
          icon,
          tempC,
          humidity,
          windKmh,
          recommendation, // { label, color }
        },
      }));

      // update live map color
      setLiveRiskLevel(level);
    } catch (err) {
      console.log("Weather API error:", err);
    }
  };

  // ---------- Existing suggestion + autofill logic (kept) ----------
  const updateRiskFromInput = (countryName, cityName) => {
    const c = countryName?.toLowerCase() || "";
    const ct = cityName?.toLowerCase() || "";

    if (countryName.length > 0) {
      const matches = riskData
        .filter(d => d.country.toLowerCase().includes(c))
        .map(d => d.country);
      setCountrySuggestions([...new Set(matches)]);
    } else {
      setCountrySuggestions([]);
    }

    if (cityName.length > 0) {
      const matches = riskData
        .filter(d => d.city && d.city.toLowerCase().includes(ct))
        .map(d => d.city);
      setCitySuggestions([...new Set(matches)]);
    } else {
      setCitySuggestions([]);
    }

    const match = riskData.find(d => {
      const matchCountry = d.country.toLowerCase() === c;
      const matchCity = d.city?.toLowerCase() === ct;
      return matchCountry || matchCity;
    });

    if (match) {
      setForm(prev => ({
        ...prev,
        level: match.level,
        description: match.description,
        date: match.date,
        weather: match.weather || null,
      }));
      setLiveRiskLevel(match.level);
    } else {
      setForm(prev => ({
        ...prev,
        level: "Low",
        description: "",
        weather: null,
      }));
      setLiveRiskLevel("Low");
    }
  };

  // ---------- Form handlers ----------
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = row => setModal(row);
  const closeModal = () => setModal(null);

  const openAdmin = () => {
    setAdminMode(true);
    setForm({ country: '', city: '', level: 'Low', description: '', date: '', weather: null });
  };
  const closeAdmin = () => setAdminMode(false);

  // ---------- Save: update if exists or add new (preserve weather) ----------
  const saveForm = async (e) => {
    e.preventDefault();

    // ensure date exists
    const record = {
      ...form,
      date: form.date || new Date().toISOString().split('T')[0],
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(record),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data from backend
        const fetchResponse = await fetch("http://localhost:5000/api/risk", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchResult = await fetchResponse.json();
        if (fetchResult.success) {
          setRiskData(fetchResult.data || []);
        }
        alert("Risk data saved successfully!");
      } else {
        alert("Failed to save risk data: " + result.message);
      }
    } catch (error) {
      console.error("Error saving risk data:", error);
      alert("Error saving risk data");
    }

    setAdminMode(false);
  };

  const requestTravel = row => {
    if (row.level === 'High') setShowAlert(true);
    else alert('Travel request submitted!');
  };

  const closeAlert = () => setShowAlert(false);

  const findCountryData = (mapCountryName) => {
    if (!mapCountryName) return null;
    const name = mapCountryName.toLowerCase().trim();
    return riskData.find(d => d.country.toLowerCase() === name);
  };

  const countryRisk = {};
  riskData.forEach(d => {
    const key = d.country.toLowerCase();
    countryRisk[key] = d.level;
  });

  // ---------- Filter + sort ----------
  let filtered = riskData.filter(d =>
    (filter === 'All' || d.level === filter) &&
    (search === '' ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase()))
  );

  if (sortBy === 'date')
    filtered = filtered.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  if (sortBy === 'level')
    filtered = filtered.sort((a, b) =>
      ['High', 'Medium', 'Low'].indexOf(a.level) -
      ['High', 'Medium', 'Low'].indexOf(b.level)
    );

  // ---------- Render ----------
  return (
    <div className="page-container">

      <button className="btn-back" onClick={() => window.history.back()}>
        ← Back
      </button>

      <h1 className="page-title">Risk Rating System</h1>
      <p className="page-subtitle">
        Check the latest travel risk levels and safety alerts for upcoming destinations.
      </p>

      {/* CONTROLS */}
      <div className="controls-bar">
        <input
          placeholder="Search country/city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />

        <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
          <option value="All">All Risks</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
          <option value="date">Sort by Date</option>
          <option value="level">Sort by Severity</option>
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="risk-summary-cards">
        <div className="risk-card low-risk" onClick={() => setFilter('Low')}>
          <div className="risk-icon">🟢</div>
          <div className="risk-label">Low Risk</div>
          <div className="risk-count">
            {countByLevel(riskData, 'Low')} destinations
          </div>
        </div>

        <div className="risk-card medium-risk" onClick={() => setFilter('Medium')}>
          <div className="risk-icon">🟡</div>
          <div className="risk-label">Medium Risk</div>
          <div className="risk-count">
            {countByLevel(riskData, 'Medium')} destinations
          </div>
        </div>

        <div className="risk-card high-risk" onClick={() => setFilter('High')}>
          <div className="risk-icon">🔴</div>
          <div className="risk-label">High Risk</div>
          <div className="risk-count">
            {countByLevel(riskData, 'High')} destinations
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="risk-table-container">
        <table className="risk-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>City</th>
              <th>Risk Level</th>
              <th>Weather</th>
              <th>Description</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx}>
                <td>{row.country}</td>
                <td>{row.city || '-'}</td>

                <td>
                  <span className={`risk-badge ${row.level.toLowerCase()}`}>
                    {levelIcons[row.level]} {row.level}
                  </span>
                </td>

                <td>
                  {row.weather ? (
                    <div className="weather-compact">
                      <img
                        alt={row.weather.main}
                        src={`https://openweathermap.org/img/wn/${row.weather.icon}@2x.png`}
                        style={{ width: 36, height: 36 }}
                      />
                      <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}>
                        <div style={{ fontWeight: 600 }}>{row.weather.tempC != null ? `${row.weather.tempC}°C` : '-'}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{row.weather.recommendation?.label || ''}</div>
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: '#777' }}>—</span>
                  )}
                </td>

                <td>{row.description}</td>
                <td>{row.date}</td>

                <td>
                  <button className="btn-view" onClick={() => openModal(row)}>View</button>
                  <button className="btn-request" onClick={() => requestTravel(row)}>
                    Request Travel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* LEGEND */}
      <div className="legend">
        <strong>Legend:</strong>
        <span className="legend-item">🟢 = Safe</span>
        <span className="legend-item">🟡 = Caution</span>
        <span className="legend-item">🔴 = Avoid Travel</span>
      </div>

      {/* ADMIN BUTTON */}
      <div className="admin-controls">
        <button className="btn-admin" onClick={openAdmin}>
          Add or Update Risk Data
        </button>
      </div>

      {/* MAP */}
      <div className="map-section">
        <div className="map-header"><h3>🗺️ Interactive Risk Map</h3></div>

        <div className="map-container">
          <ComposableMap projectionConfig={{ scale: 120 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const name = (geo.properties?.NAME || "").toLowerCase();

                  const risk = countryRisk[name];
                  let fill = '#e0e0e0';

                  if (form.country.toLowerCase() === name) {
                    fill =
                      liveRiskLevel === 'Low'
                        ? '#4caf50'
                        : liveRiskLevel === 'Medium'
                        ? '#ffeb3b'
                        : '#f44336';
                  } else {
                    if (risk === 'Low') fill = '#4caf50';
                    if (risk === 'Medium') fill = '#ffeb3b';
                    if (risk === 'High') fill = '#f44336';
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#fff"
                      style={{
                        default: { outline: 'none' },
                        hover: {
                          outline: 'none',
                          cursor: 'pointer',
                          fill: '#999',
                        },
                      }}
                      onClick={() => {
                        const countryName = geo.properties?.NAME || 'Unknown';
                        const found = findCountryData(countryName);

                        setSelectedCountry(
                          found || {
                            country: countryName,
                            level: 'No Data',
                            description: 'No information available',
                            date: 'N/A',
                            weather: null,
                          }
                        );
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* ADMIN FORM MODAL */}
      {adminMode && (
        <div className="modal-overlay" onClick={closeAdmin}>
          <form
            className="modal-content"
            onClick={e => e.stopPropagation()}
            onSubmit={saveForm}
          >
            <div className="modal-header">
              <h2>Add/Update Risk Data</h2>
              <button type="button" className="close-btn" onClick={closeAdmin}>
                ×
              </button>
            </div>

            <div className="modal-body">

              {/* Country */}
              <div className="form-group">
                <label>Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={(e) => {
                    handleFormChange(e);
                    updateRiskFromInput(e.target.value, form.city);
                  }}
                  autoComplete="off"
                  required
                />

                {countrySuggestions.length > 0 && (
                  <div className="suggest-box">
                    {countrySuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="suggest-item"
                        onClick={() => {
                          setForm(prev => ({ ...prev, country: s }));
                          updateRiskFromInput(s, form.city);
                          setCountrySuggestions([]);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={(e) => {
                    handleFormChange(e);
                    updateRiskFromInput(form.country, e.target.value);

                    // WEATHER AUTO-RISK: fetch weather and auto-fill level + weather details
                    autoWeatherRisk(e.target.value);
                  }}
                  autoComplete="off"
                  required
                />

                {citySuggestions.length > 0 && (
                  <div className="suggest-box">
                    {citySuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="suggest-item"
                        onClick={() => {
                          setForm(prev => ({ ...prev, city: s }));
                          updateRiskFromInput(form.country, s);
                          setCitySuggestions([]);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Level */}
              <div className="form-group">
                <label>Risk Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleFormChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Weather Info (read-only card inside form) */}
              <div className="form-group">
                <label>Live Weather</label>
                {form.weather ? (
                  <div className="weather-card">
                    <div className="weather-main">
                      <img
                        alt={form.weather.main}
                        src={`https://openweathermap.org/img/wn/${form.weather.icon}@2x.png`}
                        style={{ width: 48, height: 48 }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{form.weather.main}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>{form.weather.recommendation?.label}</div>
                      </div>
                    </div>
                    <div className="weather-details">
                      <div>Temp: {form.weather.tempC != null ? `${form.weather.tempC}°C` : '-'}</div>
                      <div>Humidity: {form.weather.humidity != null ? `${form.weather.humidity}%` : '-'}</div>
                      <div>Wind: {form.weather.windKmh != null ? `${form.weather.windKmh} km/h` : '-'}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#777' }}>No live weather data</div>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date</label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={closeAdmin}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ALERT MODAL */}
      {showAlert && (
        <div className="modal-overlay" onClick={closeAlert}>
          <div className="modal-content alert-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-body">
              <div className="alert-icon">⚠️</div>
              <h2>High Risk Destination</h2>
              <p>
                This destination is flagged as High Risk. Please confirm or contact HR before proceeding.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-danger" onClick={closeAlert}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL (row modal) */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.country}{modal.city ? ` - ${modal.city}` : ''}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className={`risk-badge ${modal.level.toLowerCase()}`} style={{ marginBottom: '1rem' }}>
                {levelIcons[modal.level]} {modal.level}
              </div>

              {/* Card style weather block (Option 2) */}
              {modal.weather ? (
                <div className="weather-card-big">
                  <div className="weather-card-top">
                    <img
                      alt={modal.weather.main}
                      src={`https://openweathermap.org/img/wn/${modal.weather.icon}@2x.png`}
                      style={{ width: 72, height: 72 }}
                    />
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{modal.weather.main}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>{modal.weather.recommendation?.label}</div>
                    </div>
                  </div>

                  <div className="weather-card-body">
                    <div>Temperature: {modal.weather.tempC != null ? `${modal.weather.tempC}°C` : '-'}</div>
                    <div>Humidity: {modal.weather.humidity != null ? `${modal.weather.humidity}%` : '-'}</div>
                    <div>Wind Speed: {modal.weather.windKmh != null ? `${modal.weather.windKmh} km/h` : '-'}</div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#777', marginBottom: 12 }}>No live weather data</div>
              )}

              <p><strong>Description:</strong> {modal.description}</p>
              <p><strong>Last Updated:</strong> {modal.date}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* COUNTRY DETAILS MODAL */}
      {selectedCountry && (
        <div className="modal-overlay" onClick={() => setSelectedCountry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCountry.country}</h2>
              <button className="close-btn" onClick={() => setSelectedCountry(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                className={`risk-badge ${selectedCountry.level.toLowerCase()}`}
                style={{ marginBottom: '1rem' }}
              >
                {(levelIcons[selectedCountry.level] || "")}
                {selectedCountry.level}
              </div>
              <p>{selectedCountry.description}</p>

              {selectedCountry.weather ? (
                <div className="weather-card-big" style={{ marginTop: 12 }}>
                  <div className="weather-card-top">
                    <img
                      alt={selectedCountry.weather.main}
                      src={`https://openweathermap.org/img/wn/${selectedCountry.weather.icon}@2x.png`}
                      style={{ width: 72, height: 72 }}
                    />
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{selectedCountry.weather.main}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>{selectedCountry.weather.recommendation?.label}</div>
                    </div>
                  </div>

                  <div className="weather-card-body">
                    <div>Temperature: {selectedCountry.weather.tempC != null ? `${selectedCountry.weather.tempC}°C` : '-'}</div>
                    <div>Humidity: {selectedCountry.weather.humidity != null ? `${selectedCountry.weather.humidity}%` : '-'}</div>
                    <div>Wind Speed: {selectedCountry.weather.windKmh != null ? `${selectedCountry.weather.windKmh} km/h` : '-'}</div>
                  </div>
                </div>
              ) : null}

            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedCountry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RiskRatingDetails;
