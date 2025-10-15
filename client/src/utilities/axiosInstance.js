import axios from "axios";

// Automatically reads your Vite env
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Create a reusable Axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
