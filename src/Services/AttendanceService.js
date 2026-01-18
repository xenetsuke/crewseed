import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   WORKER
========================= */

export const checkIn = (assignmentId) =>
  axiosInstance.post(`/attendance/check-in/${assignmentId}`);

export const checkOut = (assignmentId) =>
  axiosInstance.post(`/attendance/check-out/${assignmentId}`);

export const uploadSitePhoto = (attendanceId, formData) =>
  axiosInstance.post(
    `/attendance/upload-photo/${attendanceId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

export const resetAttendance = (attendanceId) =>
  axiosInstance.post(`/attendance/reset/${attendanceId}`);

export const getMyAttendanceHistory = () =>
  axiosInstance.get("/attendance/my-history");

// export const approveAttendance = (attendanceId, approve, remark = "") =>
//   axiosInstance.post(
//     `/attendance/approve/${attendanceId}?approve=${approve}&remark=${remark}`
//   );

/* =========================
   EMPLOYER
========================= */

export const getAttendanceByJob = async (jobId) => {
  return axiosInstance
    .get(`/attendance/job/${jobId}`)
    .then(res => res.data);
};

export const approveAttendance = (attendanceId, approve, remark) =>
  axiosInstance.post(
    `/attendance/approve/${attendanceId}?approve=${approve}&remark=${remark || ""}`
  );
