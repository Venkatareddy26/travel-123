// Travel_backend/server.js
require("dotenv").config();
require("./modules"); // Load all Sequelize models

const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// =======================
// Express App
// =======================
const app = express();

// =======================
// HTTP + SOCKET.IO Server
// =======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

// Make io available to all controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =======================
// SOCKET.IO EVENTS
// =======================
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // User joins personal room
  socket.on("joinUser", (userId) => {
    console.log(`📌 User joined room: ${userId}`);
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// =======================
// Middleware
// =======================
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// =======================
// Import Routes
// =======================
const safetyRoutes = require("./routes/safetyRoutes");
const alertRoutes = require("./routes/alertRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const sosRoutes = require("./routes/sosRoutes");
const travelRoutes = require("./routes/travelRoutes");
const policyRoutes = require("./routes/policyRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Extra modules
const expenseRoutes = require("./routes/expenseRoutes");
const esgRoutes = require("./routes/esgRoutes");
const historyRoutes = require("./routes/historyRoutes");

// ITINERARY
const itineraryRoutes = require("./routes/itineraryRoutes");

// EMERGENCY
const emergencyRoutes = require("./routes/emergencyRoutes");

// RISK RATINGS
const riskRoutes = require("./routes/riskRoutes");

// ADMIN PORTAL ROUTES (KPI & Analytics)
const kpiRoutes = require("./routes/kpiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// =======================
// Health Check
// =======================
app.get("/api/healthcheck", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy 🚀",
  });
});

// =======================
// Apply Routes
// =======================

// Safety
app.use("/api/safety", safetyRoutes);
app.use("/api/safety/alerts", alertRoutes);
app.use("/api/safety/checkin", checkinRoutes);
app.use("/api/safety/sos", sosRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Core Travel
app.use("/api/travel", travelRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/approval", approvalRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Documents
app.use("/api/documents", documentRoutes);

// Extra modules
app.use("/api/expenses", expenseRoutes);
app.use("/api/esg", esgRoutes);
app.use("/api/history", historyRoutes);

// ITINERARY
app.use("/api/itinerary", itineraryRoutes);

// EMERGENCY
app.use("/api/emergency", emergencyRoutes);

// RISK RATINGS
app.use("/api/risk", riskRoutes);

// ADMIN PORTAL ROUTES (KPI & Analytics)
app.use("/api/kpi", kpiRoutes);
app.use("/api/analytics", analyticsRoutes);

// Alias for admin portal compatibility
app.use("/api/trips", travelRoutes);

// =======================
// Default Route
// =======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected & synced");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err);
  });
