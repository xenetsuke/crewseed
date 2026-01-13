import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

// 🔹 Icons
import { Building2, Loader2, AlertCircle } from "lucide-react";

// 🔹 Components
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";

// 🔹 Services
import { signupEmployer } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation"; 
import { loginWithEmail } from "../../Services/AuthService";

// 🔹 Redux Actions
import { setJwt } from "../../features/JwtSlice";
import { setUser } from "../../features/UserSlice";

const EmployerSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "EMPLOYER",
    agreeToTerms: false,
  });

  // 🔹 Reference: Logic from Login.jsx post-login
  const handlePostSignupLogin = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    dispatch(setJwt(token));
    dispatch(setUser(decoded));

    // New accounts go straight to onboarding
    navigate("/company-onboarding", { replace: true });
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
      await signupEmployer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: "EMPLOYER",
        authProvider: "PASSWORD",
      });

      // 🚀 Step 2: Critical Wait
      // The 8080 log shows the DB is still processing when the login hits.
      // We wait 1.5 seconds before attempting the login.
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
        // If login fails with "Incorrect username/password" despite signup working,
        // it means the DB index hasn't updated. We redirect to login.
        console.warn("Auto-login race condition detected. Redirecting to manual login.");
        alert("Account created! Please log in to complete your profile.");
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
      {/* Background Blobs (Matching Login.jsx) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px] bg-teal-200 opacity-50" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px] bg-cyan-100 opacity-50" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600 shadow-2xl shadow-teal-200">
              <Building2 size={38} color="#fff" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mt-5 tracking-tight">Hire Workers</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Create an employer account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corp"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="hr@company.com"
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
              className="py-3 shadow-xl shadow-teal-100 bg-teal-600 hover:bg-teal-700 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Setting up account...
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
                  className="font-black text-teal-600 hover:underline"
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

export default EmployerSignup;