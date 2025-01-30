// src/components/Navbar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the navbar on login/register routes
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white px-8 py-4 flex items-center">
      <Link to="/dashboard" className="text-xl font-bold">
        PocketBuddy
      </Link>
      <div className="ml-auto flex space-x-4">
        <Link to="/add" className="hover:text-gray-200 transition">
          Add Expense
        </Link>
        <Link to="/analytics" className="hover:text-gray-200 transition">
          Analytics
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
