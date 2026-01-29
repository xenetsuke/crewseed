import axiosClient from "../Interceptor/AxiosInterceptor";

const LOGIN_API_TIMEOUT = 8000; // 8 seconds


export const loginWithEmail = async ({ email, password }) => {
  try {
    return await axiosClient.post(
      "/auth/login",
      {
        loginType: "EMAIL",
        identifier: email,
        password,
      },
      {
        timeout: LOGIN_API_TIMEOUT, 
      }
    );
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("LOGIN_TIMEOUT");
    }
    throw error;
  }
};
