// // import axios from "axios";
// // import { removeUser } from "../features/UserSlice";
// // import { removeJwt } from "../features/JwtSlice";

// // const axiosInstance = axios.create({
// //   baseURL: "https://bluc-ysbf.onrender.com", // Use the Vite proxy path
// // });

// // // Log request URL before sending
// // axiosInstance.interceptors.request.use((config) => {
// //   console.log("🔁 Request URL:", config.url);
// //   return config;
// // });

// // // Example request
// // // axiosInstance
// // //   .get("/api")
// // //   .then((response) => console.log(response))
// // //   .catch((error) => console.error(error));

// // // 🔹 REQUEST INTERCEPTOR (Attach JWT)
// // axiosInstance.interceptors.request.use(
// //   (config) => {
// //     /* 🔹 STRIP /api PREFIX (Vite replacement logic) */
// //     if (config.url && config.url.startsWith("/api")) {
// //       console.log("🔁 Stripping /api from URL:", config.url);
// //       config.url = config.url.replace("/api", "");
// //     }

// //     /* 🔹 ATTACH JWT TOKEN */
// //     let token = localStorage.getItem("token");

// //     try {
// //       token = JSON.parse(token);
// //     } catch {
// //       // token is plain string
// //     }

// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// // if (import.meta.env.DEV) {
// //   console.log("🔐 AUTH HEADER ATTACHED");
// // }   
    
// //      if (config.data instanceof FormData) {
// //       delete config.headers["Content-Type"];
// //     }
// //     }

// //     console.log("🚀 Final API Request:", {
// //       method: config.method?.toUpperCase(),
// //       url: config.baseURL + config.url,
// //     });

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // /* =========================
// //    RESPONSE INTERCEPTOR
// //    - Handle 401 Unauthorized
// // ========================= */
// // export const setupResponseInterceptor = (navigate, dispatch) => {
// //   axiosInstance.interceptors.response.use(
// //     (response) => response,
// //     (error) => {
// //      if (error?.response?.status === 401) {
// //   const isAuthCall =
// //     error.config?.url?.includes("/auth") ||
// //     error.config?.url?.includes("/profiles");

// //   // 🚫 DON'T LOGOUT DURING LOGIN FLOW
// //   if (!isAuthCall) {
// //     dispatch(removeUser());
// //     dispatch(removeJwt());
// //     localStorage.clear();
// //     navigate("/login");
// //   }
// // }


// //       return Promise.reject(error);

import axios from "axios";
import { store } from "../Store";
import { setJwt, removeJwt } from "../features/JwtSlice";
import { removeUser } from "../features/UserSlice";
import { refreshAccessToken } from "../Services/AuthService";

/* =====================================================
   AXIOS INSTANCE
===================================================== */
const axiosInstance = axios.create({
  baseURL: "https://bluc-ysbf.onrender.com", // backend
  withCredentials: true, // 🔥 REQUIRED for refresh cookie
});

/* =====================================================
   REQUEST INTERCEPTOR
   - Attach Access Token
===================================================== */
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 Strip /api if present (vite proxy support)
    if (config.url?.startsWith("/api")) {
      config.url = config.url.replace("/api", "");
    }

    const token = store.getState().jwt;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      if (import.meta.env.DEV) {
        console.log("🔐 JWT attached");
      }
    }

    // 🔹 Let browser set multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   RESPONSE INTERCEPTOR
   - Silent refresh (PASSWORD)
   - Skip refresh (FIREBASE)
===================================================== */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token)
  );
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const provider = sessionStorage.getItem("auth_provider"); // PASSWORD | FIREBASE

    /* =================================================
       🔥 FIREBASE LOGIN → NEVER REFRESH
    ================================================= */
    if (status === 401 && provider === "FIREBASE") {
      // ❌ Firebase tokens are stateless
      return Promise.reject(error);
    }

    /* =================================================
       🔁 PASSWORD LOGIN → SILENT REFRESH
    ================================================= */
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken(); // POST /auth/refresh
        store.dispatch(setJwt(newToken));

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🔴 HARD LOGOUT (refresh expired / invalid)
        store.dispatch(removeJwt());
        store.dispatch(removeUser());
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/login");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
