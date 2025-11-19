const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ESG = sequelize.define("ESG", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  esgscore: DataTypes.FLOAT,
  compliancerate: DataTypes.FLOAT,
  co2reduction: DataTypes.FLOAT,
  sustainabilityindex: DataTypes.FLOAT,
  year: DataTypes.INTEGER,
});

module.exports = ESG;
