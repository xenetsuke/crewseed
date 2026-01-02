import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   Worker Signup
========================= */
const signupWorker = async (data) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    accountType: "APPLICANT",
  };

  return axiosInstance
    .post("/users/register", payload)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Employer Signup
========================= */
const signupEmployer = async (data) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    accountType: data.accountType, // EMPLOYER
  };

  return axiosInstance
    .post("/users/register", payload)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Login (Email)
========================= */
const loginWithEmail = async (data) => {
  return axiosInstance
    .post("/users/login", data)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Send OTP (Email-based)
========================= */
const sendOtp = async (email) => {
  return axiosInstance
    .post(`/users/sendOtp/${email}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Verify OTP
========================= */
const verifyOtp = async (email, otp) => {
  return axiosInstance
    .get(`/users/verifyOtp/${email}/${otp}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Reset Password
========================= */
const resetPassword = async (email, password) => {
  return axiosInstance
    .post("/users/changePass", { email, password })
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export {
  signupWorker,
  signupEmployer,
  loginWithEmail,
  sendOtp,
  verifyOtp,
  resetPassword,
};
