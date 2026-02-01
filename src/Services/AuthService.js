import axiosInstance from "../Interceptor/AxiosInterceptor";

const LOGIN_API_TIMEOUT = 9000;

/**
 * EMAIL LOGIN
 * Backend sets refreshToken cookie automatically
 * Returns accessToken ONLY
 */
export const loginWithEmail = async ({ email, password }) => {
  try {
    const res = await axiosInstance.post(
      "/auth/login",
      {
        loginType: "EMAIL",
        identifier: email,
        password,
      },
      {
        timeout: LOGIN_API_TIMEOUT,
        withCredentials: true, // 🔥 REQUIRED FOR COOKIE
      }
    );

    return res.data; // { accessToken, expiresIn }
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("LOGIN_TIMEOUT");
    }
    throw error;
  }
};

/**
 * REFRESH ACCESS TOKEN (silent)
 * Uses HttpOnly cookie automatically
 */
export const refreshAccessToken = async () => {
  const res = await axiosInstance.post(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
  return res.data.accessToken;
};

/**
 * LOGOUT
 * Clears refresh cookie on backend
 */
export const logout = async () => {
  await axiosInstance.post(
    "/auth/logout",
    {},
    { withCredentials: true }
  );
};

  export const bootstrapAuth = () => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/auth/refresh");
    dispatch(setJwt(res.data.accessToken));
  } catch {
    dispatch(removeJwt());
  } finally {
    dispatch(setAuthReady(true)); // 🔓 CRITICAL
  }
};