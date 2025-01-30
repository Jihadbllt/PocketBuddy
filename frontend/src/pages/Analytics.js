// pages/Analytics.js

import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // or wherever you keep your Axios config
import { Pie, Line } from "react-chartjs-2";
import { buildPieConfig, buildLineConfig } from "../components/Chart";

// If you're using Chart.js v3/v4, be sure to register these globally somewhere in your project.
// import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
// ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function Analytics() {
  const [pieData, setPieData] = useState(null);
  const [lineData, setLineData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Example GET request to your backend
        // Suppose your backend returns something like:
        // {
        //   categories: { Food: 250, Transport: 100, Entertainment: 300 },
        //   spendingOverTime: { "Week 1": 550, "Week 2": 450, ... }
        // }
        const response = await axiosInstance.get("/analytics");

        // Destructure or adjust based on your actual data shape:
        const { categories, spendingOverTime } = response.data;

        // Transform backend data into Chart.js configs:
        const newPieData = buildPieConfig(categories);
        const newLineData = buildLineConfig(spendingOverTime);

        setPieData(newPieData);
        setLineData(newLineData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {/* Pie Chart Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Expense Distribution</h3>
        {pieData ? <Pie data={pieData} /> : <p>Loading pie chart...</p>}
      </div>

      {/* Line Chart Section */}
      <div>
        <h3 className="text-lg font-semibold">Spending Over Time</h3>
        {lineData ? <Line data={lineData} /> : <p>Loading line chart...</p>}
      </div>
    </div>
  );
}

export default Analytics;
