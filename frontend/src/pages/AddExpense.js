import React, { useState } from 'react';

function AddExpense() {
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Expense Submitted:', expense);

    // Reset the form
    setExpense({ amount: '', category: '', description: '' });

    // TODO: Add API call to save expense data to the backend
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Category:
            <select
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={expense.description}
              onChange={handleChange}
              placeholder="Optional"
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
