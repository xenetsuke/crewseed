import axiosInstance from "../Interceptor/AxiosInterceptor";

export const createCustomJob = (payload) =>
  axiosInstance.post("/hr/custom-job/create", payload);

export const editCustomJob = (employerId, jobId, payload) =>
  axiosInstance.put(`/hr/custom-job/edit/${jobId}`, {
    employerId,
    ...payload,
  });
