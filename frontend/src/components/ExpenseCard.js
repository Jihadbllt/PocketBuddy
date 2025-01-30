import React from "react";
import formatCurrency from "../utils/formatCurrency";

function ExpenseCard({ expense }) {
  return (
    <div className="shadow p-4 mb-2 bg-white rounded-lg">
      <h3 className="text-lg font-semibold">{expense.category}</h3>
      <p>Amount: {formatCurrency(expense.amount)}</p>
      <p>Description: {expense.description || "No description"}</p>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
    </div>
  );
}

export default ExpenseCard;
