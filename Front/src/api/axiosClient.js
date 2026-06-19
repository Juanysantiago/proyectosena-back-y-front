import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});