import React from "react";
import formatCurrency from "../utils/formatCurrency";

function ExpenseCard({ expense }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">{expense.category}</h3>
      <p>
        <span className="font-medium">Amount:</span>{" "}
        {formatCurrency(expense.amount)}
      </p>
      <p>
        <span className="font-medium">Description:</span>{" "}
        {expense.description || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {new Date(expense.date).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ExpenseCard;
