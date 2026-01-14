import axios from "axios";
import { refreshToken } from "./authService";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* REQUEST INTERCEPTOR */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const apiKey = import.meta.env.VITE_API_KEY;

    // attach api key
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    // attach access token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*  RESPONSE INTERCEPTOR  */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")&&
      !originalRequest.url.includes("/auth/login")

    ) {
      originalRequest._retry = true;

      try {
        await refreshToken();

        const newToken = localStorage.getItem("accessToken");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
