import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SafetyCompliance.css';

const SafetyCompliance = () => {
  const navigate = useNavigate();

  // State for fetched data (even if not yet used)
  const [riskGuidelines, setRiskGuidelines] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [travelInsurances, setTravelInsurances] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [guidelinesRes, contactsRes, insuranceRes, documentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/safety/alerts'),
        axios.get('http://localhost:5000/api/safety/checkin'),
        axios.get('http://localhost:5000/api/safety/sos'),
        axios.get('http://localhost:5000/api/documents/1'),
      ]);

      setRiskGuidelines(guidelinesRes.data || []);
      setEmergencyContacts(contactsRes.data || []);
      setTravelInsurances(insuranceRes.data || []);
      setDocuments(Array.isArray(documentsRes.data) ? documentsRes.data : []);

      // ✅ Store data in localStorage for Safety.js
      const complianceData = {
        riskGuidelines: guidelinesRes.data || [],
        emergencyContacts: contactsRes.data || [],
        travelInsurances: insuranceRes.data || [],
        documents: Array.isArray(documentsRes.data) ? documentsRes.data : [],
      };
      localStorage.setItem("SafetyComplianceData", JSON.stringify(complianceData));

    } catch (err) {
      console.error('Error fetching KPI data:', err);
    }
  };
  fetchData();
}, []);


  return (
    <div className="page-container">
      <h1 className="page-title">Safety & Compliance</h1>
      <p className="page-subtitle">Manage safety and compliance aspects of corporate travel</p>

      <div className="safety-cards-grid">
        {/* Risk Rating System */}
        <div className="safety-card risk-card">
          <div className="safety-card-icon">📊</div>
          <h2>Risk Rating System</h2>
          <button className="btn-primary" onClick={() => navigate('/risk-rating-details')}>
            View Details
          </button>
        </div>

        {/* Emergency Support */}
        <div className="safety-card emergency-card">
          <div className="safety-card-icon">🆘</div>
          <h2>Emergency Support</h2>
          <button className="btn-primary" onClick={() => navigate('/employee/emergency-contacts')}>
            Manage Contacts
          </button>
        </div>

        {/* Travel Insurance Verification */}
        <div className="safety-card insurance-card">
          <div className="safety-card-icon">🛡️</div>
          <h2>Travel Insurance</h2>
          <button className="btn-primary" onClick={() => navigate('/employee/travel-insurance-verification')}>
            View Insurance
          </button>
        </div>

        {/* Document Management */}
        <div className="safety-card document-card">
          <div className="safety-card-icon">📄</div>
          <h2>Document Management</h2>
          <button className="btn-primary" onClick={() => navigate('/employee/document-management')}>
            Manage Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyCompliance;
