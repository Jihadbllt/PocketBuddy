import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register required components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function Analytics() {
  // Sample data for charts
  const pieData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [300, 150, 200, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Spending Over Time',
        data: [500, 700, 400, 600],
        fill: false,
        borderColor: '#4BC0C0',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics</h1>
      <div style={{ marginBottom: '30px' }}>
        <h3>Expense Distribution</h3>
        <Pie data={pieData} />
      </div>
      <div>
        <h3>Spending Over Time</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
}

export default Analytics;
