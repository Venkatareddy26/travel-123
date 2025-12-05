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

      // 🔥 FIX — return ACTUAL TRIP object
      return response.data?.trip || response.data;

    } catch (err) {
      console.error("🚫 Trip submission failed:", err.response?.data || err);
      throw err;
    }
  },   //  <-- YOU MISSED THIS COMMA EARLIER!

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

      return response.data?.trip || response.data;

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
