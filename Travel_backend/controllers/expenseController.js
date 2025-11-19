/*import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// 🧾 Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const conditions = [];
    const params = [];

    if (userId) {
      params.push(userId);
      conditions.push(`user_id = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(`SELECT * FROM expenses ${whereClause} ORDER BY created_at DESC`, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// ➕ Create expense
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, user_id, date_of_expense, notes } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    const insertQuery = `
      INSERT INTO expenses (id, user_id, title, amount, category, date_of_expense, receipt_url, status, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8)
      RETURNING *;
    `;
    const values = [uuidv4(), user_id, title, amount, category, date_of_expense, file, notes];

    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

// ✅ Update expense status
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE expenses SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Expense not found' });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};
*/
const Expense = require("../modules/Expense");
const { v4: uuidv4 } = require("uuid");
//const sequelize = require("../config/db");


// 🧾 Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const where = {};

    if (userId) where.user_id = userId;
    if (status) where.status = status;

    const expenses = await Expense.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// ➕ Create expense
exports.createExpense = async (req, res) => {
  try {
    console.log("📦 Received Body:", req.body);
    console.log("📎 Uploaded File:", req.file);

    // Get user ID from auth token
    const user_id = req.user.id;

    const { title, amount, category, date_of_expense, notes } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Remove user_id validation (token provides it)
    if (!title || !amount || !category || !date_of_expense) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const expense = await Expense.create({
      user_id,
      title,
      amount,
      category,
      date_of_expense,
      receipt_url: filePath,
      status: "pending",
      notes,
    });

    console.log("✅ Expense created:", expense.toJSON());
    res.status(201).json(expense);

  } catch (err) {
    console.error("❌ Error creating expense:", err);
    res.status(500).json({ error: err.message || "Failed to create expense" });
  }
};




// ✅ Update expense status
exports.updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense)
      return res.status(404).json({ error: "Expense not found" });

    expense.status = status;
    await expense.save();

    res.status(200).json(expense);
  } catch (err) {
    console.error("❌ Error updating expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
};
