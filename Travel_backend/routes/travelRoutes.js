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

// ✅ Admin Portal Compatible: PATCH for status update
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  updateTravelStatus
);

// ✅ Admin Portal Compatible: DELETE trip
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  async (req, res) => {
    try {
      const { Trip } = require("../modules");
      const { id } = req.params;
      await Trip.destroy({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
