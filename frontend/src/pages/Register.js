import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/", form);
      alert("✅ Registration successful! You can now log in.");
      if (response.data.id) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.detail || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-green-300"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-green-300"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-green-300"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-500 transition flex justify-center"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
