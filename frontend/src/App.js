import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SetBudget from "./pages/SetBudget"; // ✅ Import SetBudget Page

// Protected Route Handling
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth); // Listen for storage changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      {/* ✅ Show Navbar only when authenticated */}
      {isAuthenticated && <Navbar />}

      <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-50 flex flex-col">
        <div className="container mx-auto px-6 py-8">
          <Routes>
            {/* 🔗 Authentication Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔒 Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/set-budget"
              element={
                <ProtectedRoute>
                  <SetBudget />
                </ProtectedRoute>
              }
            />

            {/* 🛑 Catch-all for unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
