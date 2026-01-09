import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ResetPassword from "./ResetPassword";

// 🔹 Services
import { loginWithEmail } from "../../Services/AuthService";
import { loginValidation } from "../../Services/FormValidation";
import { getProfile } from "../../Services/ProfileService"; // ✅ Imported getProfile

// 🔹 Redux
import { useDispatch } from "react-redux";
import { setUser } from "../../features/UserSlice";
import { setJwt } from "../../features/JwtSlice";
import { setProfile, clearProfile } from "../../features/ProfileSlice"; 
import { removeJwt } from "../../features/JwtSlice";

// 🔹 JWT
import jwtDecode from "jwt-decode"; 

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState("worker"); // Default to worker
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 🔍 Live validation
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: loginValidation(field, value),
    }));
  };

  // 🔐 Final validation
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = loginValidation(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 LOGIN (JWT FLOW)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      dispatch(clearProfile());
      dispatch(removeJwt());

      // 1. Call login service
      const res = await loginWithEmail(formData);
      
      // ✅ Access JWT safely
      const token = res?.data?.jwt;

      if (!token) {
        throw new Error("Login failed: JWT not returned from backend");
      }

      // 🧠 2. Decode JWT
      const decoded = jwtDecode(token);
      const isApplicant = decoded.accountType === "APPLICANT";
      const isEmployer = decoded.accountType === "EMPLOYER";

      // 🛑 3. Role Mismatch Check
      if (isApplicant && userRole !== "worker") {
        throw new Error("This is a Worker account. Please switch to 'Worker Login'.");
      }
      if (isEmployer && userRole !== "employer") {
        throw new Error("This is an Employer account. Please switch to 'Employer Login'.");
      }

      // ✅ 4. Prepare User Object
      const userData = {
        ...decoded,
        email: decoded.sub,
      };

      // 💾 5. Save Auth Data to Redux & LocalStorage
      dispatch(setJwt(token));
      dispatch(setUser(userData));
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔍 6. Fetch Full Profile Separately using profileId from Token
      if (decoded.profileId) {
        try {
          const fullProfileData = await getProfile(decoded.profileId);
          if (fullProfileData) {
            dispatch(setProfile(fullProfileData));
            localStorage.setItem("profile", JSON.stringify(fullProfileData));
          }
        } catch (profileErr) {
          console.error("Failed to fetch full profile details:", profileErr);
          // Fallback: If fetch fails, profile remains empty or you can set basic userData
        }
      }

      // 🔀 7. Redirect by role
      if (isApplicant) {
        navigate("/worker-profile");
      } else if (isEmployer) {
        navigate("/employer-dashboard");
      }

    } catch (err) {
      console.error("❌ Login failed:", err);
      alert(err.message || err?.response?.data?.errorMessage || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Switch role
  const handleRoleSwitch = () => {
    setUserRole((prev) => (prev === "worker" ? "employer" : "worker"));
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-lg animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Icon
                name={userRole === "worker" ? "Hammer" : "Building2"}
                size={32}
                color="#fff"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Sign in to your {userRole} account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setIsResetModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            <ResetPassword
              opened={isResetModalOpen}
              close={() => setIsResetModalOpen(false)}
            />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue as
                </span>
              </div>
            </div>

            {/* Role Switch */}
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

            {/* Signup */}
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
    </div>
  );
};

export default Login;