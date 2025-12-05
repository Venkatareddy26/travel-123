const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { Risk } = require("../modules");
const riskController = require("../controllers/riskController");

// Get all risk ratings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const risks = await Risk.findAll({
      order: [["date", "DESC"]],
    });
    
    res.status(200).json({
      success: true,
      data: risks,
    });
  } catch (error) {
    console.error("Error fetching risk data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch risk data",
    });
  }
});

// Add or update risk rating
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { country, city, level, description, date, weather } = req.body;

    if (!country || !level) {
      return res.status(400).json({
        success: false,
        message: "Country and level are required",
      });
    }

    // Check if risk already exists
    const existing = await Risk.findOne({
      where: {
        country: country,
        city: city || null,
      },
    });

    let record;
    if (existing) {
      // Update existing record
      await existing.update({
        level,
        description: description || "",
        date: date || new Date().toISOString().split("T")[0],
        weather: weather || null,
      });
      record = existing;
    } else {
      // Create new record
      record = await Risk.create({
        country,
        city: city || null,
        level,
        description: description || "",
        date: date || new Date().toISOString().split("T")[0],
        weather: weather || null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Risk data saved successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error saving risk data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save risk data",
    });
  }
});

// Delete risk rating
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Risk.destroy({
      where: { id },
    });

    if (deleted) {
      res.status(200).json({
        success: true,
        message: "Risk data deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Risk data not found",
      });
    }
  } catch (error) {
    console.error("Error deleting risk data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete risk data",
    });
  }
});

// Admin Risk Advisories endpoints
router.get("/advisories", authMiddleware, riskController.getAdvisories);
router.post("/advisories", authMiddleware, riskController.createAdvisory);
router.put("/advisories/:id", authMiddleware, riskController.updateAdvisory);
router.delete("/advisories/:id", authMiddleware, riskController.deleteAdvisory);
router.get("/travelers", authMiddleware, riskController.getTravelers);

module.exports = router;