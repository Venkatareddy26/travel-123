// controllers/kpiController.js
// KPI and Analytics for Admin Dashboard

const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

// Cache for KPI data (5 second TTL per range)
const kpiCache = {};
const CACHE_TTL = 5000;

// Get KPI metrics
const getKPIs = async (req, res) => {
  try {
    const { range = "30d" } = req.query;

    // Return cached data if fresh
    if (kpiCache[range] && Date.now() - kpiCache[range].time < CACHE_TTL) {
      return res.json(kpiCache[range].data);
    }

    // Calculate date range
    let daysBack = 30;
    if (range === "7d") daysBack = 7;
    else if (range === "90d") daysBack = 90;
    else if (range === "365d") daysBack = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get trip counts by status (all trips, not filtered by date for total count)
    const tripStats = await sequelize.query(
      `SELECT 
        COUNT(*) as total_trips,
        COUNT(CASE WHEN LOWER(status) = 'approved' THEN 1 END) as approved_trips,
        COUNT(CASE WHEN LOWER(status) = 'pending' THEN 1 END) as pending_trips,
        COUNT(CASE WHEN LOWER(status) = 'rejected' THEN 1 END) as rejected_trips,
        COUNT(DISTINCT "userId") as distinct_travelers,
        COUNT(DISTINCT destination) as destinations_count,
        COALESCE(SUM(budget), 0) as total_budget
      FROM travels`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Get expense stats if Expenses table exists
    let expenseStats = {
      total_spend: 0,
      total_airfare: 0,
      total_hotels: 0,
      total_meals: 0,
    };

    try {
      const expenses = await sequelize.query(
        `SELECT 
          COALESCE(SUM(amount), 0) as total_spend,
          COALESCE(SUM(CASE WHEN LOWER(category) LIKE '%air%' OR LOWER(category) LIKE '%flight%' THEN amount ELSE 0 END), 0) as total_airfare,
          COALESCE(SUM(CASE WHEN LOWER(category) LIKE '%hotel%' OR LOWER(category) LIKE '%accommodation%' THEN amount ELSE 0 END), 0) as total_hotels,
          COALESCE(SUM(CASE WHEN LOWER(category) LIKE '%meal%' OR LOWER(category) LIKE '%food%' THEN amount ELSE 0 END), 0) as total_meals
        FROM "Expenses"
        WHERE "createdAt" >= :startDate`,
        {
          replacements: { startDate },
          type: QueryTypes.SELECT,
        }
      );
      if (expenses[0]) {
        expenseStats = expenses[0];
      }
    } catch (e) {
      // Expenses table might not exist yet
      console.log("Expenses table not found, using defaults");
    }

    const stats = tripStats[0] || {};

    const totalTrips = Number(stats.total_trips) || 0;
    const kpis = {
      // Both field names for compatibility
      total_trips: totalTrips,
      trips_count: totalTrips,
      approved_trips: Number(stats.approved_trips) || 0,
      pending_trips: Number(stats.pending_trips) || 0,
      rejected_trips: Number(stats.rejected_trips) || 0,
      distinct_travelers: Number(stats.distinct_travelers) || 0,
      destinations_count: Number(stats.destinations_count) || 0,
      total_budget: Number(stats.total_budget) || 0,
      total_spend: Number(expenseStats.total_spend) || 0,
      total_airfare: Number(expenseStats.total_airfare) || 0,
      total_hotels: Number(expenseStats.total_hotels) || 0,
      total_meals: Number(expenseStats.total_meals) || 0,
      approval_rate:
        totalTrips > 0
          ? Math.round((Number(stats.approved_trips) / totalTrips) * 100)
          : 0,
    };

    const response = { success: true, kpis };

    console.log("📊 KPI Response:", JSON.stringify(kpis, null, 2));

    // Cache the response
    kpiCache[range] = { data: response, time: Date.now() };

    return res.json(response);
  } catch (err) {
    console.error("getKPIs error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;

    let whereClause = "WHERE 1=1";
    const replacements = {};

    if (startDate) {
      whereClause += ' AND "startDate" >= :startDate';
      replacements.startDate = startDate;
    }

    if (endDate) {
      whereClause += ' AND "startDate" <= :endDate';
      replacements.endDate = endDate;
    }

    // Get trips
    const trips = await sequelize.query(
      `SELECT 
        id, destination, "startDate" as start, "endDate" as end, 
        status, "employeeName" as requester, purpose, budget as "costEstimate"
      FROM travels
      ${whereClause}
      ORDER BY "createdAt" DESC
      LIMIT 500`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    // Get monthly trend
    const monthlyTrend = await sequelize.query(
      `SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as trips,
        COALESCE(SUM(budget), 0) as spend
      FROM travels
      ${whereClause}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    // Get destination breakdown
    const destinations = await sequelize.query(
      `SELECT 
        destination,
        COUNT(*) as count,
        COALESCE(SUM(budget), 0) as total_budget
      FROM travels
      ${whereClause}
      GROUP BY destination
      ORDER BY count DESC
      LIMIT 10`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      success: true,
      trips,
      monthlyTrend,
      destinations,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getKPIs,
  getAnalytics,
};
