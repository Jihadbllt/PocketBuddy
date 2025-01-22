export const pieChartConfig = {
    labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [300, 150, 200, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };
  
  export const lineChartConfig = {
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
  