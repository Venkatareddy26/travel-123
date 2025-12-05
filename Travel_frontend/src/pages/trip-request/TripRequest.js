// TripRequest.js
import React, { useState, useEffect } from "react";
import TripRequestForm from "./TripRequestForm";
import TripRequestCard from "./TripRequestCard";
import { tripService } from "../../services/tripService";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import "./TripRequest.css";

const TripRequest = () => {
  const { token, user } = useAuth();
  const [submittedTrips, setSubmittedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // ============================
  // 🔄 Helper: Fetch trips
  // ============================
  const fetchTrips = async () => {
    if (!token) return;

    try {
      const trips = await tripService.getMyTrips();
      setSubmittedTrips(trips);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  // ============================
  // 📌 Fetch trips on mount
  // ============================
  useEffect(() => {
    fetchTrips();
    setLoadingTrips(false);
  }, [token]);

  // ============================
  // 🔥 Real-Time Socket.io Setup
  // ============================
  useEffect(() => {
    if (!token || !user) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    // Join user-specific room
    socket.emit("joinUser", user.id);

    console.log("🔗 Socket connected for TripRequest:", user.id);

    // Listen for backend updates
    socket.on("tripsUpdated", () => {
      console.log("📡 Real-time: Trips updated");
      fetchTrips();
    });

    return () => socket.disconnect();
  }, [token, user]);

  // ============================
  // 📨 Submit a new trip
  // ============================
  const handleTripSubmit = async (tripData) => {
    if (!token) return { success: false, message: "You must be logged in" };

    try {
      const newTrip = await tripService.submitTripRequest(tripData);
      setSubmittedTrips((prev) => [newTrip, ...prev]);

      return { success: true, message: "Trip request submitted successfully!" };
    } catch (error) {
      console.error("Trip submission failed:", error);

      const msg =
        error.response?.status === 403
          ? "You are not authorized to submit a trip."
          : "Failed to submit trip request. Please try again.";

      return { success: false, message: msg };
    }
  };

  // ============================
  // ❌ Cancel a trip
  // ============================
  const handleCancelTrip = async (tripId) => {
    if (!token) return;

    try {
      await tripService.cancelTripRequest(tripId);
      setSubmittedTrips((prev) =>
        prev.filter((trip) => trip.id !== tripId && trip._id !== tripId)
      );
    } catch (error) {
      console.error("Failed to cancel trip:", error);
    }
  };

  // ============================
  // ✏ Update a trip
  // ============================
  const handleUpdateTrip = async (tripId, updates) => {
    if (!token) return;

    try {
      const updatedTrip = await tripService.updateTripRequest(tripId, updates);
      setSubmittedTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId || trip._id === tripId ? updatedTrip : trip
        )
      );
    } catch (error) {
      console.error("Failed to update trip:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Trip Request</h1>

      <div className="trip-request-layout">
        <div className="form-section">
          <TripRequestForm onSubmit={handleTripSubmit} />
        </div>

        <div className="trips-section">
          <h2>Your Trip Requests</h2>

          {loadingTrips ? (
            <p>Loading your trips...</p>
          ) : submittedTrips.length === 0 ? (
            <p className="no-trips">
              No trip requests yet. Submit your first request!
            </p>
          ) : (
            <div className="trips-list">
              {submittedTrips.map((trip) => (
                <TripRequestCard
                  key={trip.id || trip._id}
                  trip={trip}
                  onCancel={() => handleCancelTrip(trip.id || trip._id)}
                  onUpdate={(updates) =>
                    handleUpdateTrip(trip.id || trip._id, updates)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripRequest;
