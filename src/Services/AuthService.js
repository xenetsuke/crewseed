import axiosInstance from "../Interceptor/AxiosInterceptor";

/**
 * Login user
 * @param {Object} loginData
 */
export const loginWithEmail = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data; // ✅ RETURN ONLY DATA
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};
