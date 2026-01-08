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
  // MapPinned, // ✅ Fixed: Added missing import
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

  // Determine Job ID from multiple possible sources
  const searchParams = new URLSearchParams(location.search);
  const jobIdFromQuery = searchParams.get("id");
  const jobIdFromState = location?.state?.assignmentId;
  const jobId = jobIdFromState || jobIdFromQuery;

  const isBookmarked = profile?.savedJobs?.includes(jobId);

  /* =========================================================
      ACTIONS
  ========================================================= */
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

  const handleShare = () => {
    if (!jobData) return;
    if (navigator.share) {
      navigator.share({
        title: jobData.titleEn,
        text: `${jobData.companyEn} - ₹${jobData.wage.amount}/${jobData.wage.typeEn}`,
        url: window.location.href,
      });
    }
  };
  /* =========================================================
    STABLE LIFECYCLE (Prevents Infinite Loop)
========================================================= */
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

      // FIX: Only fetch profile if the ID is missing. 
      // Do NOT include 'profile' in the dependency array below.
      if (user?.id && !profile?.id) { 
        const profileRes = await getProfile(user.id);
        dispatch(setProfile(profileRes));
      }
    } catch (err) {
      console.error("❌ Failed to load job details:", err);
    } finally {
      setLoading(false);
    }
  };

  loadJobAndProfile();
  // We only re-run if the Job ID or User ID changes.
  // Including 'profile' here causes the infinite loop.
}, [jobId, user?.id, dispatch]);

  /* =========================================================
      DATA MAPPING LOGIC
  ========================================================= */
  const mapJobToMobile = (res) => {
    if (!res) return null;

    // Check if user has already applied
    const userApp = res.applicants?.find(
      (app) => String(app.applicantId) === String(user?.id)
    );
    setHasApplied(!!(userApp || res.hasAppliedByUser || res.appliedStatus === "APPLIED"));

    const employer = res.employer ? {
      id: res.employer.id,
      nameEn: res.employer.companyName || "Company Name",
      logo: res.employer.picture
        ? `data:image/jpeg;base64,${res.employer.picture}`
        : "https://img.rocket.new/generatedImages/rocket_default_company.png",
      established: res.employer.establishedYear || "2015",
      employees: res.employer.totalEmployees ? `${res.employer.totalEmployees}+` : "200+",
      rating: res.employer.rating || 4.5,
      paymentReliability: res.employer.paymentReliability || 98,
      reviews: res.employer.reviews || [],
    } : {
      nameEn: "Partner Company",
      logo: "https://img.rocket.new/generatedImages/rocket_default_company.png",
      established: "2018",
      employees: "100+",
      rating: 4.0,
      paymentReliability: 90,
      reviews: [],
    };

    const benefits = [
      res.transportProvided && { icon: Bus, labelEn: res.transportDetails || "Free Transport", available: true },
      res.foodProvided && { icon: Utensils, labelEn: res.foodDetails || "Meals Provided", available: true },
      res.accommodationProvided && { icon: Home, labelEn: res.accommodationDetails || "Stay Provided", available: true },
      res.performanceIncentives && { icon: TrendingUp, labelEn: "Performance Bonus", available: true },
      res.uniformProvided && { icon: Shirt, labelEn: "Uniform", available: true },
      res.medicalInsurance && { icon: HeartPulse, labelEn: "Health Insurance", available: true },
      res.esiPfBenefits && { icon: ShieldCheck, labelEn: "ESI & PF", available: true },
      res.festivalBonuses && { icon: Award, labelEn: "Festival Bonus", available: true },
    ].filter(Boolean);

    return {
      id: res.id,
      postedBy: res.postedBy,
      titleEn: res.jobTitle || "Job Title",
      companyEn: employer.nameEn,
      verified: true,
      rating: employer.rating,
      reviewCount: employer.reviews.length || 120,
      locationEn: res.fullWorkAddress || [res.city, res.state].filter(Boolean).join(", ") || "Location details hidden",
      distanceEn: "3.2 km",
      wage: {
        amount: res.baseWageAmount || 0,
        typeEn: res.paymentFrequency?.toLowerCase() || "per month",
      },
      shift: {
        typeEn: res.shiftType ? res.shiftType.charAt(0) + res.shiftType.slice(1).toLowerCase() : "General",
        timing: res.shiftStartTime && res.shiftEndTime ? `${res.shiftStartTime.substring(0, 5)} - ${res.shiftEndTime.substring(0, 5)}` : "Standard Hours",
      },
      duration: {
        typeEn: res.jobType || "Full-time",
      },
      description: {
        en: res.jobDescription || "Join our team! We are looking for dedicated individuals.",
      },
      requirements: {
        education: { en: res.educationLevel || "Not specified" },
        experience: { en: res.experienceLevel?.replaceAll("_", " ") || "Freshers can apply" },
      },
      benefits: benefits.length > 0 ? benefits : [{ icon: CheckCircle2, labelEn: "Regular Perks", available: true }],
      employer,
    };
  };

  /* =========================================================
      LIFECYCLE / API CALLS
  ========================================================= */
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

        // Sync Profile if missing
        if (user?.id && (!profile || Object.keys(profile).length === 0)) {
          const profileRes = await getProfile(user.id);
          dispatch(setProfile(profileRes));
        }
      } catch (err) {
        console.error("❌ Failed to load job details:", err);
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
        setCompanyJobs(Array.isArray(res) ? res.filter((j) => j.id !== jobData.id) : []);
      } catch (err) {
        console.error("Failed to load company jobs", err);
      }
    };
    loadCompanyJobs();
  }, [jobData?.id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium text-muted-foreground">Loading Job Details...</p>
    </div>
  );

  if (!jobData) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-4">This posting may have been removed or expired.</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">Go Back</button>
      </div>
    </div>
  );

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

// ... (keep all imports and logic the same until the return statement)

  return (
    <div className="min-h-screen bg-gray-50 pb-24"> {/* Added padding-bottom to prevent content from being hidden behind footer */}
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-50 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft />
        </button>
        <div className="flex gap-4">
          <Share2 onClick={handleShare} size={20} className="text-gray-600 cursor-pointer" />
          <Bookmark
            onClick={handleSaveJob}
            className={`cursor-pointer transition-colors ${isBookmarked ? "fill-primary text-primary" : "text-gray-600"}`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-4 border-b">
        <div className="flex gap-4">
          <img
            src={jobData.employer.logo}
            alt="Company"
            className="w-16 h-16 rounded-xl border shadow-sm object-cover"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate leading-tight">{jobData.titleEn}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-slate-600 font-medium truncate">{jobData.companyEn}</span>
              <BadgeCheck className="text-blue-500 flex-shrink-0" size={16} />
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-amber-500 font-bold">
              <Star size={14} fill="currentColor" />
              {jobData.rating} <span className="text-gray-400 font-normal">({jobData.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
          <MapPin size={16} className="text-primary" />
          <span className="truncate">{jobData.locationEn}</span>
        </div>

        {/* Highlight Card */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 mt-5 rounded-2xl">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-700">₹{jobData.wage.amount}</span>
            <span className="text-emerald-600 font-bold text-sm uppercase">{jobData.wage.typeEn}</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1 tracking-wider uppercase">Verified Wage</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase">Shift Type</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{jobData.shift.typeEn}</p>
            <p className="text-[10px] text-slate-500">{jobData.shift.timing}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase">Job Type</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{jobData.duration.typeEn}</p>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="space-y-2 mt-2">
        <Section title="Job Description" icon={FileText}>
          <p className="text-sm text-slate-600 leading-relaxed break-words">{jobData.description.en}</p>
        </Section>

        <Section title="Requirements" icon={Award}>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Education</p>
              <p className="text-sm font-bold text-slate-700">{jobData.requirements.education.en}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Experience</p>
              <p className="text-sm font-bold text-slate-700">{jobData.requirements.experience.en}</p>
            </div>
          </div>
        </Section>

        <Section title="Benefits" icon={TrendingUp}>
          <div className="grid grid-cols-2 gap-3">
            {jobData.benefits.map((benefit, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
                <benefit.icon size={18} className="text-primary" />
                <span className="text-xs font-bold text-slate-700">{benefit.labelEn}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="About Company" icon={Building2}>
          <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-blue-700">Payment Reliability</span>
            <span className="font-black text-blue-700">{jobData.employer.paymentReliability}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <CompanyMetric label="Est." value={jobData.employer.established} />
            <CompanyMetric label="Staff" value={jobData.employer.employees} />
            <CompanyMetric label="Rating" value={`${jobData.employer.rating}★`} />
          </div>
        </Section>

        <Section title="Work Location" icon={MapPin}>
          <div className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm italic">
            Map view is being loaded...
          </div>
        </Section>
      </div>

      {/* Related Jobs */}
      {companyJobs.length > 0 && (
        <div className="bg-white p-4 mt-2">
          <h2 className="text-lg font-bold mb-4">More from {jobData.companyEn}</h2>
          <div className="space-y-4">
            {companyJobs.map((job) => (
              <RelatedJobCard key={job.id} job={job} onClick={(id) => {
                navigate("/mobile-job-details", { state: { assignmentId: id } });
                window.scrollTo(0, 0);
              }} />
            ))}
          </div>
        </div>
      )}

      {/* FIXED FOOTER APPLY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <ApplyNowButton hasApplied={hasApplied} onApply={() => setShowApplicationModal(true)} />
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

// ... (keep the rest of the sub-components exactly the same)

/* =========================================================
    SUB-COMPONENTS (For Cleanliness)
========================================================= */

const Section = ({ title, icon: IconComponent, children }) => (
  <div className="bg-white p-4 border-b last:border-0">
    <h2 className="text-md font-black flex items-center gap-2 mb-4 text-slate-800">
      <IconComponent size={18} className="text-primary" /> {title}
    </h2>
    {children}
  </div>
);

const CompanyMetric = ({ label, value }) => (
  <div className="p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
    <p className="text-sm font-black text-slate-800">{value}</p>
    <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
  </div>
);

const RelatedJobCard = ({ job, onClick }) => {
  const logo = job?.employer?.picture 
    ? `data:image/jpeg;base64,${job.employer.picture}` 
    : "https://img.rocket.new/generatedImages/rocket_default_company.png";

  return (
    <div 
      className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(job.id)}
    >
      <div className="flex gap-3">
        <img src={logo} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{job.jobTitle}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-emerald-600">₹{job.baseWageAmount}</span>
            <span className="text-[10px] text-slate-400">• {job.jobType || "Full-time"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileJobDetails;