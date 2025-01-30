import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ExpenseCard from "../components/ExpenseCard";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Example GET request to FastAPI: GET /expenses
        const response = await axiosInstance.get("/expenses");
        setExpenses(response.data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

export default Dashboard;
