import React, { useState, useEffect } from "react";
import { applyJob } from "../Services/JobService";
import { useSelector } from "react-redux";
import {
  X,
  Edit2,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const JobApplicationModal = ({ isOpen, onClose, jobData, onSubmit }) => {
  // 📌 Selectors to get data from Redux
  const backendProfile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  // 📌 Component State
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 🛠 EFFECT: AUTO-FILL LOGIC
   */
  useEffect(() => {
    if (isOpen) {
      if (backendProfile && Object.keys(backendProfile).length > 0) {
        const prof = backendProfile?.professionalInfo || {};
        const docs = backendProfile?.documents || {};
        const history = backendProfile?.workHistory || {};

        const filledData = {
          fullName: backendProfile?.fullName || "",
          phone: backendProfile?.primaryPhone || "",
          alternatePhone: backendProfile?.alternatePhone || "",
          email: backendProfile?.email || "",
          address: backendProfile?.address || "",
          city: backendProfile?.currentCity || "",
          state: backendProfile?.currentState || "",
          pincode: backendProfile?.pincode || "",
          primaryJobRole: backendProfile?.primaryJobRole || "",
          skills: Array.isArray(backendProfile?.skills) ? backendProfile.skills.join(", ") : "",
          experience: backendProfile?.totalExperience || "",
          education: backendProfile?.education || "",
          // expectedWage: prof?.expectedDailyWage || "",
          shiftPreference: backendProfile?.shiftPreference || "",
          aadhaarNumber: docs?.aadhaar?.number || "",
          panNumber: docs?.pan?.number || "",
          previousCompanies: history?.recentAssignments?.map((a) => a?.company)?.join(", ") || "",
          availableFrom: new Date().toISOString().split("T")[0],
          coverLetter: formData.coverLetter || "", 
        };

        setFormData(filledData);
      }
    }
  }, [isOpen, backendProfile]); 

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.fullName?.trim()) e.fullName = "Full name required";
    if (!formData.phone) e.phone = "Phone number required";
    if (!formData.address?.trim()) e.address = "Address required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    const applicantDTO = {
      applicantId: user?.id,
      name: formData.fullName || "",
      email: formData.email || "",
      phone: Number(formData.phone) || 0,
      resume: "",
      coverLetter: formData.coverLetter || "",
      timestamp: new Date().toISOString(),
      applicationStatus: "APPLIED",
    };

    await applyJob(applicantDTO, jobData?.id);

    // 🔥 pass applied applicant back
    if (onSubmit) {
      onSubmit({
        jobId: jobData?.id,
        applicant: {
          applicantId: user?.id,
          applicationStatus: "APPLIED",
        },
      });
    }

    onClose();
  } catch (err) {
    console.error("❌ Submission Error:", err);
    const msg =
      err?.response?.data?.errorMessage ||
      err?.response?.data?.message ||
      "Failed to submit application";
    setErrors({ submit: msg });
  } finally {
    setIsSubmitting(false);
  }
};


  if (!isOpen) return null;

  const renderField = (label, field, IconComp, type = "text") => {
    const value = formData[field] || "";
    const editing = isEditing[field];
    const error = errors[field];

    return (
      <div className="mb-4">
        <label className="text-sm font-medium flex gap-2 mb-1">
          <IconComp className="w-4 h-4 text-gray-500" />
          {label}
        </label>
        <div className="relative">
          {!editing ? (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center">
              <span className="text-gray-800">{value || <span className="text-gray-400 italic">Not provided</span>}</span>
              <button
                type="button"
                className="p-1 hover:bg-blue-100 rounded"
                onClick={() => setIsEditing({ ...isEditing, [field]: true })}
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type={type}
                autoFocus
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`flex-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="text-green-600 hover:text-green-700"
                onClick={() => setIsEditing({ ...isEditing, [field]: false })}
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 flex text-red-600 text-xs items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply for {jobData?.titleEn}</h2>
            <p className="text-sm text-blue-600 font-medium">{jobData?.companyEn || "Premium Employer"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-8">
            <h3 className="font-bold mb-4 flex gap-2 text-gray-800 border-b pb-2">
              <User className="w-5 h-5 text-blue-600" /> Personal Information
            </h3>
            {renderField("Full Name", "fullName", User)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Phone Number", "phone", Phone)}
              {renderField("Email Address", "email", Mail)}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 flex gap-2 text-gray-800 border-b pb-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Location Details
            </h3>
            {renderField("Full Address", "address", MapPin)}
            <div className="grid grid-cols-2 gap-4">
              {renderField("City", "city", MapPin)}
              {renderField("Pincode", "pincode", MapPin)}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 flex gap-2 text-gray-800 border-b pb-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Professional Info
            </h3>
            {renderField("Primary Job Role", "primaryJobRole", Briefcase)}
            {renderField("Skills (Comma separated)", "skills", Briefcase)}
            <div className="grid grid-cols-2 gap-4">
              {renderField("Experience (Years)", "experience", Briefcase, "number")}
            {/* //  {renderField("Expected Daily Wage", "expectedWage", Briefcase, "number")} */}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Why should we hire you? (Cover Letter)
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange("coverLetter", e.target.value)}
              placeholder="Mention your relevant experience for this specific job..."
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-4 mt-4 rounded-lg text-red-700 flex gap-2 items-center">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                Processing...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;