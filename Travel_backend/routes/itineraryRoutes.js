const express = require("express");
const router = express.Router();

const {
  getItinerary,
  addScheduleItem,
  addTravelCard,
} = require("../controllers/itineraryController");

const { authMiddleware } = require("../middleware/authMiddleware");

// ==========================
// ITINERARY ROUTES
// ==========================

// ✔ Get full itinerary (trip + cards + schedule)
router.get("/:tripId", authMiddleware, getItinerary);

// ✔ Add new activity to a day
router.post("/:tripId/schedule", authMiddleware, addScheduleItem);

// ✔ Add new travel wallet card
router.post("/:tripId/card", authMiddleware, addTravelCard);

module.exports = router;
