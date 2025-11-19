// Itinerary.js
/*import React, { useState, useEffect } from 'react';
import './Itinerary.css';

const Itinerary = () => {
  const [trip] = useState({
    id: 'trip-123',
    title: 'Client Meeting – Singapore',
    startDate: '2025-10-10',
    endDate: '2025-10-15',
    status: 'Approved',
    durationDays: 6,
    destination: { city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
    purpose: 'Client Meeting',
    risk: 'Low',
    approver: { name: 'Rina Patel' },
    documents: {
      passport: { status: 'Valid', expires: '2028-06-10' },
      insurance: { provider: 'Acme Insurance', policy: 'AC-998877' },
    },
    emergency: { name: 'Travel Desk', phone: '+1-800-555-3333' },
    embassy: { name: 'Singapore Embassy', phone: '+65-1234-5678' },
  });

  const [travelCards] = useState([
    {
      id: '1',
      type: 'Corporate Credit Card',
      number: '**** **** **** 1234',
      expiry: '12/25',
      status: 'warning',
      daysUntilExpiry: 45
    },
    {
      id: '2',
      type: 'Travel Insurance',
      number: 'Policy: AC-998877',
      expiry: '06/26',
      status: 'active',
      daysUntilExpiry: 365
    }
  ]);

  const [scheduleItems] = useState([
    {
      id: '1',
      date: '2025-10-10',
      time: '09:30 AM',
      type: 'flight',
      title: 'Flight to Singapore',
      details: 'DEL → SIN (SQ403) • Terminal 3 • Seat 12A',
      status: 'confirmed',
      ticketUrl: '#'
    },
    {
      id: '2',
      date: '2025-10-10',
      time: '03:00 PM',
      type: 'hotel',
      title: 'Hotel Check-in',
      details: 'Marina Bay Sands • Booking ref: BKG123',
      status: 'confirmed'
    },
    {
      id: '3',
      date: '2025-10-10',
      time: '07:00 PM',
      type: 'meeting',
      title: 'Welcome Dinner',
      details: 'Restaurant at Marina Bay',
      status: 'scheduled'
    },
    {
      id: '4',
      date: '2025-10-11',
      time: '10:00 AM',
      type: 'meeting',
      title: 'Client Meeting',
      details: 'Client HQ • 123 Business Rd, Suite 100',
      status: 'scheduled'
    },
    {
      id: '5',
      date: '2025-10-11',
      time: '02:00 PM',
      type: 'meeting',
      title: 'Product Presentation',
      details: 'Conference Room A',
      status: 'scheduled'
    },
    {
      id: '6',
      date: '2025-10-12',
      time: '09:00 AM',
      type: 'meeting',
      title: 'Team Workshop',
      details: 'Innovation Hub',
      status: 'scheduled'
    },
    {
      id: '7',
      date: '2025-10-12',
      time: '03:00 PM',
      type: 'transport',
      title: 'Site Visit',
      details: 'Manufacturing Facility Tour',
      status: 'scheduled'
    },
    {
      id: '8',
      date: '2025-10-13',
      time: '11:00 AM',
      type: 'meeting',
      title: 'Contract Signing',
      details: 'Legal Office',
      status: 'scheduled'
    },
    {
      id: '9',
      date: '2025-10-14',
      time: '10:00 AM',
      type: 'meeting',
      title: 'Follow-up Meeting',
      details: 'Client HQ',
      status: 'scheduled'
    },
    {
      id: '10',
      date: '2025-10-15',
      time: '11:00 AM',
      type: 'hotel',
      title: 'Hotel Check-out',
      details: 'Marina Bay Sands',
      status: 'confirmed'
    },
    {
      id: '11',
      date: '2025-10-15',
      time: '02:00 PM',
      type: 'transport',
      title: 'Airport Transfer',
      details: 'Hotel to Changi Airport',
      status: 'confirmed'
    },
    {
      id: '12',
      date: '2025-10-15',
      time: '05:00 PM',
      type: 'flight',
      title: 'Return Flight',
      details: 'SIN → DEL (SQ404) • Terminal 3 • Seat 12A',
      status: 'confirmed'
    }
  ]);

  const [dayByDaySchedule, setDayByDaySchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [newActivity, setNewActivity] = useState({
    type: 'meeting',
    title: '',
    details: '',
    time: '',
    notes: ''
  });

  // Group schedule items by day
  useEffect(() => {
    const groupedByDay = scheduleItems.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    const scheduleArray = Object.keys(groupedByDay)
      .sort()
      .map((date, index) => ({
        date,
        dayNumber: index + 1,
        activities: groupedByDay[date].sort((a, b) => {
          const timeA = a.time.split(' ')[0];
          const timeB = b.time.split(' ')[0];
          return timeA.localeCompare(timeB);
        })
      }));

    setDayByDaySchedule(scheduleArray);
    if (scheduleArray.length > 0 && !selectedDay) {
      setSelectedDay(scheduleArray[0].date);
    }
  }, [scheduleItems, selectedDay]);

  const getCardStatusColor = (status) => {
    switch (status) {
      case 'active': return '#27ae60';
      case 'warning': return '#f39c12';
      case 'expired': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'meeting': return '🤝';
      case 'transport': return '🚗';
      default: return '📅';
    }
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'high': return 'badge-danger';
      default: return 'badge-success';
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleAddActivity = () => {
    setShowAddActivity(true);
  };

  const handleSaveActivity = () => {
    console.log('New activity:', newActivity);
    setShowAddActivity(false);
    setNewActivity({
      type: 'meeting',
      title: '',
      details: '',
      time: '',
      notes: ''
    });
  };

  const handleCheckIn = () => {
    setLastCheckIn(new Date().toLocaleString());
    alert('Check-in successful! Stay safe.');
  };

  const handleSOS = () => {
    alert('🚨 Emergency workflow triggered!\nContacting: ' + trip.emergency.name + ' at ' + trip.emergency.phone);
  };

  const handleExportPDF = () => {
    const html = `
      <html>
        <head><title>${trip.title}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>${trip.title}</h1>
          <p><strong>Dates:</strong> ${trip.startDate} - ${trip.endDate}</p>
          <p><strong>Destination:</strong> ${trip.destination.city}, ${trip.destination.country}</p>
          <h3>Day-by-Day Schedule</h3>
          ${scheduleItems.map(s => `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
              <strong>${s.date} ${s.time}</strong><br/>
              <div>${s.title}</div>
              <div style="color: #666;">${s.details}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: 'Trip itinerary',
        url: window.location.href,
      });
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  return (
    <div className="page-container">
      <div className="trip-header">
        <div>
          <h1 className="page-title">{trip.title}</h1>
          <p className="trip-subtitle">
            {trip.startDate} — {trip.endDate} • <span className="status-badge">{trip.status}</span>
          </p>
        </div>
        <div className="trip-header-right">
          <p className="approver-info">Approver: {trip.approver.name}</p>
        </div>
      </div>

      <div className="itinerary-grid">
        {/* Left Column *}
        <div className="itinerary-main">
          {/* Trip Summary *}
          <section className="trip-summary-card">
            <div className="summary-header">
              <div>
                <h2>Trip Summary</h2>
                <p className="destination-info">
                  <span className="flag">{trip.destination.flag}</span>
                  {trip.destination.city}, {trip.destination.country}
                </p>
                <div className="trip-meta">
                  <p><strong>Purpose:</strong> {trip.purpose}</p>
                  <p><strong>Risk Level:</strong> <span className={`risk-badge ${getRiskBadgeClass(trip.risk)}`}>{trip.risk}</span></p>
                </div>
              </div>
              <div className="duration-box">
                <p className="duration-label">Duration</p>
                <p className="duration-value">{trip.durationDays} days</p>
              </div>
            </div>
            <hr className="divider" />
            <div className="documents-grid">
              <div className="doc-item">
                <p className="doc-label">Passport</p>
                <p className="doc-value">{trip.documents.passport.status} • Expires {trip.documents.passport.expires}</p>
              </div>
              <div className="doc-item">
                <p className="doc-label">Insurance</p>
                <p className="doc-value">{trip.documents.insurance.provider} • Policy #{trip.documents.insurance.policy}</p>
              </div>
            </div>
          </section>

          {/* Travel Wallet *}
          <section className="travel-wallet">
            <h2>Travel Wallet</h2>
            <div className="cards-container">
              {travelCards.map(card => (
                <div key={card.id} className="travel-card">
                  <div className="card-header">
                    <h3>{card.type}</h3>
                    <span 
                      className="card-status"
                      style={{ backgroundColor: getCardStatusColor(card.status) }}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div className="card-details">
                    <p className="card-number">{card.number}</p>
                    <p className="card-expiry">Expires: {card.expiry}</p>
                    {card.status === 'warning' && (
                      <p className="expiry-warning">
                        ⚠️ Expires in {card.daysUntilExpiry} days
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Day-by-Day Schedule *}
          <section className="day-by-day-schedule">
            <div className="schedule-header">
              <h2>Day-by-Day Schedule</h2>
              <button className="btn-add-activity" onClick={handleAddActivity}>
                + Add Activity
              </button>
            </div>

            <div className="day-tabs">
              {dayByDaySchedule.map(day => (
                <button
                  key={day.date}
                  className={`day-tab ${selectedDay === day.date ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <span className="day-number">Day {day.dayNumber}</span>
                  <span className="day-date">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </button>
              ))}
            </div>

            {selectedDay && dayByDaySchedule.find(d => d.date === selectedDay) && (
              <div className="day-schedule-content">
                <div className="day-header">
                  <h3>{getDayOfWeek(selectedDay)}</h3>
                  <p className="full-date">{formatDate(selectedDay)}</p>
                </div>

                <div className="activities-timeline">
                  {dayByDaySchedule
                    .find(d => d.date === selectedDay)
                    .activities.map((activity) => (
                      <div key={activity.id} className="activity-card">
                        <div className="activity-time-marker">
                          <span className="activity-icon">{getItemIcon(activity.type)}</span>
                          <div className="timeline-line"></div>
                        </div>
                        <div className="activity-details">
                          <div className="activity-time">{activity.time}</div>
                          <div className="activity-content">
                            <h4>{activity.title}</h4>
                            <p className="activity-location">{activity.details}</p>
                            <span className={`activity-status ${activity.status}`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar *}
        <aside className="itinerary-sidebar">
          {/* Safety & Support *}
          <section className="safety-panel">
            <h3>Safety & Support</h3>
            <div className="safety-content">
              <div className="contact-item">
                <p className="contact-label">Emergency Contact</p>
                <p className="contact-value">{trip.emergency.name}</p>
                <p className="contact-phone">{trip.emergency.phone}</p>
              </div>
              <div className="contact-item">
                <p className="contact-label">Local Embassy</p>
                <p className="contact-value">{trip.embassy.name}</p>
                <p className="contact-phone">{trip.embassy.phone}</p>
              </div>
              {lastCheckIn && (
                <div className="check-in-status">
                  <p>✓ Last check-in: {lastCheckIn}</p>
                </div>
              )}
              <div className="safety-actions">
                <button className="btn-check-in" onClick={handleCheckIn}>
                  Check-in
                </button>
                <button className="btn-sos" onClick={handleSOS}>
                  🚨 SOS
                </button>
              </div>
            </div>
          </section>

          {/* Actions *}
          <section className="actions-panel">
            <h3>Actions</h3>
            <div className="actions-list">
              <button className="action-btn" onClick={handleExportPDF}>
                📄 Download PDF
              </button>
              <button className="action-btn" onClick={handleShare}>
                📤 Share Itinerary
              </button>
              <button className="action-btn" onClick={() => alert('Change request sent')}>
                ✏️ Request Change
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Add Activity Modal *}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Activity</h2>
              <button className="close-btn" onClick={() => setShowAddActivity(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Activity Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="flight">Flight</option>
                  <option value="hotel">Hotel</option>
                  <option value="transport">Transport</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="Activity title"
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  placeholder="e.g., 10:00 AM"
                />
              </div>
              <div className="form-group">
                <label>Location/Details</label>
                <input
                  type="text"
                  value={newActivity.details}
                  onChange={(e) => setNewActivity({ ...newActivity, details: e.target.value })}
                  placeholder="Location or details"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddActivity(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveActivity}>
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
*/
// Itinerary.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Itinerary.css";

const Itinerary = () => {
  const [trip, setTrip] = useState(null);
  const [travelCards, setTravelCards] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);

  const [dayByDaySchedule, setDayByDaySchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load itinerary (REMOVE HARDCODE)
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/itinerary/1");

        setTrip(res.data.trip);
        setTravelCards(res.data.cards || []);
        setScheduleItems(res.data.schedule || []);
      } catch (err) {
        setError("Failed to load itinerary");
        console.error("❌ Itinerary Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  // Generate day-by-day schedule
  useEffect(() => {
    if (!scheduleItems.length) return;

    const grouped = scheduleItems.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    const scheduleArray = Object.keys(grouped)
      .sort()
      .map((date, index) => ({
        date,
        dayNumber: index + 1,
        activities: grouped[date].sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
      }));

    setDayByDaySchedule(scheduleArray);
    if (!selectedDay && scheduleArray.length > 0) {
      setSelectedDay(scheduleArray[0].date);
    }
  }, [scheduleItems]);

  // UI HELPERS
  const getItemIcon = (type) => {
    switch (type) {
      case "flight": return "✈️";
      case "hotel": return "🏨";
      case "meeting": return "🤝";
      case "transport": return "🚗";
      default: return "📅";
    }
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case "Low": return "badge-success";
      case "Medium": return "badge-warning";
      case "High": return "badge-danger";
      default: return "";
    }
  };

  // Loading UI
  if (loading) return <p className="loading">Loading itinerary...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!trip) return <p>No itinerary found.</p>;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="trip-header">
        <div>
          <h1 className="page-title">{trip.title}</h1>
          <p className="trip-subtitle">
            {trip.startDate} — {trip.endDate} • 
            <span className="status-badge">{trip.status}</span>
          </p>
        </div>
        <div className="trip-header-right">
          <p className="approver-info">Approver: {trip.approver_name}</p>
        </div>
      </div>

      <div className="itinerary-grid">
        {/* LEFT MAIN CONTENT */}
        <div className="itinerary-main">
          
          {/* Summary */}
          <section className="trip-summary-card">
            <div className="summary-header">
              <div>
                <h2>Trip Summary</h2>
                <p className="destination-info">
                  <span className="flag">{trip.destination_flag}</span>
                  {trip.destination_city}, {trip.destination_country}
                </p>
                <div className="trip-meta">
                  <p><strong>Purpose:</strong> {trip.purpose}</p>
                  <p>
                    <strong>Risk:</strong>
                    <span className={`risk-badge ${getRiskBadgeClass(trip.risk)}`}>
                      {trip.risk}
                    </span>
                  </p>
                </div>
              </div>

              <div className="duration-box">
                <p className="duration-label">Duration</p>
                <p className="duration-value">{trip.durationDays} days</p>
              </div>
            </div>

            <hr className="divider" />

            <div className="documents-grid">
              <div className="doc-item">
                <p className="doc-label">Passport</p>
                <p className="doc-value">
                  {trip.passport_status} • Expires {trip.passport_expires}
                </p>
              </div>
              <div className="doc-item">
                <p className="doc-label">Insurance</p>
                <p className="doc-value">
                  {trip.insurance_provider} • Policy #{trip.insurance_policy}
                </p>
              </div>
            </div>
          </section>

          {/* Travel Wallet */}
          <section className="travel-wallet">
            <h2>Travel Wallet</h2>
            <div className="cards-container">
              {travelCards.map((card) => (
                <div key={card.id} className="travel-card">
                  <div className="card-header">
                    <h3>{card.type}</h3>
                    <span className="card-status">{card.status}</span>
                  </div>
                  <div className="card-details">
                    <p className="card-number">{card.number}</p>
                    <p className="card-expiry">Expires: {card.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Day-by-Day Schedule */}
          <section className="day-by-day-schedule">
            <h2>Day-by-Day Schedule</h2>

            <div className="day-tabs">
              {dayByDaySchedule.map((day) => (
                <button
                  key={day.date}
                  className={`day-tab ${selectedDay === day.date ? "active" : ""}`}
                  onClick={() => setSelectedDay(day.date)}
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </div>

            {/* Activities */}
            {selectedDay && (
              <div className="activities-timeline">
                {dayByDaySchedule
                  .find((d) => d.date === selectedDay)
                  .activities.map((activity) => (
                    <div key={activity.id} className="activity-card">
                      <span className="activity-icon">{getItemIcon(activity.type)}</span>
                      <div className="activity-details">
                        <div className="activity-time">{activity.time}</div>
                        <h4>{activity.title}</h4>
                        <p>{activity.details}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="itinerary-sidebar">
          <section className="safety-panel">
            <h3>Safety & Support</h3>
            <p>{trip.emergency_name}</p>
            <p>{trip.emergency_phone}</p>
          </section>

          <section className="actions-panel">
            <h3>Actions</h3>
            <button className="action-btn">📄 Download PDF</button>
            <button className="action-btn">📤 Share</button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Itinerary;
