import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current budget when the page loads
  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await axiosInstance.get("/users/me"); // Get current user data
      setBudget(response.data.budget ?? 0);
    } catch (error) {
      console.error("Error fetching budget:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseAmount = Number(formData.amount);

    // Prevent adding expense if budget is insufficient
    if (budget === null || budget < expenseAmount) {
      alert("❌ Not enough budget to add this expense!");
      return;
    }

    try {
      await axiosInstance.post("/expenses", { ...formData });

      // Fetch updated budget from backend after adding an expense
      fetchBudget();

      alert("✅ Expense added successfully!");
      setFormData({ category: "", amount: "", description: "" });
    } catch (error) {
      console.error("Error adding expense:", error.response?.data || error.message);
      alert("❌ Failed to add expense. Check console for details.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">📝 Add Expense</h1>

        {/* Display Remaining Budget */}
        <div className="text-center mb-4">
          {loading ? (
            <p className="text-gray-500">Fetching budget...</p>
          ) : (
            <p className={`text-lg font-semibold ${budget <= 0 ? "text-red-500" : "text-green-600"}`}>
              💰 Remaining Budget: <span className="font-bold">${budget.toFixed(2)}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Dropdown */}
          <div>
            <label className="block font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
              required
            >
              <option value="">Select a category</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Healthcare">🏥 Healthcare</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition duration-200"
              required
              placeholder="Enter amount 💲"
              min="0"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
              rows="3"
              placeholder="Brief description ✏️"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              budget <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105"
            }`}
            disabled={budget <= 0}
          >
            {budget <= 0 ? "❌ No Budget Available" : "✅ Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
