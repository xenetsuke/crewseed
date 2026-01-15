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
  Loader2,
  CheckCircle2,
  AlertCircle,
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
import Preloader from "../../components/Preloader";

// 🔹 Services
import { loginWithEmail } from "../../Services/AuthService";
import { loginValidation } from "../../Services/FormValidation";
import { getProfile } from "../../Services/ProfileService";

// 🔹 Redux & Notifications
import { useDispatch } from "react-redux";
import { setUser } from "../../features/UserSlice";
import { setJwt } from "../../features/JwtSlice";
import { setProfile, clearProfile } from "../../features/ProfileSlice";
import { removeJwt } from "../../features/JwtSlice";
import toast, { Toaster } from "react-hot-toast";

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
  const [showPostLoginLoader, setShowPostLoginLoader] = useState(false);

  const [userRole, setUserRole] = useState("worker");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Animation States
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  // Login Method States
  const [loginMethod, setLoginMethod] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  
  // ✅ OTP Cooldown State
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ 1. Initialize ReCAPTCHA only once (Singleton Pattern)
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { 
            size: "invisible",
            callback: () => {
              // ReCAPTCHA solved
            },
            "expired-callback": () => {
              toast.error("Captcha expired. Please try again.");
              if(window.recaptchaVerifier) {
                  window.recaptchaVerifier.render().then(widgetId => {
                      window.grecaptcha.reset(widgetId);
                  });
              }
            }
          }
        );
      } catch (e) {
        console.error("❌ reCAPTCHA creation failed:", e);
      }
    }
  }, []);

  // ✅ 2. OTP Cooldown Timer Effect
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handlePostLogin = async (token) => {
    setShowPostLoginLoader(true);
    try {
      await new Promise((r) => requestAnimationFrame(r));

      const decoded = jwtDecode(token);
      toast.dismiss();

      const isWorkerPage = userRole === "worker";
      const isApplicantAccount = decoded.accountType === "APPLICANT";

      if ((isWorkerPage && !isApplicantAccount) || (!isWorkerPage && isApplicantAccount)) {
        dispatch(removeJwt());
        localStorage.removeItem("token");
        
        // ✅ CLOSE BOTH LOADERS ON ERROR NOTIFICATION
        setShowPostLoginLoader(false);
        setLoading(false);

        toast.error(
          `This account is registered as an ${isApplicantAccount ? "Worker" : "Employer"}. Please switch roles.`,
          { icon: <ShieldAlert className="text-red-500" /> }
        );
        return;
      }

      localStorage.setItem("token", token);
      dispatch(setJwt(token));
      dispatch(setUser(decoded));

      let destination;

      if (!decoded.profileId) {
        destination = isApplicantAccount ? "/worker-profile-setup" : "/company-onboarding";
      } else {
        try {
          const profile = await getProfile(decoded.profileId);
          dispatch(setProfile(profile));
          destination = !profile.completed
            ? (isApplicantAccount ? "/worker-profile-setup" : "/company-onboarding")
            : (isApplicantAccount ? "/worker-profile" : "/employer-dashboard");
        } catch {
          destination = isApplicantAccount ? "/worker-profile" : "/employer-dashboard";
        }
      }

      navigate(destination);
    } catch (err) {
      setShowPostLoginLoader(false);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      dispatch(clearProfile());
      dispatch(removeJwt());
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt) {
        await handlePostLogin(res.data.jwt);
      } else {
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message || "Google login failed");
      setLoading(false); 
    } 
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      toast.error("Enter a valid number");
      return;
    }

    setLoading(true);

    try {
      if (!window.recaptchaVerifier) {
         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      setShowOtpField(true);
      setCooldown(60);
      toast.success("OTP sent!");
    } catch (err) {
      console.error(err);
      if (window.recaptchaVerifier) {
        try {
          const widgetId = await window.recaptchaVerifier.render();
          window.grecaptcha.reset(widgetId);
        } catch (resetError) {
          console.error("Failed to reset captcha", resetError);
        }
      }

      if (err.code === 'auth/too-many-requests') {
        setCooldown(60);
        toast.error("Too many attempts. Please wait a minute.");
      } else {
        toast.error("Failed to send OTP. Refresh and try again.");
      }
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
      if (res?.data?.jwt) {
        await handlePostLogin(res.data.jwt);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(clearProfile());
      dispatch(removeJwt());
      const res = await loginWithEmail({
        loginType: "EMAIL",
        email: formData.email,
        password: formData.password,
        role: userRole.toUpperCase(),
      });
      if (res?.data?.jwt) {
        await handlePostLogin(res.data.jwt);
      } else {
        setLoading(false);
      }
    } catch (err) {
      toast.error("Invalid email or password");
      setLoading(false); 
    } 
  };

  const handleRoleSwitch = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setUserRole((p) => (p === "worker" ? "employer" : "worker"));
      setFormData({ email: "", password: "" });
      setIsAnimating(false);
      setIsSettling(true);
      setTimeout(() => setIsSettling(false), 400);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 py-8 overflow-hidden relative">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      
      {(loading || showPostLoginLoader) && <Preloader />}

      <style>
        {`
          @keyframes flipOut2D {
            0% { opacity: 1; transform: rotateY(0deg); }
            100% { opacity: 0; transform: rotateY(90deg); }
          }
          @keyframes flipIn2D {
            0% { opacity: 0; transform: rotateY(-90deg); }
            100% { opacity: 1; transform: rotateY(0deg); }
          }
          .animate-flip-out { animation: flipOut2D 0.4s forwards ease-in; pointer-events: none; }
          .animate-flip-in { animation: flipIn2D 0.4s forwards ease-out; }
        `}
      </style>

      <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-blue-200" : "bg-teal-200"}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-indigo-100" : "bg-cyan-100"}`} />

      <div className="w-full max-w-md relative z-10">
        <div className={`
          bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white 
          ${isAnimating ? "animate-flip-out" : ""}
          ${isSettling ? "animate-flip-in" : ""}
        `}>
          
          <div className="flex flex-col items-center mb-6">
            <div className={`
              relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700
              bg-gradient-to-br ${userRole === "worker" ? "from-blue-600 to-indigo-600 shadow-blue-200" : "from-teal-500 to-cyan-600 shadow-teal-200"}
            `}>
              {userRole === "worker" ? <Hammer size={38} color="#fff" /> : <Building2 size={38} color="#fff" />}
            </div>

            <h1 className="text-3xl font-black text-slate-800 mt-5 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Sign in as <span className={`font-bold capitalize ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>{userRole}</span>
            </p>
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-pulse">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-[13px] font-bold text-red-700 leading-tight">Important Notice</p>
              <p className="text-[11px] text-red-600 font-medium mt-1">
For the fastest and most reliable experience, we recommend using <span className="font-bold">Google mail Login</span>.              </p>
            </div>
          </div>

          <form onSubmit={loginMethod === "email" ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
            {loginMethod === "email" ? (
              <>
                <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <Button type="submit" fullWidth loading={loading} className={`py-3 shadow-xl ${userRole === "worker" ? "shadow-blue-100" : "shadow-teal-100"}`}>
                  Sign In
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {!showOtpField ? (
                  <>
                    <div className="relative">
                      <span className="absolute left-4 top-[38px] text-gray-500 font-bold z-10 text-sm">+91</span>
                      <Input label="Phone Number" placeholder="9876543210" value={phoneNumber} style={{ paddingLeft: "48px" }} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <Button 
                      fullWidth 
                      onClick={handleSendOtp} 
                      loading={loading}
                      disabled={cooldown > 0 || loading}
                    >
                      {cooldown > 0 ? `Retry in ${cooldown}s` : "Send OTP"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center tracking-[0.5em] font-black text-xl" />
                    <Button fullWidth onClick={handleVerifyOtp} loading={loading}>Verify & Login</Button>
                    <button type="button" className="text-xs text-blue-600 w-full text-center font-bold" onClick={() => setShowOtpField(false)}>Change Number</button>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col items-center space-y-3">
              <button type="button" className="text-sm text-slate-400 hover:text-blue-600 font-semibold" onClick={() => setIsResetModalOpen(true)}>Forgot Password?</button>
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate(userRole === "worker" ? "/worker-signup" : "/employer-signup")} className={`font-black hover:underline ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>
                  Sign up as {userRole}
                </button>
              </p>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white/80 px-4 text-slate-400 font-black tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" fullWidth onClick={handleGoogleLogin} disabled={loading} className="h-11 border-red-100 hover:bg-red-50">
                <Chrome size={18} className="text-red-500 mr-2" /> <span className="text-xs font-bold text-slate-700">Google</span>
              </Button>
              <Button type="button" variant="outline" fullWidth onClick={() => { setLoginMethod(loginMethod === "email" ? "phone" : "email"); setShowOtpField(false); }} className="h-11">
                {loginMethod === "email" ? <Phone size={18} className="text-blue-500 mr-2" /> : <Mail size={18} className="text-blue-500 mr-2" />}
                <span className="text-xs font-bold">{loginMethod === "email" ? "Phone" : "Email"}</span>
              </Button>
            </div>

            <div className="pt-2">
              <button type="button" onClick={handleRoleSwitch} disabled={isAnimating} className="w-full group flex items-center justify-center gap-3 p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all">
                <div className={`p-1.5 rounded-xl ${userRole === "worker" ? "bg-teal-50 text-teal-600" : "bg-blue-50 text-blue-600"}`}>
                   {userRole === "worker" ? <Building2 size={18} /> : <Hammer size={18} />}
                </div>
                <span className="font-bold text-xs text-slate-600">Switch to {userRole === "worker" ? "Employer" : "Worker"}</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
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
