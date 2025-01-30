import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError("Failed to load profile.");
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login"); // Redirect to login if token is invalid
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear stored token
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {user ? (
          <div>
            <p className="mb-2"><strong>Username:</strong> {user.username}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <button
              className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-500 transition mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-red-600">{error || "Loading..."}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
