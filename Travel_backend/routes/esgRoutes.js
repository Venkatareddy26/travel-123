// Travel_backend/routes/esgRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getExpenses,
  createExpense,
  updateExpenseStatus,
} = require("../controllers/expenseController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Ensure /uploads exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// =======================
// Routes
// =======================

// Get user's expenses
router.get("/", authMiddleware, getExpenses);

// Upload new expense
router.post("/", authMiddleware, upload.single("receipt"), createExpense);

// Update status
router.put("/:id/status", authMiddleware, updateExpenseStatus);

module.exports = router;
