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
  baseURL: "https://bluc-ysbf.onrender.com",
  withCredentials: true, // 🔥 refresh cookie
});

/* =====================================================
   REQUEST INTERCEPTOR
   - DO NOT attach JWT for /auth/*
   - BLOCK calls until auth.ready === true
===================================================== */
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 Vite proxy support
    if (config.url?.startsWith("/api")) {
      config.url = config.url.replace("/api", "");
    }

    const isAuthRequest = config.url?.startsWith("/auth");

    /* 🔓 AUTH endpoints → ALWAYS ALLOW */
    if (isAuthRequest) {
      if (import.meta.env.DEV) {
        console.log("🔓 [AUTH REQUEST] Allowing →", config.url);
      }
      return config;
    }

    /* ⏳ BLOCK only NON-AUTH calls until bootstrap finishes */
    const authReady = store.getState().auth?.ready;
    if (!authReady) {
      if (import.meta.env.DEV) {
        console.warn("⏳ [AUTH NOT READY] Blocking API →", config.url);
      }
      return Promise.reject({
        message: "AUTH_NOT_READY",
        config,
      });
    }

    const { token } = store.getState().jwt || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      if (import.meta.env.DEV) {
        console.log("➡️ [API REQUEST]");
        console.log("   URL :", config.url);
        console.log("   JWT :", token.slice(0, 20) + "...");
      }
    } else if (import.meta.env.DEV) {
      console.warn("⚠️ [NO JWT FOUND]", config.url);
    }

    // 🧩 Let browser handle multipart boundaries
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   RESPONSE INTERCEPTOR
   - NEVER refresh on /auth/*
   - STOP infinite refresh loops
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
    const status = error?.response?.status;
    const originalRequest = error.config;
    const provider = sessionStorage.getItem("auth_provider");
    const loggedOut = sessionStorage.getItem("crewseed_logged_out");
    const isAuthRequest = originalRequest?.url?.startsWith("/auth");

    if (import.meta.env.DEV) {
      console.warn("❌ [API ERROR]", status, originalRequest?.url);
    }

    /* =================================================
       HARD STOPS
    ================================================= */
    if (loggedOut || isAuthRequest) {
      return Promise.reject(error);
    }

    if (status === 401 && isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    // ⛔ Stop infinite retry loops
    if (status === 401 && originalRequest._retry) {
      console.warn("⛔ [RETRY BLOCKED]", originalRequest.url);
      return Promise.reject(error);
    }

    // 🔥 Firebase → NEVER refresh
    if (status === 401 && provider === "FIREBASE") {
      console.warn("🔥 Firebase auth → skip refresh");
      return Promise.reject(error);
    }

    if (status === 401) {
      /* =================================================
         PASSWORD LOGIN → SILENT REFRESH
      ================================================= */
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 [REFRESH TOKEN] Attempting refresh…");

        const newToken = await refreshAccessToken();
        store.dispatch(setJwt(newToken));

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        console.error("🚨 [REFRESH FAILED]");

        // 📱 Mobile-safe behavior (DON'T hard logout)
        if (/Mobi|Android/i.test(navigator.userAgent)) {
          console.warn("📱 Mobile detected → keeping session alive");
          return Promise.reject(err);
        }

        // 🖥️ Desktop → hard logout
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
