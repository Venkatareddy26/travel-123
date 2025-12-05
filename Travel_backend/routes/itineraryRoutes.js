const express = require("express");
const router = express.Router();
const { Trip } = require("../modules");
const { authMiddleware } = require("../middleware/authMiddleware");

// Helper function to calculate duration
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

// Helper function to get location icon
const getCountryIcon = (destination) => {
  // Return location pin for all destinations
  return '📍';
};

// Real-time emergency numbers database
const getEmergencyNumbers = (countryName) => {
  const emergencyDB = {
    singapore: { police: "999", ambulance: "995", fire: "995" },
    india: { police: "100", ambulance: "102", fire: "101" },
    mumbai: { police: "100", ambulance: "102", fire: "101" },
    delhi: { police: "100", ambulance: "102", fire: "101" },
    china: { police: "110", ambulance: "120", fire: "119" },
    japan: { police: "110", ambulance: "119", fire: "119" },
    "united states": { police: "911", ambulance: "911", fire: "911" },
    usa: { police: "911", ambulance: "911", fire: "911" },
    "united kingdom": { police: "999", ambulance: "999", fire: "999" },
    uk: { police: "999", ambulance: "999", fire: "999" },
    france: { police: "17", ambulance: "15", fire: "18" },
    germany: { police: "110", ambulance: "112", fire: "112" },
    australia: { police: "000", ambulance: "000", fire: "000" },
    canada: { police: "911", ambulance: "911", fire: "911" },
    uae: { police: "999", ambulance: "998", fire: "997" },
    dubai: { police: "999", ambulance: "998", fire: "997" },
  };
  const key = countryName.toLowerCase().trim();
  return emergencyDB[key] || { police: "112", ambulance: "112", fire: "112" };
};

// Indian Embassy contacts
const getIndianEmbassy = (countryName) => {
  const embassyDB = {
    singapore: { name: "Indian High Commission Singapore", phone: "+65 6737 6777" },
    usa: { name: "Indian Embassy Washington DC", phone: "+1 202-939-7000" },
    "united states": { name: "Indian Embassy Washington DC", phone: "+1 202-939-7000" },
    uk: { name: "Indian High Commission London", phone: "+44 20 7836 8484" },
    "united kingdom": { name: "Indian High Commission London", phone: "+44 20 7836 8484" },
    japan: { name: "Indian Embassy Tokyo", phone: "+81 3-3262-2391" },
    china: { name: "Indian Embassy Beijing", phone: "+86 10 6532 1908" },
    france: { name: "Indian Embassy Paris", phone: "+33 1 40 50 70 70" },
    germany: { name: "Indian Embassy Berlin", phone: "+49 30 25795 0" },
    australia: { name: "Indian High Commission Canberra", phone: "+61 2 6273 3999" },
    canada: { name: "Indian High Commission Ottawa", phone: "+1 613-744-3751" },
    uae: { name: "Indian Consulate Dubai", phone: "+971 4 397 1222" },
    dubai: { name: "Indian Consulate Dubai", phone: "+971 4 397 1222" },
  };
  const key = countryName.toLowerCase().trim();
  return embassyDB[key] || { name: "Contact nearest Indian Embassy", phone: "N/A" };
};

// Helper function to get emergency contacts (REAL-TIME)
const getEmergencyContacts = (destination) => {
  const emergencyNumbers = getEmergencyNumbers(destination);
  const embassy = getIndianEmbassy(destination);

  return {
    emergency: {
      name: `${destination.charAt(0).toUpperCase() + destination.slice(1)} Emergency Services`,
      phone: `Police: ${emergencyNumbers.police} | Ambulance: ${emergencyNumbers.ambulance} | Fire: ${emergencyNumbers.fire}`,
    },
    embassy: {
      name: embassy.name,
      phone: embassy.phone,
    },
  };
};

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const trip = await Trip.findOne({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: "Trip not found" 
      });
    }

    const durationDays = calculateDuration(trip.startDate, trip.endDate);
    const emergencyData = getEmergencyContacts(trip.destination);

    res.json({
      id: trip.id,
      title: `${trip.purpose} – ${trip.destination}`,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      durationDays,

      destination: {
        flag: getCountryIcon(trip.destination),
        city: trip.destination,
        country: trip.destination,
      },

      purpose: trip.purpose,
      risk: trip.urgency === "urgent" || trip.urgency === "high" ? "High" : trip.urgency === "medium" ? "Medium" : "Low",

      documents: {
        passport: {
          status: "Not Available",
          expires: "N/A",
        },
        insurance: {
          provider: "Not Available",
          policy: "N/A",
        },
      },

      approver: {
        name: trip.employeeName || "Not Assigned",
      },

      emergency: emergencyData.emergency,
      embassy: emergencyData.embassy,

      travelCards: [],
      scheduleItems: generateScheduleItems(trip.startDate, trip.endDate, trip.destination),
    });

  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching itinerary" 
    });
  }
});

const generateScheduleItems = (startDate, endDate, destination) => {
  if (!startDate || !endDate) return [];

  const scheduleItems = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let currentDate = new Date(start);
  let itemId = 1;

  scheduleItems.push({
    id: String(itemId++),
    date: currentDate.toISOString().split('T')[0],
    time: '09:00 AM',
    type: 'flight',
    title: `Departure to ${destination}`,
    details: 'Flight details to be confirmed',
    status: 'scheduled',
  });

  scheduleItems.push({
    id: String(itemId++),
    date: currentDate.toISOString().split('T')[0],
    time: '03:00 PM',
    type: 'hotel',
    title: 'Hotel Check-in',
    details: `Accommodation in ${destination}`,
    status: 'scheduled',
  });

  currentDate.setDate(currentDate.getDate() + 1);
  while (currentDate < end) {
    scheduleItems.push({
      id: String(itemId++),
      date: currentDate.toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'meeting',
      title: 'Business Meeting',
      details: 'Meeting details to be added',
      status: 'scheduled',
    });

    scheduleItems.push({
      id: String(itemId++),
      date: currentDate.toISOString().split('T')[0],
      time: '02:00 PM',
      type: 'meeting',
      title: 'Follow-up Discussion',
      details: 'Discussion details to be added',
      status: 'scheduled',
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  scheduleItems.push({
    id: String(itemId++),
    date: end.toISOString().split('T')[0],
    time: '11:00 AM',
    type: 'hotel',
    title: 'Hotel Check-out',
    details: 'Check-out and prepare for departure',
    status: 'scheduled',
  });

  scheduleItems.push({
    id: String(itemId++),
    date: end.toISOString().split('T')[0],
    time: '05:00 PM',
    type: 'flight',
    title: 'Return Flight',
    details: 'Flight back home',
    status: 'scheduled',
  });

  return scheduleItems;
};

module.exports = router;
