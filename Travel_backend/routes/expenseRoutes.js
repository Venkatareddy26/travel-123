// routes/expenseRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getExpenses,
  createExpense,
  updateExpenseStatus,
} = require("../controllers/expenseController");

const { authMiddleware } = require("../middleware/authMiddleware");  // ⭐ ADDED

const router = express.Router();

// Upload folder
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ============================
// ROUTES
// ============================

// ⭐ Protect GET
router.get("/", authMiddleware, getExpenses);

// ⭐ authMiddleware MUST come BEFORE multer
router.post(
  "/",
  authMiddleware,            // 🔥 REQUIRED FIRST
  upload.single("receipt"),  // 🔥 THEN file upload
  createExpense              // 🔥 THEN controller
);

// ⭐ Protect PUT
router.put("/:id/status", authMiddleware, updateExpenseStatus);

module.exports = router;

