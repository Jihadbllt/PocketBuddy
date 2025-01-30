// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
