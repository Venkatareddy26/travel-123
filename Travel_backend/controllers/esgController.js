import pool from '../config/db.js';

// 🌱 Get ESG data
export const getEsgData = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM esg_data ORDER BY year DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching ESG data:', err);
    res.status(500).json({ error: 'Failed to fetch ESG data' });
  }
};

// ➕ Add ESG data
export const addEsgData = async (req, res) => {
  try {
    const { esgscore, compliancerate, co2reduction, sustainabilityindex, year } = req.body;
    const insertQuery = `
      INSERT INTO esg_data (esgscore, compliancerate, co2reduction, sustainabilityindex, year)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [esgscore, compliancerate, co2reduction, sustainabilityindex, year];
    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error inserting ESG data:', err);
    res.status(500).json({ error: 'Failed to add ESG data' });
  }
};
