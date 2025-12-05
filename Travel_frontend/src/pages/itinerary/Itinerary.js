  // Itinerary.js
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './Itinerary.css';

  const Itinerary = () => {
    const [allTrips, setAllTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [trip, setTrip] = useState(null);
    const [travelCards, setTravelCards] = useState([]);
    const [scheduleItems, setScheduleItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dayByDaySchedule, setDayByDaySchedule] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [emergencyContacts, setEmergencyContacts] = useState(null);
    const [newActivity, setNewActivity] = useState({
      type: 'meeting',
      title: '',
      details: '',
      time: '',
      notes: ''
    });

    // Fetch all trips
    useEffect(() => {
      const fetchTrips = async () => {
        try {
          const token = localStorage.getItem("token");
          const tripsResponse = await axios.get("http://localhost:5000/api/travel/my", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const trips = tripsResponse.data;
          setAllTrips(trips);
          
          if (trips && trips.length > 0) {
            setSelectedTripId(trips[0].id);
          }
        } catch (error) {
          console.error("Error fetching trips:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrips();
    }, []);

    // Fetch itinerary when trip is selected
    useEffect(() => {
      if (!selectedTripId) return;

      const fetchItinerary = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/itinerary/${selectedTripId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const data = response.data;
          setTrip(data);
          setTravelCards(data.travelCards || []);
          setScheduleItems(data.scheduleItems || []);
        } catch (error) {
          console.error("Error fetching itinerary:", error);
        }
      };

      fetchItinerary();
    }, [selectedTripId]);

    // Set emergency contacts from trip data (already fetched by itinerary endpoint)
    useEffect(() => {
      if (!trip) return;
      
      // The itinerary endpoint already returns emergency contacts based on destination
      if (trip.emergency && trip.embassy) {
        setEmergencyContacts({
          emergency: trip.emergency,
          embassy: trip.embassy
        });
      }
    }, [trip]);

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
            // Convert time to 24-hour format for proper sorting
            const convertTo24Hour = (time) => {
              const [timePart, period] = time.split(' ');
              let [hours, minutes] = timePart.split(':').map(Number);
              
              if (period === 'PM' && hours !== 12) hours += 12;
              if (period === 'AM' && hours === 12) hours = 0;
              
              return hours * 60 + minutes; // Return minutes since midnight
            };
            
            return convertTo24Hour(a.time) - convertTo24Hour(b.time);
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

    const handleCheckIn = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/emergency/checkin",
          {
            tripId: trip.id,
            location: trip.destination.city,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setLastCheckIn(new Date().toLocaleString());
          alert('✅ Check-in successful! Stay safe.');
        }
      } catch (error) {
        console.error("Check-in error:", error);
        alert('Failed to record check-in. Please try again.');
      }
    };

    const handleSOS = async () => {
      const confirmed = window.confirm(
        '🚨 EMERGENCY ALERT\n\nThis will notify:\n' +
        trip.emergency.name + '\n' +
        trip.emergency.phone + '\n\n' +
        'Do you want to proceed?'
      );

      if (!confirmed) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/emergency/sos",
          {
            tripId: trip.id,
            location: trip.destination.city,
            message: "Emergency assistance required",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          alert('🚨 Emergency alert sent successfully!\n\nHelp is on the way.');
        }
      } catch (error) {
        console.error("SOS error:", error);
        alert('Failed to send emergency alert. Please call directly:\n' + trip.emergency.phone);
      }
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

    if (loading) {
      return (
        <div className="page-container">
          <p>Loading itinerary...</p>
        </div>
      );
    }

    if (!trip) {
      return (
        <div className="page-container">
          <p>No itinerary found.</p>
        </div>
      );
    }

    return (
      <div className="page-container">
        {/* Trip Selector */}
        {allTrips.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 600, marginRight: '10px' }}>Select Trip:</label>
            <select 
              value={selectedTripId || ''} 
              onChange={(e) => setSelectedTripId(Number(e.target.value))}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #ddd',
                fontSize: '14px',
                minWidth: '300px'
              }}
            >
              {allTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.destination} - {t.startDate} ({t.status})
                </option>
              ))}
            </select>
          </div>
        )}

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
          {/* Left Column */}
          <div className="itinerary-main">
            {/* Trip Summary */}
            <section className="trip-summary-card">
              <div className="summary-header">
                <div>
                  <h2>Trip Summary</h2>
                  <p className="destination-info">
                    <span 
                      className="flag" 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination.city)}`, '_blank')}
                      style={{ cursor: 'pointer' }}
                      title="View on Google Maps"
                    >
                      {trip.destination.flag}
                    </span>
                    {trip.destination.city}
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

            {/* Travel Wallet */}
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

            {/* Day-by-Day Schedule */}
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

          {/* Right Sidebar */}
          <aside className="itinerary-sidebar">
            {/* Safety & Support */}
            <section className="safety-panel">
              <h3>Safety & Support</h3>
              <div className="safety-content">
                <div className="contact-item">
                  <p className="contact-label">Emergency Contact</p>
                  <p className="contact-value">{emergencyContacts?.emergency?.name || trip.emergency?.name || "Loading..."}</p>
                  <p className="contact-phone">{emergencyContacts?.emergency?.phone || trip.emergency?.phone || "N/A"}</p>
                </div>
                <div className="contact-item">
                  <p className="contact-label">Local Embassy</p>
                  <p className="contact-value">{emergencyContacts?.embassy?.name || trip.embassy?.name || "Loading..."}</p>
                  <p className="contact-phone">{emergencyContacts?.embassy?.phone || trip.embassy?.phone || "N/A"}</p>
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

            <section className="actions-panel">
  <h3>Actions</h3>

  <div className="actions-list">
    <button className="gradient-btn" onClick={handleExportPDF}>
      <span className="action-icon">📄</span>
      <span>Download PDF</span>
    </button>

    <button className="gradient-btn" onClick={handleShare}>
      <span className="action-icon">📤</span>
      <span>Share Itinerary</span>
    </button>

    <button className="gradient-btn" onClick={() => alert("Change request sent")}>
      <span className="action-icon">✏️</span>
      <span>Request Change</span>
    </button>
  </div>
</section>

          </aside>
        </div>

        {/* Add Activity Modal */}
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