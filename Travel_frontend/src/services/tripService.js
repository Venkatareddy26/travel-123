// Mock API service for trip requests
/*export const tripService = {
  async submitTripRequest(tripData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    
    // Simulate occasional API errors (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
    
    return newTrip;
  },

  async getTripRequests(userId) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock trip requests data
    return [
      {
        id: '1',
        destination: 'New York, NY',
        startDate: '2024-03-15',
        endDate: '2024-03-18',
        purpose: 'Client meeting and conference',
        status: 'approved',
        submittedDate: '2024-03-01'
      },
      {
        id: '2',
        destination: 'San Francisco, CA',
        startDate: '2024-04-10',
        endDate: '2024-04-12',
        purpose: 'Team workshop',
        status: 'pending',
        submittedDate: '2024-03-05'
      }
    ];
  },

  async updateTripRequest(tripId, updates) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful update
    return {
      id: tripId,
      ...updates,
      updatedDate: new Date().toISOString().split('T')[0]
    };
  },

  async cancelTripRequest(tripId) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock successful cancellation
    return {
      success: true,
      message: 'Trip request cancelled successfully'
    };
  }
};*/

/*import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/travel";

export const tripService = {
  async submitTripRequest(tripData) {
    try {
      const token = localStorage.getItem("token"); // ✅ get JWT from login

      const response = await axios.post(API_BASE_URL, tripData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ required for authMiddleware
        },
        withCredentials: true, // ✅ allow cookies if backend needs them
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting trip request:", error.response || error);
      throw error.response?.data || error;
    }
  },*/
  // Travel_frontend/src/services/tripService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/travel";

// ✅ Helper to get token from localStorage (supports both token/sessionToken)
const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("sessionToken");

  if (!token) {
    console.error("❌ No auth token found in localStorage");
    throw new Error("User not logged in");
  }

  return { Authorization: `Bearer ${token}` };
};

export const tripService = {
  // ✅ Submit trip request
  submitTripRequest: async (tripData) => {
    try {
      const response = await axios.post(API_BASE_URL, tripData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      console.error("🚫 Trip submission failed:", err.response?.data || err);
      throw err;
    }
  },

  // ✅ Get logged-in user's trips
  getMyTrips: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/my`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      console.error("🚫 Fetching trips failed:", err.response?.data || err);
      throw err;
    }
  },

  // ✅ Cancel a trip request
  cancelTripRequest: async (tripId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${tripId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      console.error("🚫 Cancel trip failed:", err.response?.data || err);
      throw err;
    }
  },

  // ✅ Update an existing trip request
  updateTripRequest: async (tripId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${tripId}`, updates, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      console.error("🚫 Update trip failed:", err.response?.data || err);
      throw err;
    }
  },
};
