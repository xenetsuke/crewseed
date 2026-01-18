import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   Employer Dashboard Stats
========================= */
export const getEmployerDashboardStats = async () => {
  return axiosInstance
    .get("/employer/dashboard/stats")
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
