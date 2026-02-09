import axiosInstance from "../Interceptor/AxiosInterceptor";

/* ===============================
   GET ASSIGNMENTS BY JOB
=============================== */
export const getAssignmentsByJob = async (jobId) => {
  const res = await axiosInstance.get(`/assignments/job/${jobId}`);
  return res.data;
};
export const getMyAssignments = async (workerId) => {
  const res = await axiosInstance.get(`/assignments/worker/${workerId}`);
  return res.data;
};

/* ===============================
   ADD WORKER TO JOB
=============================== */
export const addWorkerToJob = async (payload) => {
  const res = await axiosInstance.post("/assignments/add-worker", payload);
  return res.data;
};
export const getAssignmentByIdAndJob = async (
  assignmentId,
  jobId,
  workerId
) => {
  const res = await axiosInstance.get(
    `/assignments/${assignmentId}/job/${jobId}/worker/${workerId}`
  );
  return res.data;
};

/* ===============================
   UPDATE ASSIGNMENT (PROFILE STYLE ✅)
=============================== */
export const updateAssignment = async (payload) => {
  const res = await axiosInstance.put("/assignments/update", payload);
  return res.data;
};

/* ===============================
   UPDATE ASSIGNMENT STATUS
=============================== */
export const updateAssignmentStatus = async (assignmentId, status) => {
  return axiosInstance.put(
    `/assignments/${assignmentId}/status/${status}`
  );
};

/* ===============================
   UPDATE ASSIGNMENT WAGE
=============================== */
export const updateAssignmentWage = async (assignmentId, amount) => {
  return axiosInstance.put(
    `/assignments/${assignmentId}/wage/${amount}`
  );
};

/* ===============================
   REMOVE WORKER FROM JOB
=============================== */
export const removeWorkerFromJob = async (assignmentId) => {
  return axiosInstance.put(`/assignments/remove/${assignmentId}`);
};
