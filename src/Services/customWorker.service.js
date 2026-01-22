import axiosInstance from "../Interceptor/AxiosInterceptor";

export const createWorker = async (payload) => {
  const res = await axiosInstance.post("/hr/workers/create", payload);
  return res.data;
};
