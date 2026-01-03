import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Settings,
  Camera,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// ✨ Redux + Services imports
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile } from "../../features/ProfileSlice";

const WorkerProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access user and profile from Redux
  const user = useSelector((state) => state.user.user || state.user || {});
  const profile = useSelector((state) => state.profile || {});

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    state: "", 
    city: "",
    address: "",

    jobRole: "",
    otherJobRole: "", 
    experienceLevel: 0,
    skills: [],

    expectedWageMin: 8000,
    expectedWageMax: 25000,
    preferredShift: [],
    availabilityStatus: true,

    aadhaarCard: null,
    panCard: null,
    photo: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;
        const backendProfile = await getProfile(user.id);
        if (backendProfile) {
          dispatch(setProfile(backendProfile));

          setFormData((prev) => ({
            ...prev,
            name: backendProfile.fullName || "",
            age: backendProfile.age || "",
            gender: backendProfile.gender || "",
            state: backendProfile.state || "", 
            city: backendProfile.currentCity || "",
            address: backendProfile.currentAddress || "",
            skills: backendProfile.skills || [],
            jobRole: backendProfile.primaryJobRole || "",
          }));
        }
      } catch (error) {
        console.error("❌ Error loading profile:", error);
      }
    };
    fetchProfile();
  }, [user, dispatch]);

  const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
  ];

  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
    "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore",
    "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  ];

  const jobRoles = [
    { id: "construction", name: "Construction Worker", icon: "🏗️" },
    { id: "delivery", name: "Delivery Partner", icon: "🚚" },
    { id: "housekeeping", name: "Housekeeping", icon: "🧹" },
    { id: "security", name: "Security Guard", icon: "🛡️" },
    { id: "driver", name: "Driver", icon: "🚗" },
    { id: "manufacturing", name: "Manufacturing", icon: "⚙️" },
    { id: "warehouse", name: "Warehouse Worker", icon: "📦" },
    { id: "electrician", name: "Electrician", icon: "⚡" },
    { id: "plumber", name: "Plumber", icon: "🔧" },
    { id: "carpenter", name: "Carpenter", icon: "🔨" },
    { id: "painter", name: "Painter", icon: "🎨" },
    { id: "cook", name: "Cook/Chef", icon: "👨‍🍳" },
    { id: "other", name: "Other", icon: "📝" },
  ];

  const skillsOptions = [
    "Heavy Lifting", "Machine Operation", "Quality Control", "Teamwork",
    "Time Management", "Safety Compliance", "Basic Computer", "Driving License",
    "First Aid", "Tool Handling", "Customer Service", "Hindi/English",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev?.skills?.includes(skill)
        ? prev?.skills?.filter((s) => s !== skill)
        : [...prev?.skills, skill],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const updatedProfile = {
        id: user.id,
        fullName: formData.name,
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender || null,
        state: formData.state || "",
        currentCity: formData.city || "",
        currentAddress: formData.address || "",
        primaryJobRole:
          formData.jobRole === "other"
            ? formData.otherJobRole
            : formData.jobRole,
        skills: formData.skills || [],
        email: profile.email || user.email || null,
      };

      const savedProfile = await updateProfile(updatedProfile);
      
      // Update local Redux state with saved data
      dispatch(setProfile(savedProfile));
      
      // ✅ Navigate to the profile page on success
      navigate("/worker-profile");
    } catch (err) {
      console.error("❌ Failed to save profile:", err);
      alert("Error saving profile. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
          <p className="text-sm text-gray-500">Tell us about yourself</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData?.name}
          onChange={(e) => handleInputChange("name", e?.target?.value)}
          required
        />

        <Input
          label="Age"
          type="number"
          placeholder="Your age"
          value={formData?.age}
          onChange={(e) => handleInputChange("age", e?.target?.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Other"]?.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleInputChange("gender", gender)}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  formData?.gender === gender
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <select
            value={formData?.state}
            onChange={(e) => handleInputChange("state", e?.target?.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your state</option>
            {indianStates?.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <select
            value={formData?.city}
            onChange={(e) => handleInputChange("city", e?.target?.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your city</option>
            {indianCities?.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={formData?.address}
            onChange={(e) => handleInputChange("address", e?.target?.value)}
            placeholder="Enter your complete address"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Professional Info</h2>
          <p className="text-sm text-gray-500">What kind of work do you do?</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Job Role *</label>
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto mb-4">
            {jobRoles?.map((role) => (
              <button
                key={role?.id}
                type="button"
                onClick={() => handleInputChange("jobRole", role?.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  formData?.jobRole === role?.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{role?.icon}</span>
                <span className="text-sm font-medium text-gray-900">{role?.name}</span>
              </button>
            ))}
          </div>

          {formData.jobRole === "other" && (
            <Input
              label="Specify Job Role"
              placeholder="e.g. Tailor, Mechanic, etc."
              value={formData.otherJobRole}
              onChange={(e) => handleInputChange("otherJobRole", e.target.value)}
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Experience Level: <span className="font-semibold text-green-600">{formData?.experienceLevel} years</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={formData?.experienceLevel}
            onChange={(e) => handleInputChange("experienceLevel", parseInt(e?.target?.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Skills (Select multiple)</label>
          <div className="flex flex-wrap gap-2">
            {skillsOptions?.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData?.skills?.includes(skill)
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {skill}
                {formData?.skills?.includes(skill) && <CheckCircle2 className="inline ml-1 w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">Upload Preferences & document Later.</p>
        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
           <Upload className="w-12 h-12 mb-2" />
           <p className="text-sm">Documents will be collected in the next phase.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">Profile Setup</h1>
            <button
              onClick={() => navigate("/worker-profile")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Setup Later
            </button>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Step {currentStep} of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex gap-3 mt-6 pb-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              variant="default"
              size="lg"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1"
            >
              Next <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              variant="success"
              size="lg"
              onClick={handleSubmit}
              loading={loading}
              className="flex-1"
            >
              Save & Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileSetup;
