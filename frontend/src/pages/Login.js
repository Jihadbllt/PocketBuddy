import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example: POST /users/login => { token: '...' }
      const response = await axiosInstance.post("/users/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Logged in successfully!");
        navigate("/");
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Check console for details.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className="ml-2 p-1 border rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
