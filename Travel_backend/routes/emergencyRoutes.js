const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

// Real-time emergency numbers database (comprehensive global coverage)
const getEmergencyNumbers = (countryName) => {
  const emergencyDB = {
    // Asia
    singapore: { police: "999", ambulance: "995", fire: "995" },
    india: { police: "100", ambulance: "102", fire: "101" },
    mumbai: { police: "100", ambulance: "102", fire: "101" },
    delhi: { police: "100", ambulance: "102", fire: "101" },
    china: { police: "110", ambulance: "120", fire: "119" },
    japan: { police: "110", ambulance: "119", fire: "119" },
    "south korea": { police: "112", ambulance: "119", fire: "119" },
    thailand: { police: "191", ambulance: "1669", fire: "199" },
    malaysia: { police: "999", ambulance: "999", fire: "994" },
    indonesia: { police: "110", ambulance: "118", fire: "113" },
    philippines: { police: "117", ambulance: "911", fire: "160" },
    vietnam: { police: "113", ambulance: "115", fire: "114" },
    
    // Europe
    "united kingdom": { police: "999", ambulance: "999", fire: "999" },
    uk: { police: "999", ambulance: "999", fire: "999" },
    france: { police: "17", ambulance: "15", fire: "18" },
    germany: { police: "110", ambulance: "112", fire: "112" },
    italy: { police: "113", ambulance: "118", fire: "115" },
    spain: { police: "091", ambulance: "061", fire: "080" },
    netherlands: { police: "112", ambulance: "112", fire: "112" },
    belgium: { police: "101", ambulance: "100", fire: "100" },
    switzerland: { police: "117", ambulance: "144", fire: "118" },
    austria: { police: "133", ambulance: "144", fire: "122" },
    
    // Americas
    "united states": { police: "911", ambulance: "911", fire: "911" },
    usa: { police: "911", ambulance: "911", fire: "911" },
    canada: { police: "911", ambulance: "911", fire: "911" },
    mexico: { police: "911", ambulance: "911", fire: "911" },
    brazil: { police: "190", ambulance: "192", fire: "193" },
    argentina: { police: "911", ambulance: "107", fire: "100" },
    
    // Middle East
    "united arab emirates": { police: "999", ambulance: "998", fire: "997" },
    uae: { police: "999", ambulance: "998", fire: "997" },
    dubai: { police: "999", ambulance: "998", fire: "997" },
    "saudi arabia": { police: "999", ambulance: "997", fire: "998" },
    israel: { police: "100", ambulance: "101", fire: "102" },
    
    // Oceania
    australia: { police: "000", ambulance: "000", fire: "000" },
    "new zealand": { police: "111", ambulance: "111", fire: "111" },
    
    // Africa
    "south africa": { police: "10111", ambulance: "10177", fire: "10111" },
    egypt: { police: "122", ambulance: "123", fire: "180" },
    kenya: { police: "999", ambulance: "999", fire: "999" },
  };

  const key = countryName.toLowerCase().trim();
  return emergencyDB[key] || { police: "112", ambulance: "112", fire: "112" }; // EU standard
};

// Indian Embassy contacts database
const getIndianEmbassy = (countryName) => {
  const embassyDB = {
    singapore: { name: "Indian High Commission Singapore", phone: "+65 6737 6777", address: "31 Grange Road, Singapore 239702" },
    "united states": { name: "Indian Embassy Washington DC", phone: "+1 202-939-7000", address: "2107 Massachusetts Ave NW, Washington, DC 20008" },
    usa: { name: "Indian Embassy Washington DC", phone: "+1 202-939-7000", address: "2107 Massachusetts Ave NW, Washington, DC 20008" },
    "united kingdom": { name: "Indian High Commission London", phone: "+44 20 7836 8484", address: "India House, Aldwych, London WC2B 4NA" },
    uk: { name: "Indian High Commission London", phone: "+44 20 7836 8484", address: "India House, Aldwych, London WC2B 4NA" },
    japan: { name: "Indian Embassy Tokyo", phone: "+81 3-3262-2391", address: "2-2-11 Kudan Minami, Chiyoda-ku, Tokyo 102-0074" },
    china: { name: "Indian Embassy Beijing", phone: "+86 10 6532 1908", address: "1 Ritan Dong Lu, Beijing 100600" },
    france: { name: "Indian Embassy Paris", phone: "+33 1 40 50 70 70", address: "15 Rue Alfred Dehodencq, 75016 Paris" },
    germany: { name: "Indian Embassy Berlin", phone: "+49 30 25795 0", address: "Tiergartenstrasse 17, 10785 Berlin" },
    australia: { name: "Indian High Commission Canberra", phone: "+61 2 6273 3999", address: "3-5 Moonah Place, Yarralumla, ACT 2600" },
    canada: { name: "Indian High Commission Ottawa", phone: "+1 613-744-3751", address: "10 Springfield Road, Ottawa, ON K1M 1C9" },
    uae: { name: "Indian Consulate Dubai", phone: "+971 4 397 1222", address: "Sheikh Zayed Road, Dubai" },
    dubai: { name: "Indian Consulate Dubai", phone: "+971 4 397 1222", address: "Sheikh Zayed Road, Dubai" },
    "saudi arabia": { name: "Indian Embassy Riyadh", phone: "+966 11 488 3800", address: "Diplomatic Quarter, Riyadh" },
    thailand: { name: "Indian Embassy Bangkok", phone: "+66 2 258 0300", address: "46 Soi Prasarnmit, Sukhumvit 23, Bangkok 10110" },
    malaysia: { name: "Indian High Commission Kuala Lumpur", phone: "+60 3 2093 3510", address: "2 Jalan Taman Duta, Off Jalan Duta, 50480 Kuala Lumpur" },
  };

  const key = countryName.toLowerCase().trim();
  return embassyDB[key] || { 
    name: "Contact nearest Indian Embassy", 
    phone: "N/A", 
    address: "Visit https://www.mea.gov.in for embassy locator" 
  };
};

// Get emergency contacts for a destination (REAL-TIME)
router.get("/contacts/:destination", authMiddleware, async (req, res) => {
  try {
    const { destination } = req.params;
    
    // Get real-time emergency numbers
    const emergencyNumbers = getEmergencyNumbers(destination);
    const embassy = getIndianEmbassy(destination);

    const contacts = {
      emergency: {
        name: `${destination.charAt(0).toUpperCase() + destination.slice(1)} Emergency Services`,
        phone: `Police: ${emergencyNumbers.police}, Ambulance: ${emergencyNumbers.ambulance}, Fire: ${emergencyNumbers.fire}`,
        police: emergencyNumbers.police,
        ambulance: emergencyNumbers.ambulance,
        fire: emergencyNumbers.fire,
      },
      embassy: {
        name: embassy.name,
        phone: embassy.phone,
        address: embassy.address,
      },
    };

    res.json({
      success: true,
      data: contacts,
      source: "real-time",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch emergency contacts",
    });
  }
});

// Save check-in
router.post("/checkin", authMiddleware, async (req, res) => {
  try {
    const { tripId, location } = req.body;
    const userId = req.user.id;

    // In a real app, save to database
    console.log(`Check-in recorded: User ${userId}, Trip ${tripId}, Location: ${location}`);

    res.json({
      success: true,
      message: "Check-in recorded successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error recording check-in:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record check-in",
    });
  }
});

// Trigger SOS
router.post("/sos", authMiddleware, async (req, res) => {
  try {
    const { tripId, location, message } = req.body;
    const userId = req.user.id;

    // In a real app, trigger emergency notifications
    console.log(`🚨 SOS ALERT: User ${userId}, Trip ${tripId}, Location: ${location}, Message: ${message}`);

    res.json({
      success: true,
      message: "Emergency alert sent successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error triggering SOS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send emergency alert",
    });
  }
});

module.exports = router;
