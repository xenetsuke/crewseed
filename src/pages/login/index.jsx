import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ResetPassword from "./ResetPassword";
import {
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";
import { exchangeFirebaseToken } from "../../Services/FirebaseAuthService";

// 🔹 Services
import { loginWithEmail } from "../../Services/AuthService";
import { loginValidation } from "../../Services/FormValidation";
import { getProfile } from "../../Services/ProfileService";

// 🔹 Redux
import { useDispatch } from "react-redux";
import { setUser } from "../../features/UserSlice";
import { setJwt } from "../../features/JwtSlice";
import { setProfile, clearProfile } from "../../features/ProfileSlice";
import { removeJwt } from "../../features/JwtSlice";

// 🔹 JWT
import jwtDecode from "jwt-decode";

// 🟢 Moved Outside to Fix ReferenceErrorh
const formatPhoneNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 10) return "+91" + cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return "+" + cleaned;
  return null;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recaptchaVerifierRef = useRef(null);

  const [userRole, setUserRole] = useState("worker");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [loginMethod, setLoginMethod] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const initRecaptcha = () => {
      const btn = document.getElementById("phone-otp-btn");
      if (btn && !recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            "phone-otp-btn",
            {
              size: "invisible",
              callback: () => console.log("reCAPTCHA solved"),
            }
          );
        } catch (error) {
          console.error("reCAPTCHA init error:", error);
        }
      }
    };

    const timer = setTimeout(initRecaptcha, 500);

    return () => {
      clearTimeout(timer);
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, [loginMethod]);

const handlePostLogin = async (token) => {
  const decoded = jwtDecode(token);

  // 🔹 ADD THIS LINE: Ensure token is stored for the Axios Interceptor
  // localStorage.setItem("token", token);
  localStorage.setItem("token", JSON.stringify(token));
// localStorage.setItem("token", token);

  dispatch(setJwt(token));
  dispatch(setUser(decoded));



  // 🟢 FIRST TIME USER → NO PROFILE YET
  if (!decoded.profileId) {
    if (decoded.accountType === "APPLICANT") {
      navigate("/worker-profile-setup");
    } else {
      navigate("/company-onboarding");
    }
    return; // 🚫 STOP HERE
  }

  // 🟢 EXISTING USER → FETCH PROFILE
  const profile = await getProfile(decoded.profileId);
  dispatch(setProfile(profile));

  if (!profile.completed) {
    if (decoded.accountType === "APPLICANT") {
      navigate("/worker-profile-setup");
    } else {
      navigate("/company-onboarding");
    }
    return;
  }

  // ✅ DASHBOARD
  if (decoded.accountType === "APPLICANT") {
    navigate("/worker-profile");
  } else {
    navigate("/employer-dashboard");
  }
};


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      dispatch(clearProfile());
      dispatch(removeJwt());
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt)
        await handlePostLogin(res.data.jwt, res.data.isNewUser);
    } catch (err) {
      alert(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) return alert("Enter a valid 10-digit phone number");

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      );
      window.confirmationResult = confirmation;
      setShowOtpField(true);
      alert("OTP sent successfully");
    } catch (err) {
      alert(err.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");
    try {
      setLoading(true);
      dispatch(clearProfile());
      dispatch(removeJwt());
      const result = await window.confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt)
        await handlePostLogin(res.data.jwt, res.data.isNewUser);
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: loginValidation(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(clearProfile());
      dispatch(removeJwt());
      const res = await loginWithEmail(formData);
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt, false);
    } catch (err) {
      alert(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = () => {
    setUserRole((prev) => (prev === "worker" ? "employer" : "worker"));
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-lg animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Icon
                name={userRole === "worker" ? "Hammer" : "Building2"}
                size={32}
                color="#fff"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-6">
            Sign in to your {userRole} account
          </p>

          <form
            onSubmit={
              loginMethod === "email" ? handleSubmit : (e) => e.preventDefault()
            }
            className="space-y-4"
          >
            {loginMethod === "email" ? (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  error={errors.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                <Button type="submit" fullWidth loading={loading}>
                  Sign In
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {!showOtpField ? (
                  <>
                    <div className="relative">
                      {/* 🟢 Visually added +91 to the field */}
                      <span className="absolute left-3 top-[38px] text-gray-500 font-medium">
                        +91
                      </span>
                      <Input
                        label="Phone Number"
                        placeholder="9876543210"
                        value={phoneNumber}
                        style={{ paddingLeft: "45px" }} // Pushes text so it doesn't overlap +91
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button
                      id="phone-otp-btn"
                      fullWidth
                      onClick={handleSendOtp}
                      loading={loading}
                    >
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                      fullWidth
                      onClick={handleVerifyOtp}
                      loading={loading}
                    >
                      Verify & Login
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-primary w-full text-center"
                      onClick={() => setShowOtpField(false)}
                    >
                      Change Phone Number
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setIsResetModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or social login
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => {
                  setLoginMethod(loginMethod === "email" ? "phone" : "email");
                  setShowOtpField(false);
                }}
                disabled={loading}
              >
                {loginMethod === "email"
                  ? "Continue with Phone OTP"
                  : "Continue with Email Login"}
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Role Management
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleRoleSwitch}
              iconName={userRole === "worker" ? "Building2" : "Hammer"}
              iconPosition="left"
            >
              {userRole === "worker"
                ? "Sign in as Employer"
                : "Sign in as Worker"}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    userRole === "worker"
                      ? "/worker-signup"
                      : "/employer-signup"
                  )
                }
                className="text-primary font-medium hover:underline"
              >
                Sign up as {userRole}
              </button>
            </p>
          </form>
        </div>
      </div>
      <ResetPassword
        opened={isResetModalOpen}
        close={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default Login;
