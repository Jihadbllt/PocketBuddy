import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AddExpense() {
  const [formData, setFormData] = useState({
    category: "",
    amount: 0,
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/expenses", {
        ...formData,
      });
      alert("Expense added successfully!");
      setFormData({ category: "", amount: 0, description: "" });
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Check console for details.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Category:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
