import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update if deployed

// Get tokens from localStorage
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Authorization header if access token exists
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (Token Expired) and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const res = await axios.post(`${API_BASE_URL}/refresh`, {
          refresh_token: refreshToken,
        });

        localStorage.setItem("access_token", res.data.access_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed, logging out...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const registerUser = (userData) => api.post("/users/", userData);
export const loginUser = (credentials) => api.post("/login", credentials);
export const getUserProfile = () => api.get("/users/me");

export default api;
