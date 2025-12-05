// routes/kpiRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getKPIs, getAnalytics } = require("../controllers/kpiController");

// GET /api/kpi - Get KPI metrics
router.get("/", authMiddleware, getKPIs);

// GET /api/analytics - Get analytics data
router.get("/analytics", authMiddleware, getAnalytics);

module.exports = router;
