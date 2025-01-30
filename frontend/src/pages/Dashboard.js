// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ExpenseCard from "../components/ExpenseCard";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/expenses");
        setExpenses(response.data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
