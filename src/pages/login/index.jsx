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

  const [userRole, setUserRole] = useState("worker"); // "worker" or "employer"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

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

  // Centralized login success handler with accountType validation
  const handlePostLogin = async (token) => {
    const decoded = jwtDecode(token);
    toast.dismiss(); 

    // 🔹 Role Validation Logic
    const isWorkerPage = userRole === "worker";
    const isApplicantAccount = decoded.accountType === "APPLICANT";

    // Block Employer logging into Worker page and vice-versa
    if ((isWorkerPage && !isApplicantAccount) || (!isWorkerPage && isApplicantAccount)) {
      dispatch(removeJwt());
      localStorage.removeItem("token");
      
      toast.error(`This account is registered as an ${isApplicantAccount ? 'Worker' : 'Employer'}. Please switch roles to login.`, {
        icon: <ShieldAlert className="text-red-500" />,
        duration: 5000
      });
      return;
    }
    
    // 1. Storage & Redux
    localStorage.setItem("token", token);
    dispatch(setJwt(token));
    dispatch(setUser(decoded));
  setShowPostLoginLoader(true);

    toast.success(`Logged in as ${decoded.name || userRole}`, {
        icon: <CheckCircle2 className="text-green-500" />,
    });

    // 2. Profile Fetch & Navigation Logic
    if (!decoded.profileId) {
      navigate(isApplicantAccount ? "/worker-profile-setup" : "/company-onboarding");
      return;
    }

    try {
        const profile = await getProfile(decoded.profileId);
        dispatch(setProfile(profile));

        if (!profile.completed) {
            navigate(isApplicantAccount ? "/worker-profile-setup" : "/company-onboarding");
        } else {
            navigate(isApplicantAccount ? "/worker-profile" : "/employer-dashboard");
        }
    } catch (err) {
        navigate(isApplicantAccount ? "/worker-profile" : "/employer-dashboard");
    }

    setTimeout(() => {
    setShowPostLoginLoader(false);
    navigate(destination);
  }, 7500); // must match GIF length
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      dispatch(clearProfile());
      dispatch(removeJwt());
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await exchangeFirebaseToken(firebaseToken, userRole);
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt);
    } catch (err) {
      toast.error(err.message || "Google login failed");
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
      dispatch(clearProfile());
      dispatch(removeJwt());

      const payload = {
        loginType: "EMAIL",
        email: formData.email,
        password: formData.password,
        role: userRole.toUpperCase()
      };

      const res = await loginWithEmail(payload);
      if (res?.data?.jwt) await handlePostLogin(res.data.jwt);
    } catch (err) {
      toast.dismiss();
      toast.error("Invalid email or password", { icon: <AlertCircle className="text-red-500" /> });
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
      setErrors({});
      setIsAnimating(false);
      setIsSettling(true);
      
      toast.dismiss();
      toast(`Switched to ${newRole} login`, {
          icon: newRole === "worker" ? '🛠️' : '🏢',
          duration: 2000
      });

      setTimeout(() => setIsSettling(false), 800);
    }, 1200); 
  };
  if (showPostLoginLoader) {
  return <Preloader />;
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 py-8 overflow-hidden relative" style={{ perspective: "2000px" }}>
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      
      <style>
        {`
          @keyframes ashFlipOut {
            0% { opacity: 1; filter: blur(0px); transform: rotateY(0deg) scale(1); }
            100% { opacity: 0; filter: blur(25px); transform: rotateY(110deg) translateY(-60px) scale(0.85); }
          }
          @keyframes ashFlipIn {
            0% { opacity: 0; filter: blur(15px); transform: rotateY(-30deg) translateY(30px); }
            100% { opacity: 1; filter: blur(0px); transform: rotateY(0deg) translateY(0); }
          }
          .animate-ash-out { animation: ashFlipOut 1.2s forwards cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
          .animate-ash-in { animation: ashFlipIn 0.8s forwards ease-out; }
        `}
      </style>

      <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-blue-200" : "bg-teal-200"}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${userRole === "worker" ? "bg-indigo-100" : "bg-cyan-100"}`} />

      <div className="w-full max-w-md relative z-10">
        <div className={`
          bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white 
          transition-all duration-700
          ${isAnimating ? "animate-ash-out" : ""}
          ${isSettling ? "animate-ash-in" : ""}
        `}>
          
          <div className="flex flex-col items-center mb-6">
            <div className={`
              relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700
              bg-gradient-to-br ${userRole === "worker" ? "from-blue-600 to-indigo-600 shadow-blue-200" : "from-teal-500 to-cyan-600 shadow-teal-200"}
            `}>
              {userRole === "worker" ? <Hammer size={38} color="#fff" /> : <Building2 size={38} color="#fff" />}
            </div>

            <h1 className="text-3xl font-black text-slate-800 mt-5 tracking-tight">
              {loading ? "Verifying..." : "Welcome Back"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Sign in as <span className={`font-bold capitalize ${userRole === "worker" ? "text-blue-600" : "text-teal-600"}`}>{userRole}</span>
            </p>
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
                    <Button fullWidth onClick={handleSendOtp} loading={loading}>Send OTP</Button>
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
              <Button type="button" variant="outline" fullWidth onClick={handleGoogleLogin} disabled={loading} className="h-11">
                <Chrome size={18} className="text-red-500 mr-2" /> <span className="text-xs font-bold">Google</span>
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