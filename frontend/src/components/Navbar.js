import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out!");
    // Optionally force refresh or navigate
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex space-x-4">
      <Link className="font-bold text-xl" to="/">PocketBuddy</Link>
      <Link to="/add" className="hover:text-gray-200">Add Expense</Link>
      <Link to="/analytics" className="hover:text-gray-200">Analytics</Link>
      <Link to="/login" className="ml-auto hover:text-gray-200">Login</Link>
      <Link to="/register" className="hover:text-gray-200">Register</Link>
      <button onClick={handleLogout} className="hover:text-gray-200">Logout</button>
    </nav>
  );
}

export default Navbar;
