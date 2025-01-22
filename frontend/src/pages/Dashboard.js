import React from 'react';
import ExpenseCard from '../components/ExpenseCard';

function Dashboard() {
  const sampleExpenses = [
    { category: 'Food', amount: '$50' },
    { category: 'Transport', amount: '$20' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {sampleExpenses.map((expense, index) => (
          <ExpenseCard key={index} expense={expense} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
