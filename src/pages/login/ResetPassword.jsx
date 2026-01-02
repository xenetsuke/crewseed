import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, resetPassword } from "../../Services/UserService";

const ResetPassword = ({ opened, close }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");

  const [otpSending, setOtpSending] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [time, setTime] = useState(60);

  /* =========================
     Countdown Timer (same logic)
  ========================= */
  useEffect(() => {
    let timer;
    if (resendLoader && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    }
    if (time === 0) {
      setResendLoader(false);
      setTime(60);
    }
    return () => clearInterval(timer);
  }, [resendLoader, time]);

  if (!opened) return null;

  /* =========================
     Send OTP
  ========================= */
  const handleSendOtp = async () => {
    try {
      setOtpSending(true);
      await sendOtp(email);
      toast.success("OTP Sent Successfully");
      setOtpSent(true);
      setResendLoader(true);
    } catch (err) {
      toast.error(err?.response?.data?.errorMessage || "OTP Sending Failed");
    } finally {
      setOtpSending(false);
    }
  };

  /* =========================
     Change Email (reset state)
  ========================= */
  const changeEmail = () => {
    setOtpSent(false);
    setVerified(false);
    setOtp(["", "", "", "", "", ""]);
    setResendLoader(false);
    setTime(60);
  };

  /* =========================
     OTP Input Handling
  ========================= */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto verify when all digits filled
    if (newOtp.every((d) => d !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  /* =========================
     Verify OTP
  ========================= */
  const handleVerifyOTP = async (otpCode) => {
    try {
      await verifyOtp(email, otpCode);
      toast.success("OTP Verified Successfully");
      setVerified(true);
    } catch (err) {
      toast.error(err?.response?.data?.errorMessage || "OTP Verification Failed");
    }
  };

  /* =========================
     Reset Password
  ========================= */
  const handleResetPassword = async () => {
    try {
      await resetPassword(email, password);
      toast.success("Password Reset Successfully");
      close();
      changeEmail(); // cleanup
    } catch (err) {
      toast.error(err?.response?.data?.errorMessage || "Password Reset Failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        {/* =========================
            Email Input
        ========================= */}
        {!otpSent && (
          <>
            <input
              type="email"
              className="w-full border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />

            <button
              onClick={handleSendOtp}
              disabled={!email || otpSending}
              className="mt-3 bg-blue-600 text-white w-full py-2 rounded-lg"
            >
              {otpSending ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* =========================
            OTP Input
        ========================= */}
        {otpSent && !verified && (
          <>
            <p className="text-sm text-gray-600 mt-4">
              Enter OTP sent to your email
            </p>

            <div className="flex justify-between my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength={1}
                  value={digit}
                  className="w-12 h-12 border rounded-lg text-center font-bold"
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value)
                  }
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                disabled={resendLoader}
                onClick={handleSendOtp}
                className="bg-yellow-500 text-white w-full py-2 rounded-lg"
              >
                {resendLoader ? time : "Resend"}
              </button>

              <button
                onClick={changeEmail}
                className="bg-gray-300 w-full py-2 rounded-lg"
              >
                Change Email
              </button>
            </div>
          </>
        )}

        {/* =========================
            Reset Password
        ========================= */}
        {verified && (
          <>
            <input
              type="password"
              className="w-full border p-2 rounded-lg mt-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />

            <button
              onClick={handleResetPassword}
              className="mt-4 bg-indigo-600 text-white w-full py-2 rounded-lg"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Cancel */}
        <button
          className="mt-4 text-gray-600 w-full"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
