// modules/index.js

// Safety models
const Alert = require("./safety/alert.model");
const Document = require("./safety/document.model");
const Risk = require("./safety/risk.model");

// Travel models (CORRECTED)
const { Trip, Expense } = require("./travel/travel.model");

// Policy
const Policy = require("./policy/policy.model");

// ESG
const ESGRecord = require("./esg/esg.model");

// Users
const Users = require("./User.js");

module.exports = {
  Alert,
  Document,
  Risk,
  Trip,
  Expense,
  Policy,
  ESGRecord,
  Users,
};
