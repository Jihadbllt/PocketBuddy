import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { pieChartConfig, lineChartConfig } from '../components/Chart';

function Analytics() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics</h1>
      <div style={{ marginBottom: '30px' }}>
        <h3>Expense Distribution</h3>
        <Pie data={pieChartConfig} />
      </div>
      <div>
        <h3>Spending Over Time</h3>
        <Line data={lineChartConfig} />
      </div>
    </div>
  );
}

export default Analytics;
