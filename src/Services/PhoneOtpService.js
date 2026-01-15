import axios from "./AxiosInterceptor";

export const sendPhoneOtp = (phone) =>
  axios.post(`/auth/phone/send?phone=${phone}`);

export const verifyPhoneOtp = (phone, otp) =>
  axios.post(`/auth/phone/verify?phone=${phone}&otp=${otp}`);
