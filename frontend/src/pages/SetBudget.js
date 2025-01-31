import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function SetBudget() {
  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch the current budget when the page loads
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axiosInstance.get("/users/me"); // Fetch user details
        setCurrentBudget(response.data.budget ?? 0);
      } catch (error) {
        console.error("Error fetching budget:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(budget) < 0) {
      alert("❌ Budget cannot be negative.");
      return;
    }

    setUpdating(true);

    try {
      await axiosInstance.put("/set-budget/", { budget: Number(budget) });

      // Show success message and update the UI
      setTimeout(() => {
        alert("✅ Budget updated successfully!");
        setCurrentBudget(Number(budget)); // Update displayed budget
        setBudget(""); // Reset input field
        setUpdating(false);
      }, 500);
    } catch (error) {
      console.error("Error setting budget:", error.response?.data || error.message);
      alert("❌ Failed to update budget. Check console for details.");
      setUpdating(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700">💰 Set Your Budget</h1>

        {/* Display current budget */}
        <div className="text-center mb-4">
          {loading ? (
            <p className="text-gray-500">Loading budget...</p>
          ) : (
            <p className={`text-lg font-semibold ${currentBudget < 20 ? "text-red-500" : "text-green-600"}`}>
              Current Budget: <span className="font-bold">${(currentBudget ?? 0).toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Budget Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Enter New Budget:</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition duration-200"
              required
              placeholder="Enter budget 💲"
              min="0"
              disabled={loading || updating}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              updating || !budget
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-500 hover:scale-105"
            }`}
            disabled={updating || !budget}
          >
            {updating ? "Updating..." : "✅ Set Budget"}
          </button>
        </form>

        {/* Back to Dashboard Button */}
        <button
          className="w-full mt-4 p-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ease-in-out transform"
          onClick={() => navigate("/dashboard")}
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SetBudget;
