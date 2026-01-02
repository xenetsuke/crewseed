import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { signupWorker } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation"; 
import { useDispatch } from "react-redux";
import { setJwt } from "../../features/JwtSlice";
import { setUser } from "../../features/UserSlice";
import jwtDecode from "jwt-decode";
import { loginWithEmail } from "../../Services/AuthService";

const WorkerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "APPLICANT",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
      newErrors.agreeToTerms = "You must agree to terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // 1️⃣ Signup worker
      // This sends the data to your Spring Boot backend to save the user
      await signupWorker({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: "APPLICANT",
      });

      // 🚀 FIX: Race Condition Handling
      // We add a 500ms delay because sometimes the backend database transaction 
      // hasn't fully committed when the login request (Step 2) arrives, 
      // which causes the "USER_NOT_FOUND" error.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 2️⃣ Auto-login
      // Now that the user is saved, we fetch the JWT token
      const loginRes = await loginWithEmail({
        email: formData.email,
        password: formData.password,
      });

      const token = loginRes?.data?.jwt;
      if (!token) {
        throw new Error("JWT not returned after login");
      }

      // 3️⃣ Save JWT to Redux and LocalStorage
      dispatch(setJwt(token));
      localStorage.setItem("token", token);
      localStorage.setItem("accountType", "APPLICANT");

      // 4️⃣ Decode JWT & save user data to Redux
      const decoded = jwtDecode(token);
      dispatch(
        setUser({
          ...decoded,
          email: decoded.sub,
        })
      );

      // 5️⃣ Redirect to profile setup
      navigate("/worker-profile-setup", { replace: true });

    } catch (err) {
      console.error("Signup failed:", err);
      
      // Better error handling for the user
      const backendError = err?.response?.data?.message || err?.response?.data?.errorMessage;
      
      if (backendError?.includes("USER_NOT_FOUND")) {
        alert("Account created successfully! Please log in manually.");
        navigate("/login");
      } else {
        alert(backendError || err.message || "Signup failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              error={errors.confirmPassword}
              required
            />

            <Checkbox
              label="I agree to Terms & Privacy Policy"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                handleInputChange("agreeToTerms", e.target.checked)
              }
              error={errors.agreeToTerms}
            />

            <Button type="submit" fullWidth loading={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkerSignup;