import axios from "axios";
import { removeUser } from "../features/UserSlice";
import { removeJwt } from "../features/JwtSlice";

// 🔹 Create Axios instance
const axiosInstance = axios.create({
  // Use the Vite proxy path
  baseURL: "https://crewb-2.onrender.com",
});

// 🔹 REQUEST INTERCEPTOR (Attach JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    // 👇 FIX: remove JSON quotes if present
    try {
      token = JSON.parse(token);
    } catch {
      // token was already plain string
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🔹 RESPONSE INTERCEPTOR (Handle 401)
export const setupResponseInterceptor = (navigate, dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        console.warn("🔐 Session expired. Redirecting to login...");

        dispatch(removeUser());
        dispatch(removeJwt());
        localStorage.removeItem("token");

        navigate("/login");
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
