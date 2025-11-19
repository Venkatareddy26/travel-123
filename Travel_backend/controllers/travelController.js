//const { Trip } = require("../modules");
//const jwt = require("jsonwebtoken");
//const { Trip } = require("../../modules");   // ✅ FIXED PATH
const { Trip } = require("../modules");
const jwt = require("jsonwebtoken");

// ✅ Create a new travel request
const createTravelRequest = async (req, res) => {
  try {
    console.log("📩 Received trip data:", req.body);
    console.log("👤 Authenticated user:", req.user);

    const { destination, purpose, startDate, endDate, budget, urgency, accommodation } = req.body;

    if (!destination || !purpose || !startDate || !endDate) {
      console.warn("⚠️ Missing required fields:", { destination, purpose, startDate, endDate });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user?.id;
    const employeeName = req.user?.name || "Unknown Employee";

    if (!userId) {
      console.warn("⚠️ Missing userId from token");
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const newTrip = await Trip.create({
      userId,
      employeeName,
      destination,
      purpose,
      startDate,
      endDate,
      budget,
      urgency,
      accommodation,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Trip request submitted successfully",
      trip: newTrip,
    });
  } catch (error) {
    console.error("❌ Error creating travel request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Fetch all trips of the logged-in user
const getMyTravelRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const trips = await Trip.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    const formattedTrips = trips.map((trip) => {
      const t = trip.toJSON();
      return {
        id: t.id,
        employeeName: t.employeeName || "Unknown Employee",
        destination: t.destination || "Unknown Destination",
        purpose: t.purpose || "No purpose specified",
        startDate: t.startDate || null,
        endDate: t.endDate || null,
        budget: t.budget ?? 0,
        urgency: t.urgency || "N/A",
        accommodation: t.accommodation || "N/A",
        status: t.status || "unknown",
        submittedDate: t.submittedDate || t.createdAt || null,
        Policy: t.Policy || { name: "N/A" },
        emergencyContact: t.emergencyContact || "N/A",
      };
    });

    res.status(200).json(formattedTrips);
  } catch (error) {
    console.error("❌ Error fetching user trips:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Admin: Fetch all travel requests
const getAllTravelRequests = async (req, res) => {
  try {
    const trips = await Trip.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(trips);
  } catch (error) {
    console.error("❌ Error fetching all travel requests:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Admin: Update status (Approve / Reject)
const updateTravelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.status = status;
    await trip.save();

    res.status(200).json({ message: "Trip status updated successfully", trip });
  } catch (error) {
    console.error("❌ Error updating travel status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createTravelRequest,
  getMyTravelRequests,
  getAllTravelRequests,
  updateTravelStatus,
};
