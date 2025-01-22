import React from 'react';

function ExpenseCard({ expense }) {
  return (
    <div className="expense-card">
      <h3>{expense.category}</h3>
      <p>{expense.amount}</p>
    </div>
  );
}

export default ExpenseCard;
