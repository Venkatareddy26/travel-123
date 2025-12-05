// controllers/riskController.js
// Risk Management for Admin Dashboard

const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

// Get all risk advisories
const getAdvisories = async (req, res) => {
  try {
    const advisories = await sequelize.query(
      `SELECT * FROM risk_advisories WHERE active = true ORDER BY created_at DESC`,
      { type: QueryTypes.SELECT }
    );

    return res.json({ success: true, advisories });
  } catch (err) {
    // Table might not exist yet
    if (err.message.includes("does not exist")) {
      return res.json({ success: true, advisories: [] });
    }
    console.error("getAdvisories error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Create risk advisory
const createAdvisory = async (req, res) => {
  try {
    const { title, description, severity, region, country, source } = req.body;

    const result = await sequelize.query(
      `INSERT INTO risk_advisories (title, description, severity, region, country, source, active)
       VALUES (:title, :description, :severity, :region, :country, :source, true)
       RETURNING *`,
      {
        replacements: { title, description, severity, region, country, source },
        type: QueryTypes.INSERT,
      }
    );

    return res.json({ success: true, advisory: result[0] });
  } catch (err) {
    console.error("createAdvisory error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update risk advisory
const updateAdvisory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, severity, region, country, source, active } = req.body;

    await sequelize.query(
      `UPDATE risk_advisories 
       SET title = :title, description = :description, severity = :severity,
           region = :region, country = :country, source = :source, active = :active
       WHERE id = :id`,
      {
        replacements: { id, title, description, severity, region, country, source, active },
        type: QueryTypes.UPDATE,
      }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("updateAdvisory error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete risk advisory
const deleteAdvisory = async (req, res) => {
  try {
    const { id } = req.params;

    await sequelize.query(`DELETE FROM risk_advisories WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteAdvisory error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get travelers at risk (travelers in high-risk destinations)
const getTravelers = async (req, res) => {
  try {
    const travelers = await sequelize.query(
      `SELECT 
        t.id, t."employeeName" as name, t.destination, 
        t."startDate" as start_date, t."endDate" as end_date,
        t.status, t."emergencyContact"
      FROM "Travels" t
      WHERE t.status = 'approved' 
        AND t."startDate" <= CURRENT_DATE 
        AND t."endDate" >= CURRENT_DATE
      ORDER BY t."startDate"`,
      { type: QueryTypes.SELECT }
    );

    return res.json({ success: true, travelers });
  } catch (err) {
    console.error("getTravelers error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAdvisories,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
  getTravelers,
};
