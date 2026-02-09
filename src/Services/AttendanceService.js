import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   WORKER
========================= */

export const checkIn = (assignmentId) =>
  axiosInstance.post(`/attendance/check-in/${assignmentId}`);

export const checkOut = (assignmentId) =>
  axiosInstance.post(`/attendance/check-out/${assignmentId}`);

// export const uploadSitePhoto = (attendanceId, formData) =>
//   axiosInstance.post(
//     `/attendance/upload-photo/${attendanceId}`,
//     formData
//   );

export const uploadSitePhoto = (attendanceId, file) => {
  console.group("📸 [UPLOAD SITE PHOTO]");
  console.log("Attendance ID:", attendanceId);
  console.log("File:", file);
  console.log("Is File:", file instanceof File);
  console.groupEnd();

  const formData = new FormData();
  formData.append("photo", file); // ✅ MUST be File

  return axiosInstance.post(
    `/attendance/upload-photo/${attendanceId}`,
    formData
  );
};
//


// =========================
// HR – GENERATE PHOTO LINK
// =========================
export const generateAttendancePhotoLink = (attendanceId) =>
  axiosInstance.post(`/attendance/generate-upload-link/${attendanceId}`);


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


  export const updateHrPayroll = (attendanceId, payroll) => {
  return axiosInstance.post(
    `/attendance/hr-payroll/${attendanceId}`,
    payroll
  );
};
