import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/expenses/");
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to load expense data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  // Data for Bar Chart
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Total Spending by Category",
        data: amounts,
        backgroundColor: ["#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"],
      },
    ],
  };

  // Data for Pie Chart
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: ["#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-500 flex flex-col items-center justify-center text-white">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center w-3/4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800">📊 Expense Analytics</h1>
        <p className="text-gray-500 mt-2">Visualize your spending patterns.</p>

        {loading ? (
          <p className="text-gray-700">Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-600">No expenses recorded yet.</p>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Spending by Category</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <Bar data={barData} />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Expense Distribution</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <Pie data={pieData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
