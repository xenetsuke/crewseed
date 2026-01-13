import axiosClient from "../Interceptor/AxiosInterceptor";

/**
 * EMAIL + PASSWORD LOGIN
 */
export const loginWithEmail = async ({ email, password }) => {
  try {
    return await axiosClient.post("/auth/login", {
      loginType: "EMAIL",
      identifier: email,
      password: password,
    });
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};
