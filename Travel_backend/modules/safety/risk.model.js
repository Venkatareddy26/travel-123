const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Risk = sequelize.define("Risk", {
  travelId: {
    type: DataTypes.INTEGER,
    allowNull: true  // Made optional for general risk ratings
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  weather: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = Risk;
