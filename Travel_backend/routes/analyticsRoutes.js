// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/kpiController");

// GET /api/analytics - Get analytics data
router.get("/", authMiddleware, getAnalytics);

module.exports = router;
