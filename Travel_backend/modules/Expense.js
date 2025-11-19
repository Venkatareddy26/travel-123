// Expense.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
  },

  date_of_expense: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  receipt_url: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },

  notes: {
    type: DataTypes.TEXT,
  },
});

module.exports = Expense;
