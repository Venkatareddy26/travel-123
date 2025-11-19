// routes/historyRoutes.js

const express = require("express");
const { getHistory, addHistory } = require("../controllers/historyController");

const router = express.Router();

router.get("/", getHistory);
router.post("/", addHistory);

module.exports = router; // ✅ CommonJS export — compatible with require()
