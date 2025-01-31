import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axiosInstance.get("/budget"); // ✅ Get budget from backend
        setBudget(response.data.budget);
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };

    fetchBudget();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-500 flex flex-col items-center justify-center text-white">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center w-3/4 max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your expenses with ease!</p>

        {/* ✅ Budget Info */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">💰 Current Budget:</h2>
          <p className="text-2xl font-bold text-green-600">
            {budget !== null ? `$${budget.toFixed(2)}` : "Loading..."}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 transition p-3 rounded text-white font-semibold shadow-md"
            onClick={() => navigate("/add")}
          >
            ➕ Add Expense
          </button>

          <button
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded text-white font-semibold shadow-md"
            onClick={() => navigate("/set-budget")}
          >
            ⚙️ Set Budget
          </button>

          <button
            className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded text-white font-semibold shadow-md"
            onClick={() => navigate("/analytics")}
          >
            📊 View Analytics
          </button>

          <button
            className="w-full bg-red-500 hover:bg-red-600 transition p-3 rounded text-white font-semibold shadow-md"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
