const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Trip = sequelize.define(
  "Trip",
  {
    employeeName: { type: DataTypes.STRING, allowNull: true, defaultValue: "Unknown" },
    destination: { type: DataTypes.STRING, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
    budget: { type: DataTypes.FLOAT, defaultValue: 0 },
    urgency: { type: DataTypes.STRING },
    accommodation: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
  },
  {
    timestamps: true,
    tableName: "travels",
  }
);

const Expense = sequelize.define("Expense", {
  title: { type: DataTypes.STRING, allowNull: true },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  category: { type: DataTypes.STRING, allowNull: true },
  date_of_expense: { type: DataTypes.DATEONLY, allowNull: true },
  receipt_url: { type: DataTypes.STRING, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.STRING, allowNull: true, field: 'user_id' },
}, {
  tableName: "Expenses",
  timestamps: true,
});

module.exports = { Trip, Expense };

/*const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");


 * ============================
 *  TRIP MODEL
 * ============================

const Trip = sequelize.define(
  "Trip",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    budget: { type: DataTypes.FLOAT, defaultValue: 0 },
    urgency: { type: DataTypes.STRING },
    accommodation: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
  },
  {
    timestamps: true,
    tableName: "travels",
  }
);

/**
 * ============================
 *  TRAVEL CARD MODEL
 * ============================
 * Example: Corporate Card, Insurance, etc.
 
const TravelCard = sequelize.define(
  "TravelCard",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tripId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // Corporate Card, Insurance
    number: { type: DataTypes.STRING },
    expiry: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: "active" },
    daysUntilExpiry: { type: DataTypes.INTEGER },
  },
  {
    timestamps: true,
  }
);

/**
 * ============================
 *  SCHEDULE (DAY-WISE ACTIVITIES)
 * ============================
 
const ScheduleItem = sequelize.define(
  "ScheduleItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tripId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false }, // 09:30 AM
    type: { type: DataTypes.STRING, allowNull: false }, // flight, hotel, meeting
    title: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: "scheduled" },
    ticketUrl: { type: DataTypes.STRING },
  },
  {
    timestamps: true,
  }
);

/**
 * ============================
 *  RELATIONSHIPS
 * ============================
 
Trip.hasMany(TravelCard, { foreignKey: "tripId", onDelete: "CASCADE" });
TravelCard.belongsTo(Trip, { foreignKey: "tripId" });

Trip.hasMany(ScheduleItem, { foreignKey: "tripId", onDelete: "CASCADE" });
ScheduleItem.belongsTo(Trip, { foreignKey: "tripId" });

module.exports = { Trip, TravelCard, ScheduleItem };
*/