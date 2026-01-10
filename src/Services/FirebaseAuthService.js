import axiosInstance from "../Interceptor/AxiosInterceptor";

export const exchangeFirebaseToken = (firebaseToken, role) => {
  return axiosInstance.post(
    "/auth/firebase-login",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
        "X-USER-ROLE": role,
      },
    }
  );
};
