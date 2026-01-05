import axios from "axios";
import { removeUser } from "../features/UserSlice";
import { removeJwt } from "../features/JwtSlice";

/* =========================
   AXIOS INSTANCE
========================= */
const axiosInstance = axios.create({
  // Use your production URL. 
  // If you are using Vite Proxy in development, this can be "/api"
  baseURL: "https://bluc-ysbf.onrender.com",
});

/* =========================
   REQUEST INTERCEPTOR
   - Strips /api prefix if present
   - Attaches JWT Token
========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    /* 🔹 STRIP /api PREFIX 
       Useful if your frontend services still use "/api/endpoint" 
       but your baseURL already points to the root */
    if (config.url && config.url.startsWith("/api")) {
      config.url = config.url.replace("/api", "");
      console.log("🔁 Stripped /api. New URL:", config.url);
    }

    /* 🔹 ATTACH JWT TOKEN */
    let token = localStorage.getItem("token");

    if (token) {
      try {
        // Handle cases where token might be a JSON string
        const parsedToken = JSON.parse(token);
        token = parsedToken;
      } catch (e) {
        // token is already a plain string, do nothing
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method?.toUpperCase()} Request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
   - Handle 401 Unauthorized (Expired Session)
========================= */
export const setupResponseInterceptor = (navigate, dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        console.warn("🔐 Unauthorized - Redirecting to login...");

        // Clear Redux State
        dispatch(removeUser());
        dispatch(removeJwt());

        // Clear Local Storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to Login
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
