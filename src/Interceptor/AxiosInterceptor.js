import axios from "axios";
import { removeUser } from "../features/UserSlice";
import { removeJwt } from "../features/JwtSlice";

const axiosInstance = axios.create({
  baseURL: "https://bluc-ysbf.onrender.com", // Use the Vite proxy path
});

// Log request URL before sending
axiosInstance.interceptors.request.use((config) => {
  console.log("🔁 Request URL:", config.url);
  return config;
});

// Example request
// axiosInstance
//   .get("/api")
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));

// 🔹 REQUEST INTERCEPTOR (Attach JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    /* 🔹 STRIP /api PREFIX (Vite replacement logic) */
    if (config.url && config.url.startsWith("/api")) {
      console.log("🔁 Stripping /api from URL:", config.url);
      config.url = config.url.replace("/api", "");
    }

    /* 🔹 ATTACH JWT TOKEN */
    let token = localStorage.getItem("token");

    try {
      token = JSON.parse(token);
    } catch {
      // token is plain string
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
if (import.meta.env.DEV) {
  console.log("🔐 AUTH HEADER ATTACHED");
}    }

    console.log("🚀 Final API Request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   - Handle 401 Unauthorized
========================= */
export const setupResponseInterceptor = (navigate, dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        console.warn("🔐 Unauthorized - Session expired");

        // Clear Redux
        dispatch(removeUser());
        dispatch(removeJwt());

        // Clear Storage
        localStorage.removeItem("token");

        // Redirect
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
