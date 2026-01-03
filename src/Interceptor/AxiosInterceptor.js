import axios from "axios";
import { removeUser } from "../features/UserSlice";
import { removeJwt } from "../features/JwtSlice";

// 🔹 Create Axios instance pointing directly to Render backend
const axiosInstance = axios.create({
  baseURL: "https://bluc-ysbf.onrender.com",
});

// 🔹 REQUEST INTERCEPTOR (Attach JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    // Fix: Remove JSON quotes if present (common when using useLocalStorage hooks)
    try {
      if (token && (token.startsWith('"') || token.startsWith('{'))) {
        token = JSON.parse(token);
      }
    } catch (e) {
      // Token is a plain string, continue
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 RESPONSE INTERCEPTOR (Handle 401 Unauthorized)
// This function is called in your main App.js or main.js to give axios access to navigate/dispatch
export const setupResponseInterceptor = (navigate, dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn("🔐 Session expired or Unauthorized. Clearing storage...");
        
        // Clear Redux State
        dispatch(removeUser());
        dispatch(removeJwt());
        
        // Clear Local Storage
        localStorage.removeItem("token");

        // Redirect to login
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
