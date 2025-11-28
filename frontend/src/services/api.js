// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000, // short timeout to detect offline quickly
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// transform responses consistently
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Normalize error object
    const payload = err?.response?.data || {
      message: err.message || "Network Error",
      status: err?.response?.status || null,
    };
    return Promise.reject(payload);
  }
);

export default api;
