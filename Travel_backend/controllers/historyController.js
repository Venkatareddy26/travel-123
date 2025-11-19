import pool from '../config/db.js';

// 📜 Get all history records
export const getHistory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// ➕ Add a history record
export const addHistory = async (req, res) => {
  try {
    const { action, user_id, details } = req.body;
    const insertQuery = `
      INSERT INTO history (action, user_id, details, created_at)
      VALUES ($1,$2,$3,NOW())
      RETURNING *;
    `;
    const values = [action, user_id, details];
    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding history:', err);
    res.status(500).json({ error: 'Failed to add history' });
  }
};
