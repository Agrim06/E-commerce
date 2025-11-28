import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  try {
    const stored =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);

      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.error("Failed to parse stored user:", err);
  }

  return config;
});

export default api;
