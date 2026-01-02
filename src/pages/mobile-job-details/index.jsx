import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { getProfile, updateProfile } from "../../Services/ProfileService"; 
import { setProfile, changeProfile } from "../../features/ProfileSlice"; 
import {
  MapPin,
  Clock,
  IndianRupee,
  ChevronLeft,
  Share2,
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Home,
  Utensils,
  Bus,
  Award,
  FileText,
  Star,
  BadgeCheck,
  MapPinned,
  ShieldCheck,
  Shirt,
  HeartPulse
} from "lucide-react";

import { getJob, getJobsByCompany } from "../../Services/JobService"; 
import JobApplicationModal from "../../components/JobApplicationModal";
import ApplyNowButton from "../../components/ApplyNowButton";

const MobileJobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);
  
  const [companyJobs, setCompanyJobs] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); 
  
  const searchParams = new URLSearchParams(location.search);
  const jobIdFromQuery = searchParams.get("id");
  const jobIdFromState = location?.state?.assignmentId;
  const jobId = jobIdFromState || jobIdFromQuery;

  const isBookmarked = profile?.savedJobs?.includes(jobId);

  const handleSaveJob = async () => {
    if (!profile?.id || !jobId) return;
    try {
      let savedJobs = profile.savedJobs ? [...profile.savedJobs] : [];
      savedJobs = savedJobs.includes(jobId)
        ? savedJobs.filter((id) => id !== jobId)
        : [...savedJobs, jobId];

      const updatedProfile = { ...profile, savedJobs };
      await updateProfile(updatedProfile);
      dispatch(changeProfile(updatedProfile));
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const workerProfile = {
    name: profile?.fullName || "User",
    email: profile?.email || "",
    phone: profile?.primaryPhone || "",
    professionalInfo: {
      primaryRole: profile?.primaryJobRole || "Worker",
      yearsExperience: profile?.professionalInfo?.yearsExperience || 0,
      education: profile?.professionalInfo?.education || "Not Specified",
    },
  };

  const handleShare = () => {
    if (!jobData) return;
    if (navigator.share) {
      navigator.share({
        title: jobData.titleEn,
        text: `${jobData.companyEn} - ₹${jobData.wage.amount}/${jobData.wage.typeEn}`,
        url: window.location?.href,
      });
    }
  };

  const mapJobToMobile = (res) => {
    if (!res) return null;

    const userApp = res.applicants?.find(app => String(app.applicantId) === String(user?.id));
    setHasApplied(!!(userApp || res.hasAppliedByUser || res.appliedStatus === "APPLIED"));

    const employerFromBackend = res.employer;
    const employer = employerFromBackend
      ? {
          id: employerFromBackend.id,
          nameEn: employerFromBackend.companyName || "Company Name",
          logo: employerFromBackend.picture
            ? `data:image/jpeg;base64,${employerFromBackend.picture}`
            : "https://img.rocket.new/generatedImages/rocket_default_company.png",
          established: employerFromBackend.establishedYear || "2015",
          employees: employerFromBackend.totalEmployees ? `${employerFromBackend.totalEmployees}+` : "200+",
          rating: employerFromBackend.rating || 4.3,
          paymentReliability: employerFromBackend.paymentReliability || 95,
          reviews: employerFromBackend.reviews || [],
        }
      : {
          nameEn: "ABC Logistics Pvt Ltd",
          logo: "https://via.placeholder.com/80x80?text=Logo",
          established: "2015",
          employees: "200+",
          rating: 4.3,
          paymentReliability: 95,
          reviews: [],
        };

    const fullLocation = res.fullWorkAddress || [res.city, res.state, res.pincode].filter(Boolean).join(", ") || "Location not provided";

    const benefits = [
      res.transportProvided && { icon: Bus, labelEn: res.transportDetails || "Free Transport", available: true },
      res.foodProvided && { icon: Utensils, labelEn: res.foodDetails || "Meals Provided", available: true },
      res.accommodationProvided && { icon: Home, labelEn: res.accommodationDetails || "Accommodation", available: true },
      res.performanceIncentives && { icon: TrendingUp, labelEn: "Performance Incentives", available: true },
      res.uniformProvided && { icon: Shirt, labelEn: "Uniform Provided", available: true },
      res.medicalInsurance && { icon: HeartPulse, labelEn: "Medical Insurance", available: true },
      res.esiPfBenefits && { icon: ShieldCheck, labelEn: "ESI & PF Benefits", available: true },
      res.festivalBonuses && { icon: Award, labelEn: "Festival Bonuses", available: true },
    ].filter(Boolean);

    return {
      id: res.id,
      postedBy: res.postedBy,
      titleEn: res.jobTitle || "Job Title",
      companyEn: employer.nameEn,
      verified: true,
      rating: employer.rating,
      reviewCount: employer.reviews.length || 120,
      locationEn: fullLocation,
      distanceEn: "3.2 km",
      wage: {
        amount: res.baseWageAmount || 0,
        typeEn: res.paymentFrequency?.toLowerCase() || "per month",
        overtime: res.overtimeRate || 0,
        overtimeTypeEn: "per hour",
      },
      shift: {
        typeEn: res.shiftType ? (res.shiftType.charAt(0) + res.shiftType.slice(1).toLowerCase() + " Shift") : "Regular Shift",
        timing: res.shiftStartTime && res.shiftEndTime 
                 ? `${res.shiftStartTime.substring(0, 5)} - ${res.shiftEndTime.substring(0, 5)}` 
                 : "Standard Hours",
        weeklyOffEn: res.weeklyOffPattern || "Sunday",
      },
      duration: {
        typeEn: res.jobType || "Full-time",
        startDateEn: res.contractDuration === "CUSTOM" && res.customDuration 
                      ? res.customDuration 
                      : (res.contractDuration?.replaceAll("_", " ") || "Immediate"),
      },
      description: { en: res.jobDescription || "Job description not provided." },
      responsibilities: (res.primarySkills || []).map((s) => ({ en: s })),
      requirements: {
        skills: [...(res.primarySkills || []), ...(res.secondarySkills || [])].map((s) => ({ en: s })),
        education: { en: res.educationLevel || "Not specified" },
        experience: { en: res.experienceLevel?.replaceAll("_", " ") || "Not specified" },
        physical: [{ en: "Basic physical fitness" }],
      },
      benefits: benefits.length > 0 ? benefits : [{ icon: CheckCircle2, labelEn: "Standard Perks", available: true }],
      documents: res.documentRequirements?.map((d) => ({ en: d, required: true })) || [],
      employer,
    };
  };

  useEffect(() => {
    const loadJobAndProfile = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getJob(jobId);
        const mappedData = mapJobToMobile(res);
        setJobData(mappedData);

        if (user?.id && (!profile || Object.keys(profile).length === 0)) {
          const profileRes = await getProfile(user.id);
          dispatch(setProfile(profileRes));
        }
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobAndProfile();
  }, [jobId, user?.id, dispatch]);

  useEffect(() => {
    const loadCompanyJobs = async () => {
      try {
        if (!jobData?.id) return;
        const employerId = jobData?.employer?.id || jobData?.postedBy;
        if (!employerId) return;
        const res = await getJobsByCompany(employerId);
        const filtered = Array.isArray(res) ? res.filter((j) => j.id !== jobData.id) : [];
        setCompanyJobs(filtered);
      } catch (err) {
        console.error("Failed to load company jobs", err);
      }
    };
    loadCompanyJobs();
  }, [jobData]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-medium">Fetching Job Details...</div>;
  if (!jobData) return <div className="min-h-screen flex items-center justify-center text-red-500">Job posting no longer exists</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <div className="flex gap-4">
          <Share2 onClick={handleShare} size={20} className="text-gray-600 cursor-pointer" />
          <Bookmark
            onClick={handleSaveJob}
            className={`cursor-pointer ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-gray-600"}`}
          />
        </div>
      </div>

      {/* Job Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex gap-3">
          <img src={jobData.employer.logo} alt="Company" className="w-16 h-16 rounded-lg border shadow-sm flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate">{jobData.titleEn}</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 truncate">{jobData.companyEn}</span>
              <BadgeCheck className="text-blue-600 flex-shrink-0" size={16} />
            </div>
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Star size={14} fill="currentColor" />
              {jobData.rating} <span className="text-gray-400">({jobData.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm">
          <MapPin size={14} className="flex-shrink-0" /> 
          <span className="truncate flex-1">{jobData.locationEn}</span>
          <span className="text-blue-600 font-medium whitespace-nowrap">• {jobData.distanceEn}</span>
        </div>

        {/* Wage Card */}
        <div className="bg-green-50 border border-green-100 p-4 mt-4 rounded-xl">
          <div className="flex items-baseline gap-2">
            <IndianRupee size={20} className="text-green-700 flex-shrink-0" />
            <span className="text-2xl font-bold text-green-700">{jobData.wage.amount}</span>
            <span className="text-green-600 text-sm">{jobData.wage.typeEn}</span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            Overtime: ₹{jobData.wage.overtime} {jobData.wage.overtimeTypeEn}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg min-w-0">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase">Shift</span>
            </div>
            <div className="text-sm font-semibold truncate">{jobData.shift.typeEn}</div>
            <div className="text-xs text-gray-500 truncate">{jobData.shift.timing}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg min-w-0">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Calendar size={14} />
              <span className="text-xs font-bold uppercase">Duration</span>
            </div>
            <div className="text-sm font-semibold truncate">{jobData.duration.typeEn}</div>
            <div className="text-xs text-gray-500 truncate">{jobData.duration.startDateEn}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 mt-2 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <FileText size={18} className="text-blue-600" /> Job Description
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 break-words">{jobData.description.en}</p>
        <div className="space-y-2">
          <h3 className="font-bold text-sm">Key Responsibilities:</h3>
          {jobData.responsibilities.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-600">
              <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" /> 
              <span className="break-words">{item.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white p-4 mt-2 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <Award size={18} className="text-blue-600" /> Requirements
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Education</p>
            <p className="font-semibold text-sm break-words">{jobData.requirements.education.en}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Experience</p>
            <p className="font-semibold text-sm break-words">{jobData.requirements.experience.en}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white p-4 mt-2 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-blue-600" /> Benefits
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {jobData.benefits.map((benefit, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border-2 ${
                benefit.available ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100 opacity-50"
              }`}
            >
              <benefit.icon size={20} className={benefit.available ? "text-green-600" : "text-gray-400"} />
              <p className="text-xs font-bold mt-1 truncate">{benefit.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Company */}
      <div className="bg-white p-4 mt-2 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <Building2 size={18} className="text-blue-600" /> About Company
        </h2>
        <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center mb-4">
          <span className="text-sm">Payment Reliability</span>
          <span className="font-bold text-green-700">{jobData.employer.paymentReliability}%</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg min-w-0">
            <p className="text-lg font-bold truncate">{jobData.employer.established}</p>
            <p className="text-[10px] text-gray-400 uppercase">Established</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg min-w-0">
            <p className="text-lg font-bold truncate">{jobData.employer.employees}</p>
            <p className="text-[10px] text-gray-400 uppercase">Staff</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg min-w-0">
            <p className="text-lg font-bold truncate">{jobData.employer.rating}★</p>
            <p className="text-[10px] text-gray-400 uppercase">Rating</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white p-4 mt-2 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <MapPinned size={18} className="text-blue-600" /> Work Location
        </h2>
        <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Map view loading...
        </div>
      </div>

      {/* 🔹 More Jobs Section (REVERTED CSS TO ORIGINAL) */}
      {companyJobs.length > 0 && (
        <div className="bg-white p-4 mt-2 border-b">
          <h2 className="text-lg font-bold mb-4">More jobs from {jobData.companyEn}</h2>
          <div className="space-y-4">
            {companyJobs.map((job) => {
              const companyLogo = job?.employer?.picture
                ? `data:image/jpeg;base64,${job.employer.picture}`
                : "https://img.rocket.new/generatedImages/rocket_default_company.png";
              const companyName = job?.employer?.companyName || jobData.companyEn;
              return (
                <div
                  key={job.id}
                  className="card p-4 border rounded-xl shadow-sm hover:shadow-md cursor-pointer bg-white"
                  onClick={() =>
                    navigate("/mobile-job-details", {
                      state: { assignmentId: job.id },
                    })
                  }
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{job.jobTitle}</h3>
                      <p className="text-xs text-gray-500 truncate">{companyName}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {job.fullWorkAddress || "Location not specified"}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">💼 {job.experienceLevel || "Any"}</span>
                        <span className="flex items-center gap-1">⏰ {job.shiftStartTime && job.shiftEndTime ? `${job.shiftStartTime.substring(0, 5)} - ${job.shiftEndTime.substring(0, 5)}` : "Flexible"}</span>
                        <span className="flex items-center gap-1">👥 {job.numberOfWorkers || 1} needed</span>
                      </div>
                      <div className="mt-2 bg-green-50 p-2 rounded-lg inline-block">
                        <span className="font-bold text-green-700">₹{job.baseWageAmount}</span>
                        <span className="text-[10px] text-green-600 ml-1 font-medium uppercase">{job.paymentFrequency?.toLowerCase() || "per day"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <ApplyNowButton hasApplied={hasApplied} onApply={() => setShowApplicationModal(true)} />

      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        jobData={jobData}
        workerProfile={workerProfile}
        onSubmit={() => {
          setHasApplied(true); 
          setShowApplicationModal(false);
        }}
      />
    </div>
  );
};

export default MobileJobDetails;