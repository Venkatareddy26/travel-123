/*import React, { useState } from 'react';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: '1',
      description: 'Hotel - Marriott NYC',
      amount: 250.00,
      date: '2024-03-14',
      category: 'accommodation',
      status: 'pending',
      receipt: 'marriott-receipt.pdf'
    },
    {
      id: '2',
      description: 'Flight - American Airlines',
      amount: 450.00,
      date: '2024-03-13',
      category: 'transportation',
      status: 'approved',
      receipt: 'aa-ticket.pdf'
    },
    {
      id: '3',
      description: 'Client Dinner',
      amount: 85.50,
      date: '2024-03-15',
      category: 'meals',
      status: 'rejected',
      receipt: 'dinner-receipt.jpg',
      rejectionReason: 'Missing itemized receipt'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { value: 'transportation', label: 'Transportation' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'other', label: 'Other' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert(`${files.length} file(s) uploaded successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transportation': return '🚗';
      case 'accommodation': return '🏨';
      case 'meals': return '🍽️';
      case 'supplies': return '📎';
      default: return '💼';
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="page-container">
      <h1 className="page-title">Expense Management</h1>
      
      <div className="expenses-layout">
        <div className="upload-section">
          <h2>Upload Receipt</h2>
          
          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="receiptFile"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="file-input"
            />
            <label htmlFor="receiptFile" className="upload-label">
              <div className="upload-content">
                <span className="upload-icon">📎</span>
                <p className="upload-text">
                  <strong>Choose files</strong> or drag them here
                </p>
                <p className="upload-subtext">
                  Supports: JPG, PNG, PDF (Max 10MB each)
                </p>
              </div>
            </label>
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}% uploaded</span>
              </div>
            )}
          </div>

          <div className="expense-summary">
            <h3>Expense Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">${totalExpenses.toFixed(2)}</span>
                <span className="stat-label">Total Submitted</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">${approvedExpenses.toFixed(2)}</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">${pendingExpenses.toFixed(2)}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="expenses-list-section">
          <h2>Submitted Expenses</h2>
          
          {expenses.length === 0 ? (
            <div className="no-expenses">
              <span className="no-expenses-icon">💰</span>
              <p>No expenses submitted yet</p>
            </div>
          ) : (
            <div className="expenses-list">
              {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-icon">
                    {getCategoryIcon(expense.category)}
                  </div>
                  
                  <div className="expense-details">
                    <div className="expense-header">
                      <h3 className="expense-description">{expense.description}</h3>
                      <span 
                        className="expense-status"
                        style={{ backgroundColor: getStatusColor(expense.status) }}
                      >
                        {expense.status}
                      </span>
                    </div>
                    
                    <div className="expense-info">
                      <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                      <span className="expense-date">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      <span className="expense-category">
                        {categories.find(c => c.value === expense.category)?.label}
                      </span>
                    </div>
                    
                    {expense.receipt && (
                      <div className="expense-receipt">
                        <span className="receipt-icon">📄</span>
                        <span className="receipt-name">{expense.receipt}</span>
                      </div>
                    )}
                    
                    {expense.status === 'rejected' && expense.rejectionReason && (
                      <div className="rejection-reason">
                        <span className="rejection-icon">❌</span>
                        <span className="rejection-text">{expense.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;*/
// Travel_frontend/src/pages/expenses/Expenses.js
// Travel_frontend/src/pages/expenses/Expenses.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Expenses.css";

const Expenses = () => {
  const { token, user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date_of_expense: "",
    notes: "",
  });

  // ================================================
  // Load expenses
  // ================================================
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("❌ Error fetching expenses:", err.response?.data || err);
    }
  };

  // ================================================
  // File upload handlers
  // ================================================
  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // ================================================
  // Upload expense
  // ================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload a receipt!");
      return;
    }

    if (!formData.title || !formData.amount || !formData.category || !formData.date_of_expense) {
      alert("Please fill all fields!");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("amount", formData.amount);
    form.append("category", formData.category);
    form.append("date_of_expense", formData.date_of_expense);
    form.append("notes", formData.notes);
    form.append("receipt", selectedFile);

    try {
      setIsUploading(true);

      await axios.post("http://localhost:5000/api/expenses", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (p) => {
          setUploadProgress(Math.round((p.loaded * 100) / p.total));
        },
      });

      alert("Expense uploaded successfully!");

      setFormData({
        title: "",
        amount: "",
        category: "",
        date_of_expense: "",
        notes: "",
      });
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);

      fetchExpenses();
    } catch (err) {
      console.error("🔥 FULL ERROR:", err);
      alert(
        "SERVER ERROR: " +
          JSON.stringify(err.response?.data || err.message, null, 2)
      );
      setIsUploading(false);
    }
  };

  // ================================================
  // Helpers
  // ================================================
  const categories = [
    { value: "transportation", label: "Transportation" },
    { value: "accommodation", label: "Accommodation" },
    { value: "meals", label: "Meals & Entertainment" },
    { value: "supplies", label: "Office Supplies" },
    { value: "other", label: "Other" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#27ae60";
      case "pending":
        return "#f39c12";
      case "rejected":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "transportation":
        return "🚗";
      case "accommodation":
        return "🏨";
      case "meals":
        return "🍽️";
      case "supplies":
        return "📎";
      default:
        return "💼";
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const approvedExpenses = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingExpenses = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // ================================================
  // UI
  // ================================================
  return (
    <div className="page-container">
      <h1 className="page-title">Expense Management</h1>

      <div className="expenses-layout">
        <div className="upload-section">
          <h2>Upload New Expense</h2>

          <form onSubmit={handleSubmit} className="expense-form">
            <input
              type="text"
              placeholder="Expense Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={formData.date_of_expense}
              onChange={(e) =>
                setFormData({ ...formData, date_of_expense: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>

            {/* FILE UPLOAD BOX */}
            <div
              className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                id="receiptFile"
                onChange={handleFileInput}
                className="file-input"
              />

              <label htmlFor="receiptFile" className="upload-label">
                <div className="upload-content">
                  <span className="upload-icon">📎</span>
                  <p>
                    <strong>Choose file</strong> or drag it here
                  </p>
                  {selectedFile && <p>Selected: {selectedFile.name}</p>}
                </div>
              </label>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>{uploadProgress}% uploaded</span>
                </div>
              )}
            </div>

            <button className="submit-btn" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Submit Expense"}
            </button>
          </form>

          {/* SUMMARY */}
          <div className="expense-summary">
            <h3>Expense Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span>${totalExpenses.toFixed(2)}</span>
                <p>Total Submitted</p>
              </div>
              <div className="stat-item">
                <span>${approvedExpenses.toFixed(2)}</span>
                <p>Approved</p>
              </div>
              <div className="stat-item">
                <span>${pendingExpenses.toFixed(2)}</span>
                <p>Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* EXPENSE LIST */}
        <div className="expenses-list-section">
          <h2>Submitted Expenses</h2>

          {expenses.length === 0 ? (
            <p>No expenses submitted yet</p>
          ) : (
            <div className="expenses-list">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-icon">
                    {getCategoryIcon(expense.category)}
                  </div>

                  <div className="expense-details">
                    <div className="expense-header">
                      <h3>{expense.title}</h3>
                      <span
                        style={{ backgroundColor: getStatusColor(expense.status) }}
                        className="expense-status"
                      >
                        {expense.status}
                      </span>
                    </div>

                    <div className="expense-info">
                      <span>${Number(expense.amount).toFixed(2)}</span>
                      <span>{new Date(expense.date_of_expense).toLocaleDateString()}</span>
                      <span>
                        {categories.find((c) => c.value === expense.category)?.label}
                      </span>
                    </div>

                    {expense.receipt_url && (
                      <a
                        href={`http://localhost:5000${expense.receipt_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📄 View Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
