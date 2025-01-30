import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST /users/register => { message: 'User registered', id: '...' }
      const response = await axiosInstance.post("/users/register", form);
      alert(response.data.message);
      if (response.data.id) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering. Check console for details.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
