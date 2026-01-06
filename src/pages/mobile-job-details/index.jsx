import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile, changeProfile } from "../../features/ProfileSlice";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
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
  HeartPulse,
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

    const userApp = res.applicants?.find(
      (app) => String(app.applicantId) === String(user?.id)
    );
    setHasApplied(
      !!(userApp || res.hasAppliedByUser || res.appliedStatus === "APPLIED")
    );

    const employerFromBackend = res.employer;
    const employer = employerFromBackend
      ? {
          id: employerFromBackend.id,
          nameEn: employerFromBackend.companyName || "Company Name",
          logo: employerFromBackend.picture
            ? `data:image/jpeg;base64,${employerFromBackend.picture}`
            : "https://img.rocket.new/generatedImages/rocket_default_company.png",
          established: employerFromBackend.establishedYear || "2015",
          employees: employerFromBackend.totalEmployees
            ? `${employerFromBackend.totalEmployees}+`
            : "200+",
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

    const fullLocation =
      res.fullWorkAddress ||
      [res.city, res.state, res.pincode].filter(Boolean).join(", ") ||
      "Location not provided";

    const benefits = [
      res.transportProvided && {
        icon: Bus,
        labelEn: res.transportDetails || "Free Transport",
        available: true,
      },
      res.foodProvided && {
        icon: Utensils,
        labelEn: res.foodDetails || "Meals Provided",
        available: true,
      },
      res.accommodationProvided && {
        icon: Home,
        labelEn: res.accommodationDetails || "Accommodation",
        available: true,
      },
      res.performanceIncentives && {
        icon: TrendingUp,
        labelEn: "Performance Incentives",
        available: true,
      },
      res.uniformProvided && {
        icon: Shirt,
        labelEn: "Uniform Provided",
        available: true,
      },
      res.medicalInsurance && {
        icon: HeartPulse,
        labelEn: "Medical Insurance",
        available: true,
      },
      res.esiPfBenefits && {
        icon: ShieldCheck,
        labelEn: "ESI & PF Benefits",
        available: true,
      },
      res.festivalBonuses && {
        icon: Award,
        labelEn: "Festival Bonuses",
        available: true,
      },
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
        typeEn: res.shiftType
          ? res.shiftType.charAt(0) +
            res.shiftType.slice(1).toLowerCase() +
            " Shift"
          : "Regular Shift",
        timing:
          res.shiftStartTime && res.shiftEndTime
            ? `${res.shiftStartTime.substring(
                0,
                5
              )} - ${res.shiftEndTime.substring(0, 5)}`
            : "Standard Hours",
        weeklyOffEn: res.weeklyOffPattern || "Sunday",
      },
      duration: {
        typeEn: res.jobType || "Full-time",
        startDateEn:
          res.contractDuration === "CUSTOM" && res.customDuration
            ? res.customDuration
            : res.contractDuration?.replaceAll("_", " ") || "Immediate",
      },
      description: {
        en: res.jobDescription || "Job description not provided.",
      },
      responsibilities: (res.primarySkills || []).map((s) => ({ en: s })),
      requirements: {
        skills: [
          ...(res.primarySkills || []),
          ...(res.secondarySkills || []),
        ].map((s) => ({ en: s })),
        education: { en: res.educationLevel || "Not specified" },
        experience: {
          en: res.experienceLevel?.replaceAll("_", " ") || "Not specified",
        },
        physical: [{ en: "Basic physical fitness" }],
      },
      benefits,
      documents:
        res.documentRequirements?.map((d) => ({ en: d, required: true })) || [],
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
        const filtered = Array.isArray(res)
          ? res.filter((j) => j.id !== jobData.id)
          : [];
        setCompanyJobs(filtered);
      } catch (err) {
        console.error("Failed to load company jobs", err);
      }
    };
    loadCompanyJobs();
  }, [jobData]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-medium bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 animate-pulse">Fetching Job Details...</p>
      </div>
    );
  if (!jobData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div>
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800">Job No Longer Available</h2>
          <p className="text-gray-500 mt-2">The posting might have expired or been removed.</p>
          <button onClick={() => navigate(-1)} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">Go Back</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative">
      {/* Header - Centered Max Width */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
<div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto p-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="text-slate-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 active:scale-95 transition-transform"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleSaveJob}
              className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-all ${
                isBookmarked ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
              }`}
            >
              <Bookmark size={18} className={isBookmarked ? "fill-blue-600" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container - Added extra bottom padding (pb-32) to prevent footer overlap */}
<div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pb-32">
        {/* Job Header Card */}
        
        <div className="bg-white p-5 rounded-b-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex gap-4">
            <img
              src={jobData.employer.logo}
              alt="Company"
              className="w-16 h-16 rounded-2xl border border-slate-100 shadow-sm object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-1 truncate">{jobData.titleEn}</h1>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-slate-600 font-semibold text-sm truncate">
                  {jobData.companyEn}
                </span>
                <BadgeCheck className="text-blue-500 flex-shrink-0" size={16} />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                  <Star size={12} fill="currentColor" className="mr-1" />
                  {jobData.rating}
                </div>
                <span className="text-slate-400 font-normal truncate">
                  • {jobData.reviewCount} reviews
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 text-slate-500 text-sm bg-slate-50 p-3 rounded-2xl">
            <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-700 leading-snug">{jobData.locationEn}</p>
              <p className="text-blue-600 font-bold mt-0.5 text-xs uppercase tracking-wider">{jobData.distanceEn} from you</p>
            </div>
          </div>

          {/* Wage Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-5 mt-5 rounded-2xl shadow-lg shadow-emerald-100">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Total Earnings</p>
                <div className="flex items-baseline gap-1.5 text-white">
                  <IndianRupee size={22} className="opacity-90" />
                  <span className="text-3xl font-black">{jobData.wage.amount.toLocaleString()}</span>
                  <span className="text-emerald-100 text-sm font-medium italic">/{jobData.wage.typeEn}</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Clock size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Shift Schedule</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{jobData.shift.typeEn}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{jobData.shift.timing}</p>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Calendar size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Job Duration</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{jobData.duration.typeEn}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{jobData.duration.startDateEn}</p>
            </div>
          </div>
        </div>

        {/* Section Wrapper */}
        <div className="px-4 space-y-3 mt-3">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <FileText size={18} className="text-blue-500" /> Job Description
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-line">
              {jobData.description.en}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <Award size={18} className="text-blue-500" /> Candidate Profile
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BadgeCheck className="text-indigo-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Education</p>
                  <p className="font-bold text-sm text-slate-700">{jobData.requirements.education.en}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience</p>
                  <p className="font-bold text-sm text-slate-700">{jobData.requirements.experience.en}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <ShieldCheck size={18} className="text-blue-500" /> Work Benefits
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {jobData.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center gap-2"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${benefit.available ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <benefit.icon size={20} />
                  </div>
                  <p className="text-[10px] font-extrabold text-slate-700 leading-tight">
                    {benefit.labelEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 overflow-hidden relative">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <Building2 size={18} className="text-blue-500" /> Company Profile
            </h2>
            <div className="bg-indigo-600 p-4 rounded-2xl flex justify-between items-center mb-5 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-bold">Reliability Score</span>
              </div>
              <span className="text-2xl font-black">
                {jobData.employer.paymentReliability}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Since</p>
                <p className="text-sm font-extrabold text-slate-800">{jobData.employer.established}</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Employees</p>
                <p className="text-sm font-extrabold text-slate-800">{jobData.employer.employees}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center justify-center gap-0.5 text-sm font-extrabold text-slate-800">
                  {jobData.employer.rating} <Star size={12} fill="#F59E0B" className="text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <MapPinned size={18} className="text-blue-500" /> Location Details
            </h2>
            <div className="relative group">
              <div className="h-44 bg-slate-100 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-slate-400 transition-all border border-slate-100">
                <MapPinned size={32} className="mb-2 opacity-20" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-40">Map view incoming</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-blue-500 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600 line-clamp-2">{jobData.locationEn}</p>
                </div>
              </div>
            </div>
          </div>

       {companyJobs.length > 0 && (
  <div className="pt-6 mt-6 border-t border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">
        More from {jobData.companyEn}
      </h2>
      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-bold">
        {companyJobs.length} Jobs
      </span>
    </div>

    {/* Responsive Grid: 1 col on mobile/desktop sidebar, 2 cols on tablets */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {companyJobs.map((job) => {
        // 1. Data Parsing
        const companyLogo = job?.employer?.picture
          ? `data:image/jpeg;base64,${job.employer.picture}`
          : "https://img.rocket.new/generatedImages/rocket_default_company.png";

        const companyName = job?.employer?.companyName || jobData.companyEn;
        
        // 2. Relative Time Mapping
        const dateToDisplay = job?.postedDate || job?.createdAt || job?.updatedAt;
        let relativeTimeLabel = "Recently";

        if (dateToDisplay) {
          const posted = new Date(dateToDisplay);
          const now = new Date();
          const diffInMs = now - posted;
          
          if (!isNaN(posted.getTime())) {
            const diffInMins = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMins / 60);
            const diffInDays = Math.floor(diffInHours / 24);

            if (diffInMins < 1) relativeTimeLabel = "Just now";
            else if (diffInMins < 60) relativeTimeLabel = `${diffInMins}m ago`;
            else if (diffInHours < 24) relativeTimeLabel = `${diffInHours}h ago`;
            else if (diffInDays < 7) relativeTimeLabel = `${diffInDays}d ago`;
            else relativeTimeLabel = posted.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          }
        }

        return (
          <div
            key={job.id}
            className="bg-white p-4 rounded-3xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 active:scale-[0.98] transition-all cursor-pointer hover:border-blue-200 group"
            onClick={() =>
              navigate("/mobile-job-details", {
                state: { assignmentId: job.id },
              })
            }
          >
            <div className="flex gap-4">
              <img
                src={companyLogo}
                alt={companyName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {job.jobTitle}
                </h3>
                
                <p className="text-[11px] font-medium text-slate-400 mb-2 truncate">
                  {companyName}
                </p>

                {/* Time Section */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {relativeTimeLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-black">
                      ₹{job.baseWageAmount?.toLocaleString()}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {job.paymentFrequency?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    View <ChevronLeft className="rotate-180" size={12} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
        </div>
      </div>

      {/* Floating Action Section - Sticky Footer Implementation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-[60]">
        <div className="max-w-md mx-auto p-4 pb-6 safe-area-inset-bottom">
          <ApplyNowButton
            hasApplied={hasApplied}
            onApply={() => setShowApplicationModal(true)}
          />
        </div>
      </div>

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