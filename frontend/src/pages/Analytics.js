import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function Analytics() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/expenses");
        setExpenseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Generate Expense Categories for Pie Chart
  const getCategoryData = () => {
    const categoryMap = {};
    expenseData.forEach((expense) => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(categoryMap),
      datasets: [
        {
          data: Object.values(categoryMap),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#E74C3C"],
          hoverBackgroundColor: ["#FF4D6D", "#2D9CDB", "#FFC300", "#48C9B0", "#8A5CFF", "#E74C3C"],
          borderWidth: 3,
        },
      ],
    };
  };

  // Generate Expenses Over Time for Line Chart
  const getTimeData = () => {
    const dateMap = {};
    expenseData.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + expense.amount;
    });

    const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Spending Over Time",
          data: sortedDates.map((date) => dateMap[date]),
          fill: false,
          borderColor: "#4BC0C0",
          tension: 0.3,
          backgroundColor: "#4BC0C0",
          pointBorderColor: "#fff",
          pointBackgroundColor: "#4BC0C0",
          borderWidth: 3,
        },
      ],
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 animate-fadeIn">📊 Expense Analytics</h1>

      {loading ? (
        <p className="text-lg animate-pulse">Loading charts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg text-black transition-transform duration-500 transform hover:scale-105">
          {/* Pie Chart for Expense Distribution */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-center mb-3 text-gray-700">Expense Distribution</h2>
            <Pie data={getCategoryData()} />
          </div>

          {/* Line Chart for Spending Over Time */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-center mb-3 text-gray-700">Spending Over Time</h2>
            <Line data={getTimeData()} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
