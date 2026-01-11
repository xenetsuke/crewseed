import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 🔹 Lucide Icons
import { 
  Hammer, 
  Building2, 
  Mail, 
  Phone, 
  Chrome, 
  ArrowRight, 
  ShieldCheck,
  Loader2
} from "lucide-react";

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

const formatPhoneNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 10) return "+91" + cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return "+" + cleaned;
  return null;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("worker");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [loginMethod, setLoginMethod] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      } catch (e) {
        console.error("❌ reCAPTCHA creation failed:", e);
      }
    }
  }, []);

  const handlePostLogin = async (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    dispatch(setJwt(token));
    dispatch(setUser(decoded));

    if (!decoded.profileId) {
      if (decoded.accountType === "APPLICANT") {
        navigate("/worker-profile-setup");
      } else {
        navigate("/company-onboarding");
      }
      return;
    }

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
        window.recaptchaVerifier
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
      if (res?.data?.jwt) {
        await handlePostLogin(res.data.jwt, res.data.isNewUser);
      }
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
    setIsAnimating(true);
    setTimeout(() => {
      setUserRole((prev) => (prev === "worker" ? "employer" : "worker"));
      setFormData({ email: "", password: "" });
      setErrors({});
      setIsAnimating(false);
    }, 600); // Slightly longer to accommodate both flip and ash effects
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 py-8 overflow-hidden relative" style={{ perspective: "1000px" }}>
      
      {/* 🔹 Ash + Flip Effect CSS */}
      <style>
        {`
          @keyframes ashFlipOut {
            0% { 
              opacity: 1; 
              filter: blur(0px); 
              transform: rotateY(0deg) scale(1); 
            }
            100% { 
              opacity: 0; 
              filter: blur(15px); 
              transform: rotateY(180deg) translateY(-40px) scale(0.9); 
            }
          }
          .animate-ash-flip {
            animation: ashFlipOut 0.6s forwards cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
        `}
      </style>

      {/* Dynamic Animated Background Blobs */}
      <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-blue-200" : "bg-teal-200"}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-indigo-100" : "bg-cyan-100"}`} />

      <div className={`w-full max-w-md relative z-10 transition-all duration-500 ${loading ? "scale-[0.98] opacity-90" : "scale-100 opacity-100"}`}>
        
        <div className={`
          bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white 
          transition-transform duration-500
          ${isAnimating ? "animate-ash-flip" : "opacity-100"}
          ${loading ? "ring-2 ring-blue-400 ring-offset-2 animate-pulse" : "ring-1 ring-black/5"}
        `}>
          
          <div className="flex flex-col items-center mb-6">
            <div className={`
              relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700 transform hover:rotate-12 hover:scale-110
              bg-gradient-to-br ${userRole === "worker" ? "from-blue-600 to-indigo-600 shadow-blue-200" : "from-teal-500 to-cyan-600 shadow-teal-200"}
              ${loading ? "animate-bounce" : ""}
            `}>
              {userRole === "worker" ? (
                <Hammer size={38} color="#fff" strokeWidth={1.5} />
              ) : (
                <Building2 size={38} color="#fff" strokeWidth={1.5} />
              )}
              {loading && (
                <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-ping" />
              )}
            </div>

            <h1 className="text-3xl font-black text-slate-800 mt-5 tracking-tight">
              {loading ? "Verifying..." : "Welcome Back"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Sign in to your <span className={`font-bold capitalize transition-colors ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>{userRole}</span> account
            </p>
          </div>

          <form
            onSubmit={loginMethod === "email" ? handleSubmit : (e) => e.preventDefault()}
            className="space-y-4"
          >
            {/* Main Login Inputs */}
            {loginMethod === "email" ? (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-white/50"
                />
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  error={errors.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="bg-white/50"
                />
                <Button 
                  type="submit" 
                  fullWidth 
                  loading={loading} 
                  className={`py-3 transition-all duration-300 transform active:scale-95 shadow-xl ${userRole === "worker" ? "shadow-blue-100" : "shadow-teal-100"}`}
                >
                  {loading ? "Please wait..." : "Sign In"}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {!showOtpField ? (
                  <>
                    <div className="relative group">
                      <span className="absolute left-4 top-[38px] text-gray-500 font-bold z-10 text-sm group-focus-within:text-blue-600 transition-colors">
                        +91
                      </span>
                      <Input
                        label="Phone Number"
                        placeholder="9876543210"
                        value={phoneNumber}
                        style={{ paddingLeft: "48px" }}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button
                      id="phone-otp-btn"
                      fullWidth
                      onClick={handleSendOtp}
                      loading={loading}
                      className="py-3"
                    >
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                       <Input
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center tracking-[0.5em] font-black text-xl"
                      />
                      {loading && <Loader2 className="absolute right-4 bottom-3 animate-spin text-blue-500" size={20} />}
                    </div>
                    <Button
                      fullWidth
                      onClick={handleVerifyOtp}
                      loading={loading}
                      className="py-3 font-bold"
                    >
                      Verify & Login
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-blue-600 w-full text-center hover:underline font-bold"
                      onClick={() => setShowOtpField(false)}
                    >
                      Change Phone Number
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Forgot Password and Register */}
            <div className="flex flex-col items-center space-y-3">
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-blue-600 transition-colors font-semibold"
                onClick={() => setIsResetModalOpen(true)}
              >
                Forgot Password?
              </button>

              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate(userRole === "worker" ? "/worker-signup" : "/employer-signup")
                  }
                  className={`font-black hover:underline transition-colors ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}
                >
                  Register Now
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white/80 px-4 text-slate-400 font-black tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Alternative Login Methods */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={loading}
                className="border-slate-100 bg-white/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all h-11"
              >
                <div className="flex items-center justify-center gap-2">
                  <Chrome size={18} className="text-red-500" />
                  <span className="text-xs font-bold text-slate-600">Google</span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => {
                  setLoginMethod(loginMethod === "email" ? "phone" : "email");
                  setShowOtpField(false);
                }}
                disabled={loading}
                className="border-slate-100 bg-white/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all h-11"
              >
                <div className="flex items-center justify-center gap-2">
                  {loginMethod === "email" ? (
                    <><Phone size={18} className="text-blue-500" /><span className="text-xs font-bold text-slate-600">Phone</span></>
                  ) : (
                    <><Mail size={18} className="text-blue-500" /><span className="text-xs font-bold text-slate-600">Email</span></>
                  )}
                </div>
              </Button>
            </div>

            {/* Role Switcher */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRoleSwitch}
                className="w-full group relative flex items-center justify-center gap-3 p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-500 group-hover:rotate-12 ${userRole === "worker" ? "bg-teal-50 text-teal-600" : "bg-blue-50 text-blue-600"}`}>
                   {userRole === "worker" ? <Building2 size={18} /> : <Hammer size={18} />}
                </div>
                <span className="font-bold text-xs text-slate-600 group-hover:text-slate-900">
                  Switch to {userRole === "worker" ? "Employer" : "Worker"}
                </span>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <ResetPassword
        opened={isResetModalOpen}
        close={() => setIsResetModalOpen(false)}
      />

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;