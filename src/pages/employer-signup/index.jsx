import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { signupEmployer } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation"; // ✅ Added
import { useDispatch } from "react-redux";
import { setJwt } from "../../features/JwtSlice";
import { setUser } from "../../features/UserSlice";
import jwtDecode from "jwt-decode";
import { loginWithEmail } from "../../Services/AuthService";

 

const EmployerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "EMPLOYER",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let validationErr = signupValidation(field, value);
    setErrors((prev) => ({ ...prev, [field]: validationErr }));
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

  const dispatch = useDispatch();


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    setLoading(true);

    // 1️⃣ Signup
    await signupEmployer({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      accountType: "EMPLOYER",
    });

    // 2️⃣ Auto-login
    const loginRes = await loginWithEmail({
      email: formData.email,
      password: formData.password,
    });

    const token = loginRes?.data?.jwt;
    if (!token) throw new Error("JWT not returned after login");

    // 3️⃣ Save auth
    dispatch(setJwt(token));
    localStorage.setItem("token", token);
    localStorage.setItem("accountType", "EMPLOYER");

    const decoded = jwtDecode(token);
    dispatch(setUser({ ...decoded, email: decoded.sub }));

    // 4️⃣ Go to onboarding
    navigate("/company-onboarding", { replace: true });

  } catch (err) {
    console.error("Signup failed:", err);
    alert(err?.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Icon name="Building2" size={36} color="white" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Company Name"
              placeholder="Account Holder Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            <Input
              type="email"
              label="Company Email"
              placeholder="hr@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter password"
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
              {loading ? "Signing Up..." : "Create Employer Account"}
            </Button>

            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 underline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
