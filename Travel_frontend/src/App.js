/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import TripRequest from './pages/trip-request/TripRequest';
import Itinerary from './pages/itinerary/Itinerary';
import Safety from './pages/safety/Safety';
import Alerts from './pages/alerts/Alerts';
import Expenses from './pages/expenses/Expenses';
import ESGTracking from './pages/esg-tracking/ESGTracking';
import TripHistory from './pages/trip-history/TripHistory';
import TravelInsuranceVerification from './pages/travel-insurance/TravelInsuranceVerification';
import CovidHealthGuidelines from './pages/covid-guidelines/CovidHealthGuidelines';
import EmergencyContacts from './pages/emergency-contacts/EmergencyContacts';
import EmbassyDetails from './pages/embassy-details/EmbassyDetails';
import SafetyCompliance from './pages/safety-compliance/SafetyCompliance';
import RiskRatingDetails from './pages/risk-rating/RiskRatingDetails';
import DocumentManagement from './pages/document-management/DocumentManagement';
import './App.css';

// ------------------- Protected Route Component -------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ------------------- App Component -------------------
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route }
          <Route path="/login" element={<Login />} />

          {/* Protected Routes }
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/trip-request" element={<TripRequest />} />
                    <Route path="/itinerary" element={<Itinerary />} />
                    <Route path="/safety" element={<Safety />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/esg-tracking" element={<ESGTracking />} />
                    <Route path="/trip-history" element={<TripHistory />} />
                    <Route path="/employee/travel-insurance-verification" element={<TravelInsuranceVerification />} />
                    <Route path="/employee/covid-health-guidelines" element={<CovidHealthGuidelines />} />
                    <Route path="/employee/emergency-contacts" element={<EmergencyContacts />} />
                    <Route path="/employee/embassy-details" element={<EmbassyDetails />} />
                    <Route path="/employee/safety-check" element={<Safety />} />
                    <Route path="/employee/dashboard" element={<Dashboard />} />
                    <Route path="/employee/safety-compliance" element={<SafetyCompliance />} />
                    <Route path="/risk-rating-details" element={<RiskRatingDetails />} />
                    <Route path="/employee/safety-compliance/risk-details" element={<RiskRatingDetails />} />
                    <Route path="/employee/safety-compliance/manage-contacts" element={<EmergencyContacts />} />
                    <Route path="/employee/document-management" element={<DocumentManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import TripRequest from './pages/trip-request/TripRequest';
import Itinerary from './pages/itinerary/Itinerary';
import Safety from './pages/safety/Safety';
import Alerts from './pages/alerts/Alerts';
import Expenses from './pages/expenses/Expenses';
import ESGTracking from './pages/esg-tracking/ESGTracking';
import TripHistory from './pages/trip-history/TripHistory';
import TravelInsuranceVerification from './pages/travel-insurance/TravelInsuranceVerification';
import CovidHealthGuidelines from './pages/covid-guidelines/CovidHealthGuidelines';
import EmergencyContacts from './pages/emergency-contacts/EmergencyContacts';
import EmbassyDetails from './pages/embassy-details/EmbassyDetails';
import SafetyCompliance from './pages/safety-compliance/SafetyCompliance';
import RiskRatingDetails from './pages/risk-rating/RiskRatingDetails';
import DocumentManagement from './pages/document-management/DocumentManagement';
import './App.css';

// ------------------- Protected Route Component -------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ------------------- App Component -------------------
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip-request"
            element={
              <ProtectedRoute>
                <Layout>
                  <TripRequest />
                </Layout>
              </ProtectedRoute>
            }
          />
         <Route
  path="/itinerary"
  element={
    <ProtectedRoute>
      <Layout>
        <Itinerary />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/itinerary/:tripId"
  element={
    <ProtectedRoute>
      <Layout>
        <Itinerary />
      </Layout>
    </ProtectedRoute>
  }
/>




          <Route
            path="/safety"
            element={
              <ProtectedRoute>
                <Layout>
                  <Safety />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Alerts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/esg-tracking"
            element={
              <ProtectedRoute>
                <Layout>
                  <ESGTracking />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <TripHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/travel-insurance-verification"
            element={
              <ProtectedRoute>
                <Layout>
                  <TravelInsuranceVerification />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/covid-health-guidelines"
            element={
              <ProtectedRoute>
                <Layout>
                  <CovidHealthGuidelines />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/emergency-contacts"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmergencyContacts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/embassy-details"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmbassyDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
 
  path="/employee/safety-compliance"
  element={
    <ProtectedRoute>
      <Layout>
        <SafetyCompliance />
      </Layout>
    </ProtectedRoute>
  }
/>

         <Route
  path="/employee/risk-rating-details"
  element={
    <ProtectedRoute>
      <Layout>
        <RiskRatingDetails />
      </Layout>
    </ProtectedRoute>
  }
/>

          <Route
            path="/employee/safety-compliance/manage-contacts"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmergencyContacts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/document-management"
            element={
              <ProtectedRoute>
                <Layout>
                  <DocumentManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;     