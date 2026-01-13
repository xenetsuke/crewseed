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
  CheckCircle2,
  ShieldAlert
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
import { getProfile } from "../../Services/ProfileService";

// 🔹 Redux & Notifications
import { useDispatch } from "react-redux";
import { setUser } from "../../features/UserSlice";
import { setJwt } from "../../features/JwtSlice";
import { setProfile } from "../../features/ProfileSlice";
import { removeJwt } from "../../features/JwtSlice";
import toast, { Toaster } from "react-hot-toast";
import Preloader from "../../components/Preloader";


// 🔹 JWT
import jwtDecode from "jwt-decode";

const formatPhoneNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  // If user typed 10 digits (excluding prefix), add +91
  if (cleaned.length === 10) return "+91" + cleaned;
  // If user typed 12 digits (including 91), add +
  if (cleaned.startsWith("91") && cleaned.length === 12) return "+" + cleaned;
  // If it already has +91
  if (number.startsWith("+91") && cleaned.length === 12) return number;
  return null;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [showPostLoginLoader, setShowPostLoginLoader] = useState(false);

  const [userRole, setUserRole] = useState("worker"); 
  const [loading, setLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [loginMethod, setLoginMethod] = useState("email");
  // Set default value to +91
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      } catch (e) {
        console.error("❌ reCAPTCHA failed:", e);
      }
    }
  }, []);

  const handlePostLogin = async (token) => {
  const decoded = jwtDecode(token);
  toast.dismiss();

  const isWorkerPage = userRole === "worker";
  const isApplicantAccount = decoded.accountType === "APPLICANT";

  // ❌ Role mismatch
  if ((isWorkerPage && !isApplicantAccount) || (!isWorkerPage && isApplicantAccount)) {
    dispatch(removeJwt());
    localStorage.removeItem("token");
    toast.error("Account mismatch. Please switch roles.");
    return;
  }

  // ✅ Save auth
  localStorage.setItem("token", token);
  dispatch(setJwt(token));
  dispatch(setUser(decoded));

  // 🔥 SHOW PRELOADER EXPLICITLY
  setShowPostLoginLoader(true);

  let destination;

  if (!decoded.profileId) {
    destination = isApplicantAccount
      ? "/worker-profile-setup"
      : "/company-onboarding";
  } else {
    try {
      const profile = await getProfile(decoded.profileId);
      dispatch(setProfile(profile));

      destination = !profile.completed
        ? isApplicantAccount
          ? "/worker-profile-setup"
          : "/company-onboarding"
        : isApplicantAccount
          ? "/worker-profile"
          : "/employer-dashboard";
    } catch {
      destination = isApplicantAccount
        ? "/worker-profile"
        : "/employer-dashboard";
    }
  }

  // ⏱️ KEEP LOADER FOR FULL GIF DURATION
  setTimeout(() => {
    setShowPostLoginLoader(false);
    navigate(destination);
  }, 7500);
};


  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt);
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) return toast.error("Enter a valid 10-digit number");
    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      setShowOtpField(true);
      toast.success("OTP sent!");
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt);
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginWithEmail({
        loginType: "EMAIL",
        email: formData.email,
        password: formData.password,
        role: userRole.toUpperCase()
      });
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt);
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      const newRole = userRole === "worker" ? "employer" : "worker";
      setUserRole(newRole);
      setFormData({ email: "", password: "" });
      setIsAnimating(false);
      toast.dismiss();
      toast(`Switched to ${newRole}`, {
          icon: newRole === "worker" ? '🛠️' : '🏢',
          duration: 1000
      });
    }, 300); 
  };
if (showPostLoginLoader) {
  return <Preloader />;
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 py-8 overflow-hidden relative">
      <Toaster position="top-center" />
      
      <style>
        {`
          .flip-container {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
          }
          .is-flipping {
            transform: rotateY(90deg);
            opacity: 0;
          }
        `}
      </style>

      {/* Subtle background accents aligned with preloader white */}
      <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 transition-colors duration-1000 ${userRole === "worker" ? "bg-blue-200" : "bg-teal-200"}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${userRole === "worker" ? "bg-indigo-200" : "bg-cyan-200"}`} />

      <div className="w-full max-w-md relative z-10">
        <div className={`
          bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flip-container
          ${isAnimating ? "is-flipping" : ""}
        `}>
          
          <div className="flex flex-col items-center mb-8">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
              ${userRole === "worker" ? "bg-blue-600 shadow-lg shadow-blue-100" : "bg-teal-600 shadow-lg shadow-teal-100"}
            `}>
              {userRole === "worker" ? <Hammer size={28} color="#fff" /> : <Building2 size={28} color="#fff" />}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mt-5 tracking-tight">
              {loading ? "Verifying..." : "Welcome Back"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Sign in as <span className={`font-semibold ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>{userRole}</span>
            </p>
          </div>

          <form onSubmit={loginMethod === "email" ? handleSubmit : (e) => e.preventDefault()} className="space-y-5">
            {loginMethod === "email" ? (
              <>
                <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <Button type="submit" fullWidth loading={loading} className={`py-3 rounded-xl transition-all ${userRole === "worker" ? "bg-blue-600 hover:bg-blue-700" : "bg-teal-600 hover:bg-teal-700"}`}>
                  Sign In
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {!showOtpField ? (
                  <>
                    <Input 
                      label="Phone Number" 
                      placeholder="+91 9876543210" 
                      value={phoneNumber} 
                      onChange={(e) => {
                        const val = e.target.value;
                        // Keep +91 prefix from being deleted easily
                        if (val.length < 3) {
                          setPhoneNumber("+91");
                        } else {
                          setPhoneNumber(val);
                        }
                      }} 
                    />
                    <Button fullWidth onClick={handleSendOtp} loading={loading} className={userRole === "worker" ? "bg-blue-600" : "bg-teal-600"}>Send OTP</Button>
                  </>
                ) : (
                  <>
                    <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center font-bold text-xl tracking-widest" />
                    <Button fullWidth onClick={handleVerifyOtp} loading={loading} className={userRole === "worker" ? "bg-blue-600" : "bg-teal-600"}>Verify & Login</Button>
                    <button type="button" className="text-xs text-slate-400 w-full text-center hover:text-slate-600" onClick={() => setShowOtpField(false)}>Change Number</button>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col items-center space-y-4 pt-2">
              <button type="button" className="text-sm text-slate-400 hover:text-slate-600 font-medium" onClick={() => setIsResetModalOpen(true)}>Forgot Password?</button>
              <p className="text-xs text-slate-400">
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate(userRole === "worker" ? "/worker-signup" : "/employer-signup")} className={`font-bold ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>
                  Create One
                </button>
              </p>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-3 text-slate-300 font-bold tracking-[0.2em]">Social Login</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" fullWidth onClick={handleGoogleLogin} disabled={loading} className="border-slate-100 hover:bg-slate-50 rounded-xl">
                <Chrome size={16} className="text-red-500 mr-2" /> <span className="text-xs font-bold text-slate-600">Google</span>
              </Button>
              <Button type="button" variant="outline" fullWidth onClick={() => { setLoginMethod(loginMethod === "email" ? "phone" : "email"); setShowOtpField(false); }} className="border-slate-100 hover:bg-slate-50 rounded-xl">
                {loginMethod === "email" ? <Phone size={16} className="text-blue-500 mr-2" /> : <Mail size={16} className="text-slate-500 mr-2" />}
                <span className="text-xs font-bold text-slate-600">{loginMethod === "email" ? "Phone" : "Email"}</span>
              </Button>
            </div>

            <div className="pt-4">
              <button type="button" onClick={handleRoleSwitch} disabled={isAnimating} className="w-full group flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                <span className="font-bold text-xs text-slate-500 group-hover:text-slate-700 transition-colors">Switch to {userRole === "worker" ? "Employer" : "Worker"}</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-500 transition-all" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <ResetPassword opened={isResetModalOpen} close={() => setIsResetModalOpen(false)} />
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;