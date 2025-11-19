const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const {
  createTravelRequest,
  getMyTravelRequests,
  getAllTravelRequests,
  updateTravelStatus,
} = require("../controllers/travelController");

// ✅ Allow employee / user / admin / manager to create request
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["employee", "admin", "manager", "user"]),
  createTravelRequest
);

// ✅ Employee views only their travel requests
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["employee", "admin", "manager", "user"]), // also allow user
  getMyTravelRequests
);

// ✅ Admin/Manager view all travel requests
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  getAllTravelRequests
);

// ✅ Admin/Manager update travel request status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  updateTravelStatus
);

module.exports = router;
