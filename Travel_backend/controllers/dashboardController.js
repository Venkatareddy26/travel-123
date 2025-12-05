// controllers/dashboardController.js

const { Trip, Expense, Alert, ESGRecord } = require("../modules");
const { Op } = require("sequelize");

// =========================
// 🔧 Helper: Average ESG Score
// =========================
async function getESGScore(userId) {
  const records = await ESGRecord.findAll({ where: { userId } });
  if (!records.length) return 0;

  const total = records.reduce((sum, rec) => sum + (rec.score || 0), 0);
  return Math.round(total / records.length);
}

// =========================
// 🔧 Helper: CO₂ This Month
// =========================
async function getCO2ThisMonth(userId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const trips = await Trip.findAll({
    where: {
      userId,
      createdAt: { [Op.gte]: startOfMonth },
    },
  });

  return trips.reduce((sum, t) => sum + (t.co2 || 0), 0);
}

// =========================
// 🔧 Helper: Total Budget Used
// =========================
async function getBudgetUsed(userId) {
  const expenses = await Expense.findAll({ where: { userId } });
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

// =========================
// 🔧 Helper: Recent User Activity
// =========================
async function getRecentActivity(userId) {
  const trips = await Trip.findAll({
    where: { userId },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  const expenses = await Expense.findAll({
    where: { userId },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  const activities = [
    ...trips.map((t) => ({
      action: `Trip to ${t.destination}`,
      date: t.updatedAt,
      status: t.status || "Pending",
    })),
    ...expenses.map((e) => ({
      action: `Expense: ${e.description || "record"}`,
      date: e.updatedAt,
      status: e.status || "pending",
    })),
  ];

  // Sort newest first
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return activities.slice(0, 5);
}

// ===============================
// 🎯 Controller: Dashboard Data
// ===============================
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("📊 Dashboard refreshed for user:", userId);

    // MAIN COUNTS (FIXED STATUS FILTER)
    const activeTrips = await Trip.count({
      where: {
        userId,
        status: {
          [Op.in]: [
            "Pending", "pending",
            "Approved", "approved",
            "Active", "active"
          ]
        }
      },
    });

    const pendingExpenses =
      (await Expense.sum("amount", {
        where: { userId, status: "pending" },
      })) || 0;

    const alerts = await Alert.count({
      where: { userId, seen: false },
    });

    // ADVANCED METRICS
    const esgScore = await getESGScore(userId);
    const co2ThisMonth = await getCO2ThisMonth(userId);
    const budgetUsed = await getBudgetUsed(userId);
    const recentActivity = await getRecentActivity(userId);

    // QUICK ACTIONS
    const quickActions = [
      { title: "New Trip Request", path: "/trip-request", icon: "✈️", color: "#3498db" },
      { title: "View Itinerary", path: "/itinerary", icon: "📋", color: "#27ae60" },
      { title: "Safety Checklist", path: "/safety", icon: "✅", color: "#f39c12" },
      { title: "Upload Expenses", path: "/expenses", icon: "💰", color: "#9b59b6" },
      { title: "ESG Tracking", path: "/esg-tracking", icon: "🌱", color: "#10b981" },
      { title: "Trip History", path: "/trip-history", icon: "📊", color: "#8b5cf6" },
    ];

    // FINAL RESPONSE
    res.status(200).json({
      success: true,
      message: "Dashboard data loaded successfully",
      quickActions,
      recentActivity,
      stats: {
        activeTrips,
        pendingExpenses,
        alerts,
        esgScore,
        co2ThisMonth,
        budgetUsed,
      },
    });
  } catch (err) {
    console.error("❌ Error loading dashboard:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

// ===============================
// 📊 Reports API
// ===============================
exports.getReports = async (req, res) => {
  try {
    const totalTrips = await Trip.count();
    const totalExpenses = (await Expense.sum("amount")) || 0;
    const totalAlerts = await Alert.count();
    const avgESG = await getESGScore(1);

    res.status(200).json({
      success: true,
      message: "Reports loaded successfully",
      data: {
        totalTrips,
        totalExpenses,
        totalAlerts,
        avgESG,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error loading reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load reports",
    });
  }
};
