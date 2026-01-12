import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   Worker Signup
========================= */
const signupWorker = async (data) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    phoneNumber: data.phoneNumber,
    accountType: data.accountType,
    authProvider: "PASSWORD", // ✅ Add this to match your Backend Enum
  };

  return axiosInstance
    .post("/users/register", payload)
    .then((result) => result) // Return the whole result or result.data
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
    phoneNumber: data.phoneNumber,
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

/* =========================
   Phone Verification (New)
========================= */

/**
 * 1. Request an OTP to be sent to the phone number
 */
// const sendPhoneOtp = async (phoneNumber) => {
//   return axiosInstance
//     .post(`/users/send-phone-otp/${phoneNumber}`)
//     .then((result) => result.data)
//     .catch((error) => {
//       throw error;
//     });
// };

/**
 * 2. Verify OTP and automatically update the user's profile
 * This calls your new /verify-phone endpoint which performs:
 * verifyOtp() -> updatePhoneNumber() in one go.
 */
// const verifyAndSavePhone = async (userId, phoneNumber, otp) => {
//   return axiosInstance
//     .post(`/users/verify-phone/${userId}/${phoneNumber}/${otp}`)
//     .then((result) => result.data)
//     .catch((error) => {
//       throw error;
//     });
// };
export const saveVerifiedPhone = async (firebaseToken) => {
  return axiosInstance.post(
    "/auth/firebase-link-phone",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    }
  );
};



export {
  signupWorker,
  signupEmployer,
  loginWithEmail,
  sendOtp, // Email OTP
  verifyOtp, // Email OTP
  resetPassword,
  // sendPhoneOtp, 
  // verifyAndSavePhone, 
};

// export {
//   signupWorker,
//   signupEmployer,
//   loginWithEmail,
//   sendOtp,
//   verifyOtp,
//   resetPassword,
// };
