import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axiosInstance.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        alert("✅ Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.detail || "❌ Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex justify-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          No account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
