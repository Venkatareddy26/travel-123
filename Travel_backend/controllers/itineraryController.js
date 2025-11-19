// itineraryController.js
/*const Trip = require("../modules/travel/Trip");
const TravelCard = require("../modules/travel/TravelCard");
const ScheduleItem = require("../modules/travel/ScheduleItem");

exports.getItinerary = async (req, res) => {
  try {
    const tripId = req.params.tripId;

    // 🔹 Trip Info
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // 🔹 Travel Wallet Cards
    const cards = await TravelCard.findAll({ where: { trip_id: tripId } });

    // 🔹 Day-by-day schedule
    const schedule = await ScheduleItem.findAll({
      where: { trip_id: tripId },
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    res.json({
      trip,
      cards,
      schedule,
    });

  } catch (err) {
    console.error("❌ Itinerary Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};
*/
const { Trip, TravelCard, ScheduleItem } = require("../modules");

// ==========================
// GET FULL ITINERARY DETAILS
// ==========================
exports.getItinerary = async (req, res) => {
  try {
    const tripId = req.params.tripId;

    // 1️⃣ Fetch Trip
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // 2️⃣ Travel Wallet (cards)
    const cards = await TravelCard.findAll({
      where: { tripId },
      order: [["createdAt", "ASC"]],
    });

    // 3️⃣ Day-by-Day Schedule
    const schedule = await ScheduleItem.findAll({
      where: { tripId },
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    res.json({
      success: true,
      trip,
      cards,
      schedule,
    });

  } catch (err) {
    console.error("❌ Itinerary Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};


// ==========================
// ADD NEW SCHEDULE ACTIVITY
// ==========================
exports.addScheduleItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { date, time, type, title, details, notes } = req.body;

    const newItem = await ScheduleItem.create({
      tripId,
      date,
      time,
      type,
      title,
      details,
      notes,
      status: "scheduled",
    });

    res.json({ success: true, item: newItem });

  } catch (err) {
    console.error("❌ Add Activity Error:", err);
    res.status(500).json({ error: "Failed to add schedule item" });
  }
};


// ==========================
// ADD TRAVEL CARD
// ==========================
exports.addTravelCard = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { type, number, expiry, daysUntilExpiry, status } = req.body;

    const newCard = await TravelCard.create({
      tripId,
      type,
      number,
      expiry,
      daysUntilExpiry,
      status,
    });

    res.json({ success: true, card: newCard });

  } catch (err) {
    console.error("❌ Add Travel Card Error:", err);
    res.status(500).json({ error: "Failed to add travel card" });
  }
};
