const express = require("express");
const router = express.Router();
const Alert = require("../modules/safety/alert.model");

// Get all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.findAll({ order: [["createdAt", "DESC"]] });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add new alert
router.post("/", async (req, res) => {
  try {
    const { travelId, alertType, message } = req.body;
    const alert = await Alert.create({ travelId, alertType, message });
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Mark alert as read
router.patch("/read/:id", async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    alert.notified = true;
    await alert.save();
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete alert
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Alert.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Alert not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Mark all as read
router.patch("/read-all", async (req, res) => {
  try {
    await Alert.update({ notified: true }, { where: {} });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
