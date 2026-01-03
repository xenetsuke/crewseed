import axiosInstance from "../Interceptor/AxiosInterceptor";

/**
 * Login user
 * @param {Object} loginData
 */
export const loginWithEmail = async (loginData) => {
  try {
    return await axiosInstance.post("/auth/login", loginData);
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};
