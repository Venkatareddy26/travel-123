// Safety.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Safety.css';
import './SafetyModalFix.css';

const countByLevel = (data = [], level) => data.filter(d => d.level === level).length;

const Safety = () => {
  const navigate = useNavigate();

  // --- dynamic risk data from backend API ---
  const [riskData, setRiskData] = useState([]);
  const [loadingRisk, setLoadingRisk] = useState(true);

  // other local states (unchanged structure / format)
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [showCovidGuidelines, setShowCovidGuidelines] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showEmbassyDetails, setShowEmbassyDetails] = useState(false);
  const [embassyDetails, setEmbassyDetails] = useState([]);

  const [vaccinationData, setVaccinationData] = useState({
    employeeId: '',
    fullName: '',
    age: '',
    dateOfBirth: '',
    vaccinationDate: '',
    notes: ''
  });

  const [vaccinationEntries, setVaccinationEntries] = useState([]);
  const [showVaccinationList, setShowVaccinationList] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  const [insuranceEntries, setInsuranceEntries] = useState([]);
  const [showInsuranceList, setShowInsuranceList] = useState(true);
  const [editingInsuranceIndex, setEditingInsuranceIndex] = useState(null);

  const [insuranceData, setInsuranceData] = useState({
    employeeId: '',
    fullName: '',
    department: '',
    insuranceProvider: '',
    policyNumber: '',
    coverageType: '',
    destinationCoverage: '',
    coverageStartDate: '',
    coverageEndDate: '',
    insuranceHelpline: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [emergencyNumbers, setEmergencyNumbers] = useState({
    police: '',
    ambulance: '',
    fire: '',
    personal: ''
  });

  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [covidGuidelines, setCovidGuidelines] = useState([]);
  const [travelTips, setTravelTips] = useState([]);
  const [healthTips, setHealthTips] = useState([]);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        // Check if it's the old format (object) or new format (array)
        if (Array.isArray(parsed)) {
          setEmergencyContacts(parsed);
        } else {
          // Convert old format to new format
          setEmergencyNumbers(parsed);
        }
      } catch (e) {
        console.error('Error parsing emergency contacts:', e);
      }
    }

    const savedVaccinations = localStorage.getItem('vaccinationEntries');
    if (savedVaccinations) {
      setVaccinationEntries(JSON.parse(savedVaccinations));
    }

    const savedInsurance = localStorage.getItem('insuranceEntries');
    if (savedInsurance) {
      setInsuranceEntries(JSON.parse(savedInsurance));
    }

    const savedEmbassy = localStorage.getItem('embassyDetails');
    if (savedEmbassy) {
      setEmbassyDetails(JSON.parse(savedEmbassy));
    }

    const savedGuidelines = localStorage.getItem('covidGuidelines');
    if (savedGuidelines) {
      setCovidGuidelines(JSON.parse(savedGuidelines));
    }

    const savedTravelTips = localStorage.getItem('travelTips');
    if (savedTravelTips) {
      setTravelTips(JSON.parse(savedTravelTips));
    } else {
      const defaultTips = [
        'Keep copies of important documents in separate locations',
        'Register with your embassy if traveling internationally',
        'Check local customs and cultural norms',
        'Keep emergency cash in local currency',
        'Share your itinerary with trusted contacts'
      ];
      setTravelTips(defaultTips);
      localStorage.setItem('travelTips', JSON.stringify(defaultTips));
    }

    const savedHealthTips = localStorage.getItem('healthTips');
    if (savedHealthTips) {
      setHealthTips(JSON.parse(savedHealthTips));
    } else {
      const defaultHealthTips = [
        'Check vaccination requirements for destination',
        'Pack necessary medications with prescriptions',
        'Research local healthcare facilities',
        'Consider travel health insurance',
        'Stay hydrated and get adequate rest'
      ];
      setHealthTips(defaultHealthTips);
      localStorage.setItem('healthTips', JSON.stringify(defaultHealthTips));
    }

    const savedChecklist = localStorage.getItem('safetyChecklist');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      // Set default checklist items on first load
      const defaultChecklist = [
        { id: '1', item: 'Passport/ID documents verified', checked: false, required: true, category: 'documents' },
        { id: '2', item: 'Visa requirements checked', checked: false, required: true, category: 'documents' },
        { id: '3', item: 'Travel insurance active', checked: false, required: true, category: 'insurance' },
        { id: '4', item: 'Emergency contacts updated', checked: false, required: true, category: 'contacts' },
        { id: '5', item: 'COVID-19 vaccination verified', checked: false, required: true, category: 'health' },
        { id: '6', item: 'Medical requirements reviewed', checked: false, required: false, category: 'health' },
        { id: '7', item: 'Itinerary shared with team', checked: false, required: true, category: 'communication' },
        { id: '8', item: 'Local emergency numbers saved', checked: false, required: false, category: 'contacts' },
        { id: '9', item: 'Travel advisories checked', checked: false, required: false, category: 'safety' },
        { id: '10', item: 'Company travel policy acknowledged', checked: false, required: true, category: 'compliance' }
      ];
      setChecklist(defaultChecklist);
      localStorage.setItem('safetyChecklist', JSON.stringify(defaultChecklist));
    }

    // Fetch risk data from backend API
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
        setLoadingRisk(false);
      }
    };
    fetchRiskData();
  }, []);

  // keep vaccination/insurance handling logic same as before
  const handleCheckboxChange = (id) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    localStorage.setItem('safetyChecklist', JSON.stringify(updated));
  };

  const handleVaccinationSubmit = (e) => {
    e.preventDefault();
    let updatedEntries;

    if (editingIndex !== null) {
      updatedEntries = vaccinationEntries.map((entry, index) =>
        index === editingIndex ? { ...vaccinationData, updatedAt: new Date().toISOString() } : entry
      );
      alert('Vaccination details updated successfully!');
      setEditingIndex(null);
    } else {
      updatedEntries = [...vaccinationEntries, { ...vaccinationData, submittedAt: new Date().toISOString() }];
      alert('Vaccination details submitted successfully!');
    }

    setVaccinationEntries(updatedEntries);
    localStorage.setItem('vaccinationEntries', JSON.stringify(updatedEntries));
    setShowVaccinationList(true);
    setVaccinationData({ employeeId: '', fullName: '', age: '', dateOfBirth: '', vaccinationDate: '', notes: '' });
    setChecklist(prev => prev.map(item => item.id === '5' ? { ...item, checked: true } : item));
  };

  const handleEditVaccination = (index) => {
    setVaccinationData(vaccinationEntries[index]);
    setEditingIndex(index);
    setShowVaccinationList(false);
  };

  const handleDeleteVaccination = (index) => {
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      const updatedEntries = vaccinationEntries.filter((_, i) => i !== index);
      setVaccinationEntries(updatedEntries);
      localStorage.setItem('vaccinationEntries', JSON.stringify(updatedEntries));
      alert('Vaccination record deleted successfully!');
    }
  };

  const handleAddNew = () => {
    setVaccinationData({ employeeId: '', fullName: '', age: '', dateOfBirth: '', vaccinationDate: '', notes: '' });
    setEditingIndex(null);
    setShowVaccinationList(false);
  };

  const handleInsuranceSubmit = (e) => {
    e.preventDefault();
    let updatedEntries;

    if (editingInsuranceIndex !== null) {
      updatedEntries = insuranceEntries.map((entry, index) =>
        index === editingInsuranceIndex ? { ...insuranceData, updatedAt: new Date().toISOString() } : entry
      );
      alert('Insurance details updated successfully!');
      setEditingInsuranceIndex(null);
    } else {
      updatedEntries = [...insuranceEntries, { ...insuranceData, submittedAt: new Date().toISOString() }];
      alert('Insurance details submitted successfully!');
    }

    setInsuranceEntries(updatedEntries);
    localStorage.setItem('insuranceEntries', JSON.stringify(updatedEntries));
    setShowInsuranceList(true);
    setInsuranceData({
      employeeId: '', fullName: '', department: '', insuranceProvider: '', policyNumber: '',
      coverageType: '', destinationCoverage: '', coverageStartDate: '', coverageEndDate: '',
      insuranceHelpline: '', emergencyContactName: '', emergencyContactPhone: ''
    });
    setChecklist(prev => prev.map(item => item.id === '3' ? { ...item, checked: true } : item));
  };

  const handleEditInsurance = (index) => {
    setInsuranceData(insuranceEntries[index]);
    setEditingInsuranceIndex(index);
    setShowInsuranceList(false);
  };

  const handleDeleteInsurance = (index) => {
    if (window.confirm('Are you sure you want to delete this insurance record?')) {
      const updatedEntries = insuranceEntries.filter((_, i) => i !== index);
      setInsuranceEntries(updatedEntries);
      localStorage.setItem('insuranceEntries', JSON.stringify(updatedEntries));
      alert('Insurance record deleted successfully!');
    }
  };

  const handleAddNewInsurance = () => {
    setInsuranceData({
      employeeId: '', fullName: '', department: '', insuranceProvider: '', policyNumber: '',
      coverageType: '', destinationCoverage: '', coverageStartDate: '', coverageEndDate: '',
      insuranceHelpline: '', emergencyContactName: '', emergencyContactPhone: ''
    });
    setEditingInsuranceIndex(null);
    setShowInsuranceList(false);
  };

  const handleEmergencySave = () => {
    // Convert old format to new array format
    const contactsArray = [
      { name: 'Police', phone: emergencyNumbers.police },
      { name: 'Ambulance', phone: emergencyNumbers.ambulance },
      { name: 'Fire Brigade', phone: emergencyNumbers.fire },
      { name: 'Personal Emergency Contact', phone: emergencyNumbers.personal }
    ];
    setEmergencyContacts(contactsArray);
    localStorage.setItem('emergencyContacts', JSON.stringify(contactsArray));
    setIsEditingEmergency(false);
    alert('Emergency contacts saved successfully!');
  };

  // checklist -- load from localStorage or use default
  const [checklist, setChecklist] = useState([]);

  const completedItems = checklist.filter(item => item.checked).length;
  const requiredItems = checklist.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.checked).length;
  const completionPercentage = Math.round((completedItems / checklist.length) * 100);
  const requiredCompletion = Math.round((completedRequired / requiredItems.length) * 100);
  const isReadyToTravel = completedRequired === requiredItems.length;

  // navigate to RiskRatingDetails (keep same format but make it dynamic)
  const openRiskDetails = (filterLevel) => {
    // Navigate to risk rating details page with filter level
    navigate('/employee/risk-rating-details', { state: { filterLevel } });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Safety Checklist</h1>

      {/* Risk Rating System (now dynamic, not hard-coded counts) */}
      <div className="risk-rating-section">
        <h2>🌍 Destination Risk Rating</h2>

        <div className="risk-summary-cards">
          <div className="risk-summary-card low" onClick={() => openRiskDetails('Low')}>
            <div className="risk-icon">🟢</div>
            <div className="risk-info">
              <h3>Low Risk</h3>
              <p>{countByLevel(riskData, 'Low')} destinations</p>
            </div>
          </div>

          <div className="risk-summary-card medium" onClick={() => openRiskDetails('Medium')}>
            <div className="risk-icon">🟡</div>
            <div className="risk-info">
              <h3>Medium Risk</h3>
              <p>{countByLevel(riskData, 'Medium')} destinations</p>
            </div>
          </div>

          <div className="risk-summary-card high" onClick={() => openRiskDetails('High')}>
            <div className="risk-icon">🔴</div>
            <div className="risk-info">
              <h3>High Risk</h3>
              <p>{countByLevel(riskData, 'High')} destinations</p>
            </div>
          </div>
        </div>

        <div className="risk-destinations">
          {/* render dynamic list from riskData (keeps visual format similar) */}
          {riskData.length === 0 ? (
            <>
              {/* keep format: show two empty boxes similar to original UI when no data */}
              <div className="empty-destination-box">
                <div className="destination-header">
                  <span className="risk-badge">—</span>
                  <h4>Updated: N/A</h4>
                </div>
              </div>
              <div className="empty-destination-box">
                <div className="destination-header">
                  <span className="risk-badge">—</span>
                  <h4>Updated: N/A</h4>
                </div>
              </div>
            </>
          ) : (
            riskData.map((d, idx) => (
              <div key={idx} className={`risk-destination-item ${d.level ? d.level.toLowerCase() + '-risk' : ''}`}>
                <div className="destination-header">
                  <span className={`risk-badge ${d.level ? d.level.toLowerCase() : ''}`}>
                    {d.level ? (d.level === 'Low' ? '🟢 Low Risk' : d.level === 'Medium' ? '🟡 Medium Risk' : '🔴 High Risk') : 'No Data'}
                  </span>
                  <h4>{d.city ? `${d.city}, ${d.country}` : d.country}</h4>
                </div>
                <p>{d.description || 'No description available'}</p>
                <span className="update-date">Updated: {d.date || 'N/A'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions Section - Prominent Position */}
      <div className="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons-grid">
          <button className="action-button vaccination" onClick={() => {
            console.log('Vaccination button clicked');
            setShowVaccinationForm(true);
          }}>
            <span className="action-icon">💉</span>
            <div className="action-text">
              <h3>Vaccination Details</h3>
              <p>Submit vaccination records</p>
            </div>
          </button>
          <button className="action-button insurance" onClick={() => setShowInsuranceForm(true)}>
            <span className="action-icon">🛡️</span>
            <div className="action-text">
              <h3>Insurance Verification</h3>
              <p>Verify travel insurance</p>
            </div>
          </button>
          <button className="action-button covid" onClick={() => setShowCovidGuidelines(true)}>
            <span className="action-icon">😷</span>
            <div className="action-text">
              <h3>COVID Guidelines</h3>
              <p>View health guidelines</p>
            </div>
          </button>
          <button className="action-button emergency" onClick={() => setShowEmergencyContacts(true)}>
            <span className="action-icon">📞</span>
            <div className="action-text">
              <h3>Emergency Contacts</h3>
              <p>Manage emergency numbers</p>
            </div>
          </button>
          <button className="action-button embassy" onClick={() => setShowEmbassyDetails(true)}>
            <span className="action-icon">🏛️</span>
            <div className="action-text">
              <h3>Embassy Details</h3>
              <p>View embassy information</p>
            </div>
          </button>
        </div>
      </div>

      <div className="safety-layout">
        <div className="checklist-section">
          <div className="progress-summary">
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-number">{completedItems}/{checklist.length}</span>
                <span className="stat-label">Items Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{completionPercentage}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
              <div className="stat">
                <span className="stat-number">{completedRequired}/{requiredItems.length}</span>
                <span className="stat-label">Required Items</span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className={`travel-status ${isReadyToTravel ? 'ready' : 'not-ready'}`}>
              {isReadyToTravel ? (
                <>
                  <span className="status-icon">✅</span>
                  <span>Ready to Travel!</span>
                </>
              ) : (
                <>
                  <span className="status-icon">⚠️</span>
                  <span>Complete required items before traveling</span>
                </>
              )}
            </div>
          </div>

          <div className="checklist-items">
            <h2>Safety Requirements</h2>
            {checklist.map(item => (
              <div key={item.id} className="checklist-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <span className="checkmark"></span>
                  <span className={`item-text ${item.checked ? 'completed' : ''}`}>
                    {item.item}
                    {item.required && <span className="required-badge">Required</span>}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="safety-info">
          <div className="info-card compliance-card">
            <h3>Compliance Requirements</h3>
            <div className="compliance-list">
              <div className="compliance-item">
                <span className="compliance-icon">📋</span>
                <div>
                  <strong>Travel Policy</strong>
                  <p>Review company travel guidelines</p>
                </div>
              </div>
              <div className="compliance-item">
                <span className="compliance-icon">💉</span>
                <div>
                  <strong>Health Requirements</strong>
                  <p>COVID-19 and destination-specific vaccinations</p>
                </div>
              </div>
              <div className="compliance-item">
                <span className="compliance-icon">🛡️</span>
                <div>
                  <strong>Insurance Coverage</strong>
                  <p>Verify active travel and health insurance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Emergency Contacts</h3>
            <div className="contact-list">
              {emergencyContacts.length === 0 ? (
                <p>No emergency contacts added. Click "Emergency Contacts" to manage.</p>
              ) : (
                emergencyContacts.slice(0, 4).map((contact, idx) => (
                  <div key={idx} className="contact-item">
                    <strong>{contact.name}:</strong>
                    <span>{contact.phone}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="info-card">
            <h3>Travel Tips</h3>
            <ul className="tips-list">
              {travelTips.length === 0 ? (
                <li>No travel tips available</li>
              ) : (
                travelTips.map((tip, idx) => <li key={idx}>{tip}</li>)
              )}
            </ul>
          </div>

          <div className="info-card">
            <h3>Health & Safety</h3>
            <ul className="tips-list">
              {healthTips.length === 0 ? (
                <li>No health tips available</li>
              ) : (
                healthTips.map((tip, idx) => <li key={idx}>{tip}</li>)
              )}
            </ul>
          </div>

          <div className="info-card action-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-button vaccination" onClick={() => {
                console.log('Vaccination button clicked');
                setShowVaccinationForm(true);
              }}>
                💉 Vaccination Details
              </button>
              <button className="action-button insurance" onClick={() => setShowInsuranceForm(true)}>
                🛡️ Insurance Verification
              </button>
              <button className="action-button covid" onClick={() => setShowCovidGuidelines(true)}>
                😷 COVID Guidelines
              </button>
              <button className="action-button emergency" onClick={() => setShowEmergencyContacts(true)}>
                📞 Emergency Contacts
              </button>
              <button className="action-button embassy" onClick={() => setShowEmbassyDetails(true)}>
                🏛️ Embassy Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Modal (unchanged) */}
      {showVaccinationForm && (
        <div className="modal-overlay" onClick={() => {
          setShowVaccinationForm(false);
          setShowVaccinationList(true);
          setEditingIndex(null);
        }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💉 Vaccination Verification</h2>
              <button className="close-btn" onClick={() => {
                setShowVaccinationForm(false);
                setShowVaccinationList(true);
                setEditingIndex(null);
              }}>✕</button>
            </div>

            {showVaccinationList ? (
              <div className="vaccination-list-view">
                <div className="list-header">
                  <h3>Vaccination Records ({vaccinationEntries.length})</h3>
                  <button className="add-new-btn" onClick={handleAddNew}>
                    ➕ Add New Record
                  </button>
                </div>

                {vaccinationEntries.length === 0 ? (
                  <div className="no-records">
                    <span className="no-records-icon">💉</span>
                    <p>No vaccination records found</p>
                    <button className="add-first-btn" onClick={handleAddNew}>
                      Add Your First Record
                    </button>
                  </div>
                ) : (
                  <div className="records-list">
                    {vaccinationEntries.map((entry, index) => (
                      <div key={index} className="record-card">
                        <div className="record-header">
                          <h4>{entry.fullName}</h4>
                          <span className="record-badge">✓ Verified</span>
                        </div>
                        <div className="record-details">
                          <div className="record-row">
                            <span className="label">Employee ID:</span>
                            <span className="value">{entry.employeeId}</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Age:</span>
                            <span className="value">{entry.age} years</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Vaccination Date:</span>
                            <span className="value">{entry.vaccinationDate ? new Date(entry.vaccinationDate).toLocaleDateString() : '-'}</span>
                          </div>
                          {entry.notes && (
                            <div className="record-row">
                              <span className="label">Notes:</span>
                              <span className="value">{entry.notes}</span>
                            </div>
                          )}
                          <div className="record-row">
                            <span className="label">Submitted:</span>
                            <span className="value">{entry.submittedAt ? new Date(entry.submittedAt).toLocaleString() : '-'}</span>
                          </div>
                        </div>
                        <div className="record-actions">
                          <button className="edit-record-btn" onClick={() => handleEditVaccination(index)}>
                            ✏️ Edit
                          </button>
                          <button className="delete-record-btn" onClick={() => handleDeleteVaccination(index)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleVaccinationSubmit} className="safety-form">
                <button
                  type="button"
                  className="back-to-list-btn"
                  onClick={() => {
                    setShowVaccinationList(true);
                    setEditingIndex(null);
                    setVaccinationData({ employeeId: '', fullName: '', age: '', dateOfBirth: '', vaccinationDate: '', notes: '' });
                  }}
                >
                  ← Back to List
                </button>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input type="text" required value={vaccinationData.employeeId}
                      onChange={(e) => setVaccinationData({ ...vaccinationData, employeeId: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={vaccinationData.fullName}
                      onChange={(e) => setVaccinationData({ ...vaccinationData, fullName: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Age *</label>
                    <input type="number" required value={vaccinationData.age}
                      onChange={(e) => setVaccinationData({ ...vaccinationData, age: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" value={vaccinationData.dateOfBirth}
                      onChange={(e) => setVaccinationData({ ...vaccinationData, dateOfBirth: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Vaccination Date *</label>
                  <input type="date" required value={vaccinationData.vaccinationDate}
                    onChange={(e) => setVaccinationData({ ...vaccinationData, vaccinationDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea rows="3" value={vaccinationData.notes}
                    onChange={(e) => setVaccinationData({ ...vaccinationData, notes: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Vaccination Receipt (PDF/Photo)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <button type="submit" className="submit-btn">
                  {editingIndex !== null ? '✓ Update Record' : '✓ Submit Vaccination Details'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Insurance Modal (unchanged) */}
      {showInsuranceForm && (
        <div className="modal-overlay" onClick={() => {
          setShowInsuranceForm(false);
          setShowInsuranceList(true);
          setEditingInsuranceIndex(null);
        }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛡️ Travel Insurance Verification</h2>
              <button className="close-btn" onClick={() => {
                setShowInsuranceForm(false);
                setShowInsuranceList(true);
                setEditingInsuranceIndex(null);
              }}>✕</button>
            </div>

            {showInsuranceList ? (
              <div className="vaccination-list-view">
                <div className="list-header">
                  <h3>Insurance Records ({insuranceEntries.length})</h3>
                  <button className="add-new-btn" onClick={handleAddNewInsurance}>
                    ➕ Add New Record
                  </button>
                </div>

                {insuranceEntries.length === 0 ? (
                  <div className="no-records">
                    <span className="no-records-icon">🛡️</span>
                    <p>No insurance records found</p>
                    <button className="add-first-btn" onClick={handleAddNewInsurance}>
                      Add Your First Record
                    </button>
                  </div>
                ) : (
                  <div className="records-list">
                    {insuranceEntries.map((entry, index) => (
                      <div key={index} className="record-card">
                        <div className="record-header">
                          <h4>{entry.fullName}</h4>
                          <span className="record-badge">✓ Active</span>
                        </div>
                        <div className="record-details">
                          <div className="record-row">
                            <span className="label">Policy Number:</span>
                            <span className="value">{entry.policyNumber}</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Provider:</span>
                            <span className="value">{entry.insuranceProvider}</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Coverage:</span>
                            <span className="value">{entry.coverageType}</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Valid From:</span>
                            <span className="value">{entry.coverageStartDate ? new Date(entry.coverageStartDate).toLocaleDateString() : '-'} - {entry.coverageEndDate ? new Date(entry.coverageEndDate).toLocaleDateString() : '-'}</span>
                          </div>
                          <div className="record-row">
                            <span className="label">Helpline:</span>
                            <span className="value">{entry.insuranceHelpline}</span>
                          </div>
                        </div>
                        <div className="record-actions">
                          <button className="edit-record-btn" onClick={() => handleEditInsurance(index)}>
                            ✏️ Edit
                          </button>
                          <button className="delete-record-btn" onClick={() => handleDeleteInsurance(index)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleInsuranceSubmit} className="safety-form">
                <button
                  type="button"
                  className="back-to-list-btn"
                  onClick={() => {
                    setShowInsuranceList(true);
                    setEditingInsuranceIndex(null);
                  }}
                >
                  ← Back to List
                </button>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input type="text" required value={insuranceData.employeeId}
                      onChange={(e) => setInsuranceData({ ...insuranceData, employeeId: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={insuranceData.fullName}
                      onChange={(e) => setInsuranceData({ ...insuranceData, fullName: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Department / Designation *</label>
                  <input type="text" required value={insuranceData.department}
                    onChange={(e) => setInsuranceData({ ...insuranceData, department: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Insurance Provider *</label>
                    <input type="text" required value={insuranceData.insuranceProvider}
                      onChange={(e) => setInsuranceData({ ...insuranceData, insuranceProvider: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Policy Number *</label>
                    <input type="text" required value={insuranceData.policyNumber}
                      onChange={(e) => setInsuranceData({ ...insuranceData, policyNumber: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Coverage Type *</label>
                    <input type="text" required value={insuranceData.coverageType}
                      onChange={(e) => setInsuranceData({ ...insuranceData, coverageType: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Destination Coverage *</label>
                    <input type="text" required value={insuranceData.destinationCoverage}
                      onChange={(e) => setInsuranceData({ ...insuranceData, destinationCoverage: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Coverage Start Date *</label>
                    <input type="date" required value={insuranceData.coverageStartDate}
                      onChange={(e) => setInsuranceData({ ...insuranceData, coverageStartDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Coverage End Date *</label>
                    <input type="date" required value={insuranceData.coverageEndDate}
                      onChange={(e) => setInsuranceData({ ...insuranceData, coverageEndDate: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Insurance Helpline *</label>
                  <input type="tel" required value={insuranceData.insuranceHelpline}
                    onChange={(e) => setInsuranceData({ ...insuranceData, insuranceHelpline: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Emergency Contact Name *</label>
                    <input type="text" required value={insuranceData.emergencyContactName}
                      onChange={(e) => setInsuranceData({ ...insuranceData, emergencyContactName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Phone *</label>
                    <input type="tel" required value={insuranceData.emergencyContactPhone}
                      onChange={(e) => setInsuranceData({ ...insuranceData, emergencyContactPhone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Proof Document (PDF/Photo)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <button type="submit" className="submit-btn">
                  {editingInsuranceIndex !== null ? '✓ Update Record' : '✓ Submit Insurance Details'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* COVID Guidelines Modal */}
      {showCovidGuidelines && (
        <div className="modal-overlay" onClick={() => setShowCovidGuidelines(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>😷 COVID-19 Health Guidelines</h2>
              <button className="close-btn" onClick={() => setShowCovidGuidelines(false)}>✕</button>
            </div>
            <div className="guidelines-content">
              {covidGuidelines.length === 0 ? (
                <div className="no-records">
                  <p>No COVID guidelines added yet. Guidelines can be managed by administrators.</p>
                </div>
              ) : (
                covidGuidelines.map((guideline, idx) => (
                  <div key={idx} className="guideline-item">
                    <span className="guideline-icon">📌</span>
                    <p>{guideline.text || guideline}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts Modal */}
      {showEmergencyContacts && (
        <div className="modal-overlay" onClick={() => setShowEmergencyContacts(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📞 Emergency Contacts</h2>
              <button className="close-btn" onClick={() => setShowEmergencyContacts(false)}>✕</button>
            </div>
            {!isEditingEmergency ? (
              <div className="emergency-contacts-view">
                <div className="emergency-contact-item">
                  <span className="contact-icon">🚓</span>
                  <div>
                    <strong>Police</strong>
                    <p>{emergencyNumbers.police}</p>
                  </div>
                </div>
                <div className="emergency-contact-item">
                  <span className="contact-icon">🚑</span>
                  <div>
                    <strong>Ambulance</strong>
                    <p>{emergencyNumbers.ambulance}</p>
                  </div>
                </div>
                <div className="emergency-contact-item">
                  <span className="contact-icon">🔥</span>
                  <div>
                    <strong>Fire Brigade</strong>
                    <p>{emergencyNumbers.fire}</p>
                  </div>
                </div>
                <div className="emergency-contact-item">
                  <span className="contact-icon">📱</span>
                  <div>
                    <strong>Personal Emergency Contact</strong>
                    <p>{emergencyNumbers.personal}</p>
                  </div>
                </div>
                <button className="edit-btn" onClick={() => setIsEditingEmergency(true)}>
                  ✏️ Edit Contacts
                </button>
              </div>
            ) : (
              <div className="emergency-contacts-edit">
                <div className="form-group">
                  <label>Police</label>
                  <input type="tel" value={emergencyNumbers.police}
                    onChange={(e) => setEmergencyNumbers({ ...emergencyNumbers, police: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ambulance</label>
                  <input type="tel" value={emergencyNumbers.ambulance}
                    onChange={(e) => setEmergencyNumbers({ ...emergencyNumbers, ambulance: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Fire Brigade</label>
                  <input type="tel" value={emergencyNumbers.fire}
                    onChange={(e) => setEmergencyNumbers({ ...emergencyNumbers, fire: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Personal Contact</label>
                  <input type="tel" value={emergencyNumbers.personal}
                    onChange={(e) => setEmergencyNumbers({ ...emergencyNumbers, personal: e.target.value })} />
                </div>
                <div className="button-group">
                  <button className="save-btn" onClick={handleEmergencySave}>💾 Save</button>
                  <button className="cancel-btn" onClick={() => setIsEditingEmergency(false)}>✕ Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embassy Details Modal */}
      {showEmbassyDetails && (
        <div className="modal-overlay" onClick={() => setShowEmbassyDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏛️ Embassy Details</h2>
              <button className="close-btn" onClick={() => setShowEmbassyDetails(false)}>✕</button>
            </div>
            <div className="embassy-list">
              {embassyDetails.length === 0 ? (
                <div className="no-records">
                  <p>No embassy details available. Add embassy information using the form below.</p>
                </div>
              ) : (
                embassyDetails.map((embassy, idx) => (
                  <div key={idx} className="embassy-item">
                    <span className="embassy-flag">🏛️</span>
                    <div>
                      <strong>{embassy.country || 'Embassy'}</strong>
                      <p>{embassy.address || 'Address not provided'}</p>
                      <p className="embassy-phone">📞 {embassy.phone || 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safety;


/*import React, { useEffect, useState } from "react";
import "./Safety.css";
import "./SafetyModalFix.css";

const LOCAL_KEY = "Destination Risk Rating"; // exact key you provided

const guessKey = (obj = {}, patterns = []) => {
  if (!obj || typeof obj !== "object") return null;
  const keys = Object.keys(obj);
  for (const pat of patterns) {
    const rx = new RegExp(pat, "i");
    const found = keys.find((k) => rx.test(k));
    if (found) return found;
  }
  return null;
};

const Safety = () => {
  // --- Vaccination state ---
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [vaccinationData, setVaccinationData] = useState({
    employeeId: "",
    fullName: "",
    age: "",
    dateOfBirth: "",
    vaccinationDate: "",
    notes: "",
  });
  const [vaccinationEntries, setVaccinationEntries] = useState([]);
  const [showVaccinationList, setShowVaccinationList] = useState(true);
  const [editingVaccinationIndex, setEditingVaccinationIndex] = useState(null);

  // --- Insurance state ---
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    provider: "",
    policyNumber: "",
    coverageType: "",
    startDate: "",
    endDate: "",
    helpline: "",
    emergencyName: "",
    emergencyPhone: "",
  });
  const [insuranceEntries, setInsuranceEntries] = useState([]);
  const [showInsuranceList, setShowInsuranceList] = useState(true);
  const [editingInsuranceIndex, setEditingInsuranceIndex] = useState(null);

  // --- COVID Guidelines (modal-driven) ---
  const [showCovidGuidelines, setShowCovidGuidelines] = useState(false);
  const [covidGuidelines, setCovidGuidelines] = useState([]);
  const [newGuidelineText, setNewGuidelineText] = useState("");

  // --- Emergency Contacts (modal-driven) ---
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [newEmergencyContact, setNewEmergencyContact] = useState({ name: "", phone: "" });
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [editingEmergencyIndex, setEditingEmergencyIndex] = useState(null);

  // --- Checklist (user-managed) ---
  const [checklist, setChecklist] = useState([]);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState({ item: "", required: false });

  // --- Destinations (loaded from exact localStorage key) ---
  const [riskDestinations, setRiskDestinations] = useState([]);
  const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);
  const [newDestination, setNewDestination] = useState({}); // dynamic fields (no hard-code)
  // detected keys
  const [riskKey, setRiskKey] = useState(null);
  const [nameKey, setNameKey] = useState(null);

  // --- Embassy details ---
  const [showEmbassyDetails, setShowEmbassyDetails] = useState(false);
  const [embassyDetails, setEmbassyDetails] = useState([]);
  const [showAddEmbassyModal, setShowAddEmbassyModal] = useState(false);
  const [newEmbassy, setNewEmbassy] = useState({ country: "", address: "", phone: "" });

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("vaccinationEntries") || "[]");
      setVaccinationEntries(Array.isArray(v) ? v : []);

      const ins = JSON.parse(localStorage.getItem("insuranceEntries") || "[]");
      setInsuranceEntries(Array.isArray(ins) ? ins : []);

      const cg = JSON.parse(localStorage.getItem("covidGuidelines") || "[]");
      setCovidGuidelines(Array.isArray(cg) ? cg : []);

      const ec = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
      setEmergencyContacts(Array.isArray(ec) ? ec : []);

      const cl = JSON.parse(localStorage.getItem("safetyChecklist") || "[]");
      setChecklist(Array.isArray(cl) ? cl : []);

      const emb = JSON.parse(localStorage.getItem("embassyDetails") || "[]");
      setEmbassyDetails(Array.isArray(emb) ? emb : []);
    } catch (err) {
      console.error("Error reading base state from localStorage:", err);
    }

    // Load dynamic destinations from the user-specified key
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRiskDestinations(parsed);
          // auto-detect keys using first item
          const first = parsed[0] || {};
          const suggestedRiskKey = guessKey(first, ["risk", "level", "severity", "status"]);
          const suggestedNameKey = guessKey(first, ["destination", "place", "name", "city", "location"]);
          setRiskKey(suggestedRiskKey);
          setNameKey(suggestedNameKey);
        } else {
          // if not array, don't throw — use empty
          setRiskDestinations([]);
        }
      } else {
        setRiskDestinations([]);
      }
    } catch (err) {
      console.error("Error parsing destinations from localStorage:", err);
      setRiskDestinations([]);
    }
  }, []);

  // helper: persist destinations to the same key
  const saveDestinationsToStorage = (arr) => {
    setRiskDestinations(arr);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error("Failed to save destinations:", err);
    }
  };

  // ---------- Vaccination handlers ----------
  const handleVaccinationSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingVaccinationIndex !== null) {
      updated = vaccinationEntries.map((it, idx) => (idx === editingVaccinationIndex ? { ...vaccinationData, updatedAt: new Date().toISOString() } : it));
      setEditingVaccinationIndex(null);
    } else {
      updated = [...vaccinationEntries, { ...vaccinationData, submittedAt: new Date().toISOString() }];
    }
    setVaccinationEntries(updated);
    localStorage.setItem("vaccinationEntries", JSON.stringify(updated));
    setVaccinationData({ employeeId: "", fullName: "", age: "", dateOfBirth: "", vaccinationDate: "", notes: "" });
    setShowVaccinationForm(false);
    alert("Vaccination saved.");
  };

  const handleEditVaccination = (idx) => {
    setVaccinationData({ ...vaccinationEntries[idx] });
    setEditingVaccinationIndex(idx);
    setShowVaccinationList(false);
    setShowVaccinationForm(true);
  };

  const handleDeleteVaccination = (idx) => {
    if (!window.confirm("Delete this vaccination record?")) return;
    const updated = vaccinationEntries.filter((_, i) => i !== idx);
    setVaccinationEntries(updated);
    localStorage.setItem("vaccinationEntries", JSON.stringify(updated));
    alert("Deleted.");
  };

  // ---------- Insurance handlers ----------
  const handleInsuranceSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingInsuranceIndex !== null) {
      updated = insuranceEntries.map((it, idx) => (idx === editingInsuranceIndex ? { ...insuranceData, updatedAt: new Date().toISOString() } : it));
      setEditingInsuranceIndex(null);
    } else {
      updated = [...insuranceEntries, { ...insuranceData, submittedAt: new Date().toISOString() }];
    }
    setInsuranceEntries(updated);
    localStorage.setItem("insuranceEntries", JSON.stringify(updated));
    setInsuranceData({ provider: "", policyNumber: "", coverageType: "", startDate: "", endDate: "", helpline: "", emergencyName: "", emergencyPhone: "" });
    setShowInsuranceForm(false);
    alert("Insurance saved.");
  };

  const handleEditInsurance = (idx) => {
    setInsuranceData({ ...insuranceEntries[idx] });
    setEditingInsuranceIndex(idx);
    setShowInsuranceList(false);
    setShowInsuranceForm(true);
  };

  const handleDeleteInsurance = (idx) => {
    if (!window.confirm("Delete this insurance record?")) return;
    const updated = insuranceEntries.filter((_, i) => i !== idx);
    setInsuranceEntries(updated);
    localStorage.setItem("insuranceEntries", JSON.stringify(updated));
    alert("Deleted.");
  };

  // ---------- COVID Guidelines ----------
  const handleAddGuideline = () => {
    const t = newGuidelineText.trim();
    if (!t) return alert("Enter guideline text.");
    const updated = [...covidGuidelines, { id: Date.now().toString(), text: t }];
    setCovidGuidelines(updated);
    localStorage.setItem("covidGuidelines", JSON.stringify(updated));
    setNewGuidelineText("");
  };

  const handleDeleteGuideline = (id) => {
    if (!window.confirm("Delete guideline?")) return;
    const updated = covidGuidelines.filter((g) => g.id !== id);
    setCovidGuidelines(updated);
    localStorage.setItem("covidGuidelines", JSON.stringify(updated));
  };

  // ---------- Emergency Contacts ----------
  const handleAddEmergencyContact = () => {
    const n = newEmergencyContact.name.trim();
    const p = newEmergencyContact.phone.trim();
    if (!n || !p) return alert("Provide name and phone.");
    const updated = [...emergencyContacts, { ...newEmergencyContact, id: Date.now().toString() }];
    setEmergencyContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
    setNewEmergencyContact({ name: "", phone: "" });
  };

  const handleEditEmergency = (idx) => {
    setNewEmergencyContact({ ...emergencyContacts[idx] });
    setEditingEmergencyIndex(idx);
    setIsEditingEmergency(true);
  };

  const handleSaveEditedEmergency = () => {
    if (editingEmergencyIndex === null) return;
    const updated = emergencyContacts.map((c, i) => (i === editingEmergencyIndex ? { ...newEmergencyContact } : c));
    setEmergencyContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
    setIsEditingEmergency(false);
    setEditingEmergencyIndex(null);
    setNewEmergencyContact({ name: "", phone: "" });
  };

  const handleDeleteEmergency = (idx) => {
    if (!window.confirm("Delete contact?")) return;
    const updated = emergencyContacts.filter((_, i) => i !== idx);
    setEmergencyContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
  };

  // ---------- Checklist ----------
  const handleAddChecklistItem = () => {
    const t = (newChecklistItem.item || "").trim();
    if (!t) return alert("Enter checklist item.");
    const entry = { id: Date.now().toString(), item: t, checked: false, required: !!newChecklistItem.required };
    const updated = [...checklist, entry];
    setChecklist(updated);
    localStorage.setItem("safetyChecklist", JSON.stringify(updated));
    setNewChecklistItem({ item: "", required: false });
    setShowAddChecklistModal(false);
  };

  const handleToggleChecklist = (id) => {
    const updated = checklist.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it));
    setChecklist(updated);
    localStorage.setItem("safetyChecklist", JSON.stringify(updated));
  };

  const handleDeleteChecklist = (id) => {
    if (!window.confirm("Delete checklist item?")) return;
    const updated = checklist.filter((it) => it.id !== id);
    setChecklist(updated);
    localStorage.setItem("safetyChecklist", JSON.stringify(updated));
  };

  // ---------- Destinations (dynamic / card view) ----------
  // we try to detect the fields used for name and risk
  useEffect(() => {
    if (!riskKey || !nameKey) {
      const first = riskDestinations[0] || {};
      const suggestedRiskKey = guessKey(first, ["risk", "level", "severity", "status"]);
      const suggestedNameKey = guessKey(first, ["destination", "place", "name", "city", "location"]);
      if (suggestedRiskKey) setRiskKey(suggestedRiskKey);
      if (suggestedNameKey) setNameKey(suggestedNameKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskDestinations]);

  const normalizeRiskValue = (val) => {
    if (!val && val !== 0) return "Unknown";
    const s = String(val).trim().toLowerCase();
    if (s === "low" || s === "l" || s.includes("low")) return "Low";
    if (s === "medium" || s === "med" || s === "m" || s.includes("medium")) return "Medium";
    if (s === "high" || s === "h" || s.includes("high")) return "High";
    return "Unknown";
  };

  const counts = {
    low: riskDestinations.filter((d) => normalizeRiskValue(d[riskKey]).toLowerCase() === "low").length,
    medium: riskDestinations.filter((d) => normalizeRiskValue(d[riskKey]).toLowerCase() === "medium").length,
    high: riskDestinations.filter((d) => normalizeRiskValue(d[riskKey]).toLowerCase() === "high").length,
    unknown: riskDestinations.filter((d) => {
      const r = normalizeRiskValue(d[riskKey]);
      return r !== "Low" && r !== "Medium" && r !== "High";
    }).length,
  };

  const handleAddDestination = () => {
    // Accept dynamic fields; newDestination may have any props user types in
    // Ensure at least one field exists (preferably a name)
    const testName = newDestination[nameKey] || Object.values(newDestination).find((v) => typeof v === "string" && v.trim().length > 0);
    if (!testName) return alert("Provide at least a name for the destination.");
    const entry = { ...newDestination, id: Date.now().toString(), updatedAt: new Date().toISOString() };

    // Save to storage under the exact key so both pages see same data
    const updated = [...riskDestinations, entry];
    saveDestinationsToStorage(updated);

    // Attempt to set detection keys if not set
    if (!nameKey) {
      const suggestedNameKey = guessKey(entry, ["destination", "place", "name", "city", "location"]);
      if (suggestedNameKey) setNameKey(suggestedNameKey);
    }
    if (!riskKey) {
      const suggestedRiskKey = guessKey(entry, ["risk", "level", "severity", "status"]);
      if (suggestedRiskKey) setRiskKey(suggestedRiskKey);
    }

    setNewDestination({});
    setShowAddDestinationModal(false);
  };

  const handleDeleteDestination = (id) => {
    if (!window.confirm("Delete this destination?")) return;
    const updated = riskDestinations.filter((d) => d.id !== id);
    saveDestinationsToStorage(updated);
  };

  // ---------- Embassy ----------
  const handleAddEmbassy = () => {
    const country = (newEmbassy.country || "").trim();
    if (!country) return alert("Enter country for embassy.");
    const entry = { ...newEmbassy, id: Date.now().toString() };
    const updated = [...embassyDetails, entry];
    setEmbassyDetails(updated);
    localStorage.setItem("embassyDetails", JSON.stringify(updated));
    setNewEmbassy({ country: "", address: "", phone: "" });
    setShowAddEmbassyModal(false);
  };

  const handleDeleteEmbassy = (id) => {
    if (!window.confirm("Delete embassy entry?")) return;
    const updated = embassyDetails.filter((e) => e.id !== id);
    setEmbassyDetails(updated);
    localStorage.setItem("embassyDetails", JSON.stringify(updated));
  };

  // ---------- Helpers to render dynamic card content ----------
  const renderAllFields = (obj = {}) => {
    const keys = Object.keys(obj).filter((k) => k !== "id");
    if (keys.length === 0) return null;
    return keys.map((k) => {
      const value = obj[k];
      // nicely format timestamp fields
      if (k.toLowerCase().includes("date") || k.toLowerCase().includes("time") || k.toLowerCase().includes("updated")) {
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return (
              <div className="card-row" key={k}>
                <span className="card-field">{k}:</span>
                <span className="card-value">{d.toLocaleString()}</span>
              </div>
            );
          }
        } catch {}
      }
      return (
        <div className="card-row" key={k}>
          <span className="card-field">{k}:</span>
          <span className="card-value">{String(value)}</span>
        </div>
      );
    });
  };

  / ---------- Checklist summary derived values ----------
  const completedItems = checklist.filter((i) => i.checked).length;
  const requiredItems = checklist.filter((i) => i.required);
  const completedRequired = requiredItems.filter((i) => i.checked).length;
  const completionPercentage = checklist.length === 0 ? 0 : Math.round((completedItems / checklist.length) * 100);
  const isReadyToTravel = requiredItems.length > 0 ? completedRequired === requiredItems.length : false;

  // ---------- Render ----------
  return (
    <div className="page-container">
      <h1 className="page-title">Safety Checklist</h1>

      {/* Risk Rating Section *}
      <div className="risk-rating-section">
        <h2>🌍 Destination Risk Rating</h2>

        <div className="risk-summary-cards">
          <div className="risk-summary-card low" onClick={() => alert("Low risk clicked")}>
            <div className="risk-icon">🟢</div>
            <div className="risk-info">
              <h3>Low Risk</h3>
              <p>{counts.low} destinations</p>
            </div>
          </div>

          <div className="risk-summary-card medium" onClick={() => alert("Medium risk clicked")}>
            <div className="risk-icon">🟡</div>
            <div className="risk-info">
              <h3>Medium Risk</h3>
              <p>{counts.medium} destinations</p>
            </div>
          </div>

          <div className="risk-summary-card high" onClick={() => alert("High risk clicked")}>
            <div className="risk-icon">🔴</div>
            <div className="risk-info">
              <h3>High Risk</h3>
              <p>{counts.high} destinations</p>
            </div>
          </div>

          <div className="risk-summary-card unknown" onClick={() => alert("Unknown risk clicked")}>
            <div className="risk-icon">⚪</div>
            <div className="risk-info">
              <h3>Unknown</h3>
              <p>{counts.unknown} destinations</p>
            </div>
          </div>
        </div>

        <div className="risk-destinations card-grid">
          {riskDestinations.length === 0 ? (
            <div className="no-destinations">
              <p>No destinations present. Add one to sync with the Risk module.</p>
              <button onClick={() => setShowAddDestinationModal(true)}>➕ Add Destination</button>
            </div>
          ) : (
            riskDestinations.map((d) => {
              const displayRisk = normalizeRiskValue(d[riskKey]);
              const displayName = d[nameKey] || Object.values(d).find((v) => typeof v === "string" && v.length > 0) || "Unnamed";
              return (
                <div key={d.id || JSON.stringify(d)} className={`risk-destination-item ${displayRisk.toLowerCase()}-risk card`}>
                  <div className="card-header">
                    <span className={`risk-badge ${displayRisk.toLowerCase()}`}>
                      {displayRisk === "Low" ? "🟢 Low" : displayRisk === "Medium" ? "🟡 Medium" : displayRisk === "High" ? "🔴 High" : "⚪ Unknown"}
                    </span>
                    <h4>{displayName}</h4>
                  </div>

                  <div className="card-body">{renderAllFields(d)}</div>

                  <div className="card-footer">
                    <span className="update-date">Updated: {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "N/A"}</span>
                    <div className="record-actions">
                      <button onClick={() => handleDeleteDestination(d.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions *}
      <div className="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons-grid">
          <button className="action-button vaccination" onClick={() => { setShowVaccinationForm(true); setShowVaccinationList(true); }}>
            <span className="action-icon">💉</span>
            <div className="action-text">
              <h3>Vaccination Details</h3>
              <p>Submit vaccination records</p>
            </div>
          </button>

          <button className="action-button insurance" onClick={() => { setShowInsuranceForm(true); setShowInsuranceList(true); }}>
            <span className="action-icon">🛡️</span>
            <div className="action-text">
              <h3>Insurance Verification</h3>
              <p>Submit insurance records</p>
            </div>
          </button>

          <button className="action-button covid" onClick={() => setShowCovidGuidelines(true)}>
            <span className="action-icon">😷</span>
            <div className="action-text">
              <h3>COVID Guidelines</h3>
              <p>Manage guidelines</p>
            </div>
          </button>

          <button className="action-button emergency" onClick={() => setShowEmergencyContacts(true)}>
            <span className="action-icon">📞</span>
            <div className="action-text">
              <h3>Emergency Contacts</h3>
              <p>Manage emergency numbers</p>
            </div>
          </button>

          <button className="action-button embassy" onClick={() => setShowEmbassyDetails(true)}>
            <span className="action-icon">🏛️</span>
            <div className="action-text">
              <h3>Embassy Details</h3>
              <p>Manage embassy information</p>
            </div>
          </button>
        </div>
      </div>

      <div className="safety-layout">
        <div className="checklist-section">
          <div className="progress-summary">
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-number">{completedItems}/{checklist.length}</span>
                <span className="stat-label">Items Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{completionPercentage}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
              <div className="stat">
                <span className="stat-number">{completedRequired}/{requiredItems.length}</span>
                <span className="stat-label">Required Items</span>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>

            <div className={`travel-status ${isReadyToTravel ? "ready" : "not-ready"}`}>
              {isReadyToTravel ? (
                <>
                  <span className="status-icon">✅</span>
                  <span>Ready to Travel!</span>
                </>
              ) : (
                <>
                  <span className="status-icon">⚠️</span>
                  <span>Complete required items before traveling</span>
                </>
              )}
            </div>
          </div>

          <div className="checklist-items">
            <h2>Safety Requirements</h2>
            <div className="checklist-controls">
              <button onClick={() => setShowAddChecklistModal(true)}>➕ Add Checklist Item</button>
            </div>

            {checklist.length === 0 ? (
              <p>No checklist items yet. Add items using the button above.</p>
            ) : (
              checklist.map((item) => (
                <div key={item.id} className="checklist-item">
                  <label className="checkbox-container">
                    <input type="checkbox" checked={item.checked} onChange={() => handleToggleChecklist(item.id)} />
                    <span className="checkmark" />
                    <span className={`item-text ${item.checked ? "completed" : ""}`}>
                      {item.item}
                      {item.required && <span className="required-badge">Required</span>}
                    </span>
                  </label>
                  <div className="record-actions">
                    <button onClick={() => handleDeleteChecklist(item.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="safety-info">
          <div className="info-card compliance-card">
            <h3>Compliance Requirements</h3>
            <div className="compliance-list">
              <div className="compliance-item">
                <span className="compliance-icon">📋</span>
                <div>
                  <strong>Travel Policy</strong>
                  <p>Review company travel guidelines</p>
                </div>
              </div>
              <div className="compliance-item">
                <span className="compliance-icon">💉</span>
                <div>
                  <strong>Health Requirements</strong>
                  <p>Manage vaccination & health requirements</p>
                </div>
              </div>
              <div className="compliance-item">
                <span className="compliance-icon">🛡️</span>
                <div>
                  <strong>Insurance Coverage</strong>
                  <p>Verify insurance entries</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Emergency Contacts</h3>
            <div className="contact-list">
              {emergencyContacts.length === 0 ? <p>No emergency contacts added.</p> : emergencyContacts.map((c) => (
                <div key={c.id || c.phone} className="contact-item">
                  <strong>{c.name || "Contact"}</strong>
                  <span>{c.phone}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setShowEmergencyContacts(true)}>Manage Emergency Contacts</button>
            </div>
          </div>

          <div className="info-card">
            <h3>Travel Tips</h3>
            <ul className="tips-list">
              {travelTips.length === 0 ? (
                <li>No travel tips available</li>
              ) : (
                travelTips.map((tip, idx) => <li key={idx}>{tip}</li>)
              )}
            </ul>
          </div>

          <div className="info-card">
            <h3>Health & Safety</h3>
            <ul className="tips-list">
              {healthTips.length === 0 ? (
                <li>No health tips available</li>
              ) : (
                healthTips.map((tip, idx) => <li key={idx}>{tip}</li>)
              )}
            </ul>
          </div>

          <div className="info-card action-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-button vaccination" onClick={() => { setShowVaccinationForm(true); setShowVaccinationList(true); }}>💉 Vaccination Details</button>
              <button className="action-button insurance" onClick={() => { setShowInsuranceForm(true); setShowInsuranceList(true); }}>🛡️ Insurance Verification</button>
              <button className="action-button covid" onClick={() => setShowCovidGuidelines(true)}>😷 COVID Guidelines</button>
              <button className="action-button emergency" onClick={() => setShowEmergencyContacts(true)}>📞 Emergency Contacts</button>
              <button className="action-button embassy" onClick={() => setShowEmbassyDetails(true)}>🏛️ Embassy Details</button>
            </div>
          </div>
        </div>
      </div>

      { ---------------- Vaccination Modal ---------------- *}
      {showVaccinationForm && (
        <div className="modal-overlay" onClick={() => { setShowVaccinationForm(false); setShowVaccinationList(true); setEditingVaccinationIndex(null); }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💉 Vaccination Verification</h2>
              <button className="close-btn" onClick={() => { setShowVaccinationForm(false); setShowVaccinationList(true); setEditingVaccinationIndex(null); }}>✕</button>
            </div>

            {showVaccinationList ? (
              <div className="vaccination-list-view">
                <div className="list-header">
                  <h3>Vaccination Records ({vaccinationEntries.length})</h3>
                  <button className="add-new-btn" onClick={() => { setVaccinationData({ employeeId: "", fullName: "", age: "", dateOfBirth: "", vaccinationDate: "", notes: "" }); setEditingVaccinationIndex(null); setShowVaccinationList(false); }}>
                    ➕ Add New Record
                  </button>
                </div>

                {vaccinationEntries.length === 0 ? (
                  <div className="no-records">
                    <p>No vaccination records found.</p>
                    <button className="add-first-btn" onClick={() => { setVaccinationData({ employeeId: "", fullName: "", age: "", dateOfBirth: "", vaccinationDate: "", notes: "" }); setEditingVaccinationIndex(null); setShowVaccinationList(false); }}>
                      Add Your First Record
                    </button>
                  </div>
                ) : (
                  <div className="records-list">
                    {vaccinationEntries.map((entry, index) => (
                      <div key={index} className="record-card">
                        <div className="record-header">
                          <h4>{entry.fullName || "Unnamed"}</h4>
                          <span className="record-badge">✓ Verified</span>
                        </div>
                        <div className="record-details">
                          <div className="record-row"><span className="label">Employee ID:</span><span className="value">{entry.employeeId}</span></div>
                          <div className="record-row"><span className="label">Age:</span><span className="value">{entry.age ? `${entry.age} years` : ""}</span></div>
                          <div className="record-row"><span className="label">Vaccination Date:</span><span className="value">{entry.vaccinationDate ? new Date(entry.vaccinationDate).toLocaleDateString() : ""}</span></div>
                          {entry.notes && <div className="record-row"><span className="label">Notes:</span><span className="value">{entry.notes}</span></div>}
                          <div className="record-row"><span className="label">Submitted:</span><span className="value">{entry.submittedAt ? new Date(entry.submittedAt).toLocaleString() : ""}</span></div>
                        </div>
                        <div className="record-actions">
                          <button className="edit-record-btn" onClick={() => handleEditVaccination(index)}>✏️ Edit</button>
                          <button className="delete-record-btn" onClick={() => handleDeleteVaccination(index)}>🗑️ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleVaccinationSubmit} className="safety-form">
                <button type="button" className="back-to-list-btn" onClick={() => { setShowVaccinationList(true); setEditingVaccinationIndex(null); setVaccinationData({ employeeId: "", fullName: "", age: "", dateOfBirth: "", vaccinationDate: "", notes: "" }); }}>
                  ← Back to List
                </button>

                <div className="form-row">
                  <div className="form-group"><label>Employee ID *</label><input type="text" required value={vaccinationData.employeeId} onChange={(e) => setVaccinationData({ ...vaccinationData, employeeId: e.target.value })} /></div>
                  <div className="form-group"><label>Full Name *</label><input type="text" required value={vaccinationData.fullName} onChange={(e) => setVaccinationData({ ...vaccinationData, fullName: e.target.value })} /></div>
                </div>

                <div className="form-row">
                  <div className="form-group"><label>Age *</label><input type="number" required value={vaccinationData.age} onChange={(e) => setVaccinationData({ ...vaccinationData, age: e.target.value })} /></div>
                  <div className="form-group"><label>Date of Birth</label><input type="date" value={vaccinationData.dateOfBirth} onChange={(e) => setVaccinationData({ ...vaccinationData, dateOfBirth: e.target.value })} /></div>
                </div>

                <div className="form-group"><label>Vaccination Date *</label><input type="date" required value={vaccinationData.vaccinationDate} onChange={(e) => setVaccinationData({ ...vaccinationData, vaccinationDate: e.target.value })} /></div>

                <div className="form-group"><label>Notes</label><textarea rows="3" value={vaccinationData.notes} onChange={(e) => setVaccinationData({ ...vaccinationData, notes: e.target.value })} /></div>

                <div className="form-group"><label>Vaccination Receipt (optional)</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>

                <button type="submit" className="submit-btn">{editingVaccinationIndex !== null ? "✓ Update Record" : "✓ Submit Vaccination Details"}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Insurance Modal ---------------- /}
      {showInsuranceForm && (
        <div className="modal-overlay" onClick={() => { setShowInsuranceForm(false); setShowInsuranceList(true); setEditingInsuranceIndex(null); }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛡️ Travel Insurance Verification</h2>
              <button className="close-btn" onClick={() => { setShowInsuranceForm(false); setShowInsuranceList(true); setEditingInsuranceIndex(null); }}>✕</button>
            </div>

            {showInsuranceList ? (
              <div className="vaccination-list-view">
                <div className="list-header">
                  <h3>Insurance Records ({insuranceEntries.length})</h3>
                  <button className="add-new-btn" onClick={() => { setInsuranceData({ provider: "", policyNumber: "", coverageType: "", startDate: "", endDate: "", helpline: "", emergencyName: "", emergencyPhone: "" }); setEditingInsuranceIndex(null); setShowInsuranceList(false); }}>
                    ➕ Add New Record
                  </button>
                </div>

                {insuranceEntries.length === 0 ? (
                  <div className="no-records">
                    <p>No insurance records found.</p>
                    <button className="add-first-btn" onClick={() => { setInsuranceData({ provider: "", policyNumber: "", coverageType: "", startDate: "", endDate: "", helpline: "", emergencyName: "", emergencyPhone: "" }); setEditingInsuranceIndex(null); setShowInsuranceList(false); }}>
                      Add Your First Record
                    </button>
                  </div>
                ) : (
                  <div className="records-list">
                    {insuranceEntries.map((entry, index) => (
                      <div key={index} className="record-card">
                        <div className="record-header"><h4>{entry.provider || "Provider"}</h4><span className="record-badge">✓ Active</span></div>
                        <div className="record-details">
                          <div className="record-row"><span className="label">Policy Number:</span><span className="value">{entry.policyNumber}</span></div>
                          <div className="record-row"><span className="label">Coverage:</span><span className="value">{entry.coverageType}</span></div>
                          <div className="record-row"><span className="label">Valid From:</span><span className="value">{entry.startDate ? new Date(entry.startDate).toLocaleDateString() : ""} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : ""}</span></div>
                          <div className="record-row"><span className="label">Helpline:</span><span className="value">{entry.helpline}</span></div>
                          <div className="record-row"><span className="label">Emergency Contact:</span><span className="value">{entry.emergencyName} {entry.emergencyPhone ? `(${entry.emergencyPhone})` : ""}</span></div>
                        </div>
                        <div className="record-actions">
                          <button className="edit-record-btn" onClick={() => handleEditInsurance(index)}>✏️ Edit</button>
                          <button className="delete-record-btn" onClick={() => handleDeleteInsurance(index)}>🗑️ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleInsuranceSubmit} className="safety-form">
                <button type="button" className="back-to-list-btn" onClick={() => { setShowInsuranceList(true); setEditingInsuranceIndex(null); }}>
                  ← Back to List
                </button>

                <div className="form-row">
                  <div className="form-group"><label>Insurance Provider *</label><input type="text" required value={insuranceData.provider} onChange={(e) => setInsuranceData({ ...insuranceData, provider: e.target.value })} /></div>
                  <div className="form-group"><label>Policy Number *</label><input type="text" required value={insuranceData.policyNumber} onChange={(e) => setInsuranceData({ ...insuranceData, policyNumber: e.target.value })} /></div>
                </div>

                <div className="form-group"><label>Coverage Type *</label><input type="text" required value={insuranceData.coverageType} onChange={(e) => setInsuranceData({ ...insuranceData, coverageType: e.target.value })} /></div>

                <div className="form-row">
                  <div className="form-group"><label>Coverage Start Date *</label><input type="date" required value={insuranceData.startDate} onChange={(e) => setInsuranceData({ ...insuranceData, startDate: e.target.value })} /></div>
                  <div className="form-group"><label>Coverage End Date *</label><input type="date" required value={insuranceData.endDate} onChange={(e) => setInsuranceData({ ...insuranceData, endDate: e.target.value })} /></div>
                </div>

                <div className="form-group"><label>Insurance Helpline *</label><input type="tel" required value={insuranceData.helpline} onChange={(e) => setInsuranceData({ ...insuranceData, helpline: e.target.value })} /></div>

                <div className="form-row">
                  <div className="form-group"><label>Emergency Contact Name *</label><input type="text" required value={insuranceData.emergencyName} onChange={(e) => setInsuranceData({ ...insuranceData, emergencyName: e.target.value })} /></div>
                  <div className="form-group"><label>Emergency Contact Phone *</label><input type="tel" required value={insuranceData.emergencyPhone} onChange={(e) => setInsuranceData({ ...insuranceData, emergencyPhone: e.target.value })} /></div>
                </div>

                <div className="form-group"><label>Proof Document (optional)</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>

                <button type="submit" className="submit-btn">{editingInsuranceIndex !== null ? "✓ Update Record" : "✓ Submit Insurance Details"}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- COVID Guidelines Modal ---------------- *}
      {showCovidGuidelines && (
        <div className="modal-overlay" onClick={() => setShowCovidGuidelines(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>😷 COVID-19 Health Guidelines</h2>
              <button className="close-btn" onClick={() => setShowCovidGuidelines(false)}>✕</button>
            </div>

            <div className="guidelines-content">
              <div className="guideline-add">
                <input type="text" placeholder="Enter guideline" value={newGuidelineText} onChange={(e) => setNewGuidelineText(e.target.value)} />
                <button onClick={handleAddGuideline}>➕ Add</button>
              </div>

              {covidGuidelines.length === 0 ? <p>No guidelines added yet.</p> : covidGuidelines.map((g) => (
                <div key={g.id} className="guideline-item">
                  <span className="guideline-icon">📌</span>
                  <p>{g.text}</p>
                  <div className="record-actions"><button onClick={() => handleDeleteGuideline(g.id)}>🗑️ Delete</button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Emergency Contacts Modal ---------------- *}
      {showEmergencyContacts && (
        <div className="modal-overlay" onClick={() => { setShowEmergencyContacts(false); setIsEditingEmergency(false); setEditingEmergencyIndex(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📞 Emergency Contacts</h2>
              <button className="close-btn" onClick={() => { setShowEmergencyContacts(false); setIsEditingEmergency(false); setEditingEmergencyIndex(null); }}>✕</button>
            </div>

            <div className="emergency-contacts-view">
              {emergencyContacts.length === 0 ? <div className="no-records"><p>No emergency contacts added.</p></div> : emergencyContacts.map((c, idx) => (
                <div key={c.id || idx} className="emergency-contact-item">
                  <div><strong>{c.name}</strong><p>{c.phone}</p></div>
                  <div className="record-actions"><button onClick={() => handleEditEmergency(idx)}>✏️ Edit</button><button onClick={() => handleDeleteEmergency(idx)}>🗑️ Delete</button></div>
                </div>
              ))}

              <div className="emergency-form">
                <div className="form-group"><label>Name</label><input type="text" value={newEmergencyContact.name} onChange={(e) => setNewEmergencyContact({ ...newEmergencyContact, name: e.target.value })} /></div>
                <div className="form-group"><label>Phone</label><input type="tel" value={newEmergencyContact.phone} onChange={(e) => setNewEmergencyContact({ ...newEmergencyContact, phone: e.target.value })} /></div>

                <div className="button-group">
                  {!isEditingEmergency ? <button className="save-btn" onClick={handleAddEmergencyContact}>💾 Add Contact</button> : <>
                    <button className="save-btn" onClick={handleSaveEditedEmergency}>💾 Save Edit</button>
                    <button className="cancel-btn" onClick={() => { setIsEditingEmergency(false); setEditingEmergencyIndex(null); setNewEmergencyContact({ name: "", phone: "" }); }}>✕ Cancel</button>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Add Checklist Modal ---------------- *}
      {showAddChecklistModal && (
        <div className="modal-overlay" onClick={() => setShowAddChecklistModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>➕ Add Checklist Item</h2><button className="close-btn" onClick={() => setShowAddChecklistModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Item</label><input type="text" value={newChecklistItem.item} onChange={(e) => setNewChecklistItem({ ...newChecklistItem, item: e.target.value })} /></div>
              <div className="form-group"><label><input type="checkbox" checked={newChecklistItem.required} onChange={(e) => setNewChecklistItem({ ...newChecklistItem, required: e.target.checked })} /> Required</label></div>
              <div className="button-group"><button onClick={handleAddChecklistItem}>Add</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Add Destination Modal (dynamic fields) ---------------- }
      {showAddDestinationModal && (
        <div className="modal-overlay" onClick={() => setShowAddDestinationModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>➕ Add Destination</h2><button className="close-btn" onClick={() => setShowAddDestinationModal(false)}>✕</button></div>
            <div className="modal-body">
              <p style={{ marginBottom: 8 }}>Type fields you want to save for this destination. Common fields: destination, country, riskLevel</p>
              <div className="form-group">
                <label>Field key</label>
                <input type="text" placeholder="e.g. destination, country, riskLevel, notes" onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const key = e.target.value.trim();
                    if (!key) return;
                    // add an empty field in newDestination
                    setNewDestination((prev) => ({ ...prev, [key]: "" }));
                    e.target.value = "";
                  }
                }} />
                <small>Type a key and press Enter to add a field. Add as many fields as you like.</small>
              </div>

              {/* Render dynamic inputs for keys in newDestination *}
              {Object.keys(newDestination).length === 0 && <p>No fields added yet. Add at least a name or destination key above.</p>}
              {Object.keys(newDestination).map((k) => (
                <div className="form-group" key={k}>
                  <label>{k}</label>
                  <input type="text" value={newDestination[k] || ""} onChange={(e) => setNewDestination((prev) => ({ ...prev, [k]: e.target.value }))} />
                </div>
              ))}

              <div className="button-group">
                <button onClick={handleAddDestination}>Add Destination</button>
                <button onClick={() => { setNewDestination({}); setShowAddDestinationModal(false); }} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Embassy Details Modal ---------------- *}
      {showEmbassyDetails && (
        <div className="modal-overlay" onClick={() => setShowEmbassyDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>🏛️ Embassy Details</h2><button className="close-btn" onClick={() => setShowEmbassyDetails(false)}>✕</button></div>
            <div className="embassy-list">
              {embassyDetails.length === 0 ? <p>No embassy entries added.</p> : embassyDetails.map((e) => (
                <div className="embassy-item" key={e.id}><div><strong>{e.country}</strong><p>{e.address}</p><p className="embassy-phone">📞 {e.phone}</p></div><div className="record-actions"><button onClick={() => handleDeleteEmbassy(e.id)}>🗑️ Delete</button></div></div>
              ))}
              <div style={{ marginTop: 12 }}><button onClick={() => setShowAddEmbassyModal(true)}>➕ Add Embassy</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Add Embassy Modal ---------------- *}
      {showAddEmbassyModal && (
        <div className="modal-overlay" onClick={() => setShowAddEmbassyModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>➕ Add Embassy</h2><button className="close-btn" onClick={() => setShowAddEmbassyModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Country</label><input type="text" value={newEmbassy.country} onChange={(e) => setNewEmbassy({ ...newEmbassy, country: e.target.value })} /></div>
              <div className="form-group"><label>Address</label><input type="text" value={newEmbassy.address} onChange={(e) => setNewEmbassy({ ...newEmbassy, address: e.target.value })} /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={newEmbassy.phone} onChange={(e) => setNewEmbassy({ ...newEmbassy, phone: e.target.value })} /></div>
              <div className="button-group"><button onClick={handleAddEmbassy}>Add Embassy</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safety;
  */