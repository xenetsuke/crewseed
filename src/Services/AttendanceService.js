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

export const uploadSitePhoto = async (attendanceId, file) => {
  console.group("📸 [UPLOAD SITE PHOTO]");
  console.log("Attendance ID:", attendanceId);
  console.log("File object:", file);
  console.log("File name:", file?.name);
  console.log("File size (KB):", file?.size / 1024);
  console.log("File type:", file?.type);
  console.log("Is File instance:", file instanceof File);

  const formData = new FormData();
  formData.append("photo", file);

  // 🔍 inspect FormData (VERY IMPORTANT)
  for (const pair of formData.entries()) {
    console.log("FormData entry:", pair[0], pair[1]);
  }

  console.log("Axios baseURL:", axiosInstance.defaults.baseURL);
  console.log("JWT present:", !!localStorage.getItem("token"));

  console.groupEnd();

  return axiosInstance.post(
    `/attendance/upload-photo/${attendanceId}`,
    formData,
    {
      withCredentials: false, // 🔥 keep this
      headers: {
        "Content-Type": undefined, // 🔥 keep this
      },
    }
  );
};



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
