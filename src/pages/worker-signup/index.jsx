import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

// 🔹 Icons
import { User, Loader2 } from "lucide-react";

// 🔹 Components
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";

// 🔹 Services
import { signupWorker } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation"; 
import { loginWithEmail } from "../../Services/AuthService";

// 🔹 Redux Actions
import { setJwt } from "../../features/JwtSlice";
import { setUser } from "../../features/UserSlice";

const WorkerSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "APPLICANT",
    agreeToTerms: false,
  });

  // 🔹 Logic to handle Redux and Storage after successful login/signup
  const handlePostSignupLogin = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("accountType", "APPLICANT");
    
    dispatch(setJwt(token));
    
    // Construct complete user object for Redux
    const completeUserData = {
      ...decoded,
      email: decoded.sub || formData.email,
      name: formData.name,
      accountType: "APPLICANT",
    };
    
    dispatch(setUser(completeUserData));

    // Redirect to worker-specific onboarding
    navigate("/worker-profile-setup", { replace: true });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const validationError = signupValidation(field, value);
    setErrors((prev) => ({ ...prev, [field]: validationError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const validationError = signupValidation(field, formData[field]);
      if (validationError) newErrors[field] = validationError;
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to Terms & Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // 1️⃣ Step 1: Create Account
      await signupWorker({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: "APPLICANT",
        authProvider: "PASSWORD",
      });

      // 🚀 Step 2: Critical Wait (Ensures DB index is updated)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2️⃣ Step 3: Auto-login Attempt
      try {
        const res = await loginWithEmail({
          email: formData.email,
          password: formData.password,
        });

        if (res?.data?.jwt) {
          handlePostSignupLogin(res.data.jwt);
        }
      } catch (loginErr) {
        // Handle race condition where DB isn't ready for login yet
        console.warn("Auto-login race condition. Redirecting to manual login.");
        alert("Account created! Please log in to set up your profile.");
        navigate("/login", { state: { email: formData.email } });
      }

    } catch (err) {
      console.error("Signup failed:", err);
      const msg = err?.response?.data?.message || "An error occurred during signup.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px] bg-blue-200 opacity-50" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px] bg-indigo-100 opacity-50" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-200">
              <User size={38} color="#fff" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mt-5 tracking-tight">Join as Worker</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Start your career journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Akash Kumar"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="akash@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Checkbox
              label="I agree to Terms & Privacy Policy"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
              error={errors.agreeToTerms}
            />

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              className="py-3 shadow-xl shadow-blue-100 bg-blue-600 hover:bg-blue-700 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => navigate("/login")} 
                  className="font-black text-blue-600 hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkerSignup;