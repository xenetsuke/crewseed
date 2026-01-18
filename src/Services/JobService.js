import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   Post Job
========================= */
const postJob = async (job) => {
  return axiosInstance
    .post(`/jobs/post`, job)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Get All Jobs
========================= */
const getAllJobs = async () => {
  return axiosInstance
    .get(`/jobs/getAll`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Get Job By ID
========================= */
const getJob = async (id) => {
  return axiosInstance
    .get(`/jobs/get/${id}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Apply Job
========================= */
const applyJob = async (job, id) => {
  return axiosInstance
    .post(`/jobs/apply/${id}`, job)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Applicant Job History
========================= */
const getHistory = async (id, status) => {
  return axiosInstance
    .get(`/jobs/history/${id}/${status}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Jobs Posted By Employer
========================= */
const getJobsPostedBy = async () => {
  return axiosInstance
    .get(`/jobs/company`)
    .then(res => res.data);
};


/* =========================
   🔥 Jobs By Company (NEW)
   👉 Used for "More jobs from same company"
========================= */
const getJobsByCompany = async (companyId) => {
  return axiosInstance
    .get(`/jobs/company/${companyId}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Change Application Status
========================= */
const changeAppStatus = async (interview) => {
  return axiosInstance
    .post(`/jobs/changeAppStatus`, interview)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

const updateJobStatus = async (id, status) => {
  return axiosInstance
    .put(`/jobs/status/${id}`, { status }) // Adjust endpoint based on your Backend Controller
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Delete Job
========================= */
const deleteJob = async (id) => {
  return axiosInstance
    .delete(`/jobs/delete/${id}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export {
  postJob,
  getAllJobs,
  getJob,
  applyJob,
  getHistory,
  getJobsPostedBy,
  getJobsByCompany, // ✅ NEW (safe export)
  changeAppStatus,
  deleteJob,
  updateJobStatus, // ✅ Added for delete functionality
};