import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile, changeProfile } from "../../features/ProfileSlice";
import {
  MapPin, Clock, ChevronLeft, Share2, Bookmark, Building2, Calendar,
  CheckCircle2, TrendingUp, Home, Utensils, Bus, Award, FileText, Star,
  BadgeCheck, ShieldCheck, Shirt, HeartPulse,
} from "lucide-react";

import { getJob, getJobsByCompany } from "../../Services/JobService";
import JobApplicationModal from "../../components/JobApplicationModal";
import ApplyNowButton from "../../components/ApplyNowButton";
import WorkerSidebar from "../../components/navigation/WorkerSidebar";

import { useQueryClient } from "@tanstack/react-query";


const MobileJobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [rawJobData, setRawJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  // const [hasApplied, setHasApplied] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const jobIdFromQuery = searchParams.get("id");
  const jobIdFromState = location?.state?.assignmentId;
  const jobId = jobIdFromState || jobIdFromQuery;

  const isBookmarked = profile?.savedJobs?.includes(jobId);

  const jobData = useMemo(() => {
    if (!rawJobData) return null;

    const res = rawJobData;
    const userApp = res.applicants?.find(
      (app) => String(app.applicantId) === String(user?.id)
    );
    // setHasApplied(!!(userApp || res.hasAppliedByUser || res.appliedStatus === "APPLIED"));



    const employer = res.employer ? {
      id: res.employer.id,
      nameEn: res.employer.companyName || t("assignments.company"),
      logo: res.employer.picture
        ? `data:image/jpeg;base64,${res.employer.picture}`
        : "https://img.rocket.new/generatedImages/rocket_default_company.png",
      established: res.employer.establishedYear || "2015",
      employees: res.employer.totalEmployees ? `${res.employer.totalEmployees}+` : "200+",
      rating: res.employer.rating || 4.5,
      paymentReliability: res.employer.paymentReliability || 98,
      reviews: res.employer.reviews || [],
    } : {
      nameEn: t("assignments.company"),
      logo: "https://img.rocket.new/generatedImages/rocket_default_company.png",
      established: "2018",
      employees: "100+",
      rating: 4.0,
      paymentReliability: 90,
      reviews: [],
    };

    const benefits = [
      res.transportProvided && { icon: Bus, labelEn: res.transportDetails || t("benefits.transport"), available: true },
      res.foodProvided && { icon: Utensils, labelEn: res.foodDetails || t("benefits.food"), available: true },
      res.accommodationProvided && { icon: Home, labelEn: res.accommodationDetails || t("benefits.stay"), available: true },
      res.performanceIncentives && { icon: TrendingUp, labelEn: "Performance Bonus", available: true },
      res.uniformProvided && { icon: Shirt, labelEn: "Uniform", available: true },
      res.medicalInsurance && { icon: HeartPulse, labelEn: "Health Insurance", available: true },
      res.esiPfBenefits && { icon: ShieldCheck, labelEn: "ESI & PF", available: true },
      res.festivalBonuses && { icon: Award, labelEn: "Festival Bonus", available: true },
    ].filter(Boolean);

    return {
      id: res.id,
      postedBy: res.postedBy,
      titleEn: res.jobTitle || t("workHistory.untitled"),
      companyEn: employer.nameEn,
      verified: true,
      rating: employer.rating,
      reviewCount: employer.reviews.length || 120,
      locationEn: res.fullWorkAddress || [res.city, res.state].filter(Boolean).join(", ") || t("common.na"),
      distanceEn: "3.2 km",
      wage: {
        amount: res.baseWageAmount || 0,
        typeEn: res.paymentFrequency ? t(`wage.${res.paymentFrequency.toLowerCase()}`) : t("wage.monthly"),
      },
      shift: {
        typeEn: res.shiftType ? res.shiftType.charAt(0) + res.shiftType.slice(1).toLowerCase() : "General",
        timing: res.shiftStartTime && res.shiftEndTime ? `${res.shiftStartTime.substring(0, 5)} - ${res.shiftEndTime.substring(0, 5)}` : "Standard Hours",
      },
      duration: {
        typeEn: res.jobType || t("professional.workType.fullTime"),
      },
      description: {
        en: res.jobDescription || "Join our team!",
      },
      requirements: {
        education: { en: res.educationLevel || t("common.na") },
        experience: { en: res.experienceLevel?.replaceAll("_", " ") || "Freshers" },
      },
      benefits: benefits.length > 0 ? benefits : [{ icon: CheckCircle2, labelEn: "Regular Perks", available: true }],
      employer,
    };
  }, [rawJobData, i18n.language, t, user?.id]);

  const hasApplied = useMemo(() => {
  if (!rawJobData || !user?.id) return false;

  return rawJobData.applicants?.some(
    (app) => String(app.applicantId) === String(user.id)
  );
}, [rawJobData, user?.id]);


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

  useEffect(() => {
    const loadJobAndProfile = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getJob(jobId);
        setRawJobData(res);

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
        if (!rawJobData?.id) return;
        const employerId = rawJobData?.employer?.id || rawJobData?.postedBy;
        if (!employerId) return;
        const res = await getJobsByCompany(employerId);
        setCompanyJobs(Array.isArray(res) ? res.filter((j) => j.id !== rawJobData.id) : []);
      } catch (err) {
        console.error("Failed to load company jobs", err);
      }
    };
    loadCompanyJobs();
  }, [rawJobData?.id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium text-muted-foreground">{t("common.loading")}</p>
    </div>
  );

  if (!jobData) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-2">Job Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">{t("common.cancel")}</button>
      </div>
    </div>
  );

const handleApplySuccess = () => {
  queryClient.invalidateQueries(["allJobs"]); // 🔥 THIS IS THE KEY
  setShowApplicationModal(false);
};



  const workerProfile = {
    name: profile?.fullName || t("profile.fullName"),
    email: profile?.email || "",
    phone: profile?.primaryPhone || "",
    professionalInfo: {
      primaryRole: profile?.primaryJobRole || t("sidebar.worker"),
      yearsExperience: profile?.professionalInfo?.yearsExperience || 0,
      education: profile?.professionalInfo?.education || t("common.na"),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main 
        className={`main-content transition-all duration-300 pb-32 md:pb-32 ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* Transparent Floating Header */}
        {/* <div className="sticky top-0 z-50 p-4 pointer-events-none">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white/90 backdrop-blur-md shadow-lg border border-slate-100 rounded-full transition-colors pointer-events-auto active:scale-95"
            >
              <ChevronLeft className="text-slate-800" />
            </button>
          </div>
        </div> */}

        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  <img src={jobData.employer.logo} alt="Company" className="w-20 h-20 rounded-2xl border shadow-sm object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{jobData.titleEn}</h1>
                      <BadgeCheck className="text-blue-500" size={24} />
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-lg mb-2">
                      <span className="font-semibold">{jobData.companyEn}</span>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={16} fill="currentColor" />
                        {jobData.rating} <span className="text-slate-400 font-normal text-sm">({jobData.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={18} className="text-primary" />
                      <span className="text-sm md:text-base">{jobData.locationEn}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-center">
                    <p className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase mb-1">{t("wage.monthly")}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-emerald-700">₹{jobData.wage.amount}</span>
                      <span className="text-emerald-600 font-bold text-xs uppercase">{jobData.wage.typeEn}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Clock size={16} />
                      <span className="text-[10px] font-bold uppercase">{t("assignments.tabs.shiftSchedule")}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{jobData.shift.typeEn}</p>
                    <p className="text-[10px] text-slate-500">{jobData.shift.timing}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Calendar size={16} />
                      <span className="text-[10px] font-bold uppercase">{t("professional.workType.label")}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{jobData.duration.typeEn}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Section title={t("workHistory.fields.jobTitle")} icon={FileText}>
                  <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">{jobData.description.en}</p>
                </Section>

                <Section title={t("assignments.tabs.keyRequirements")} icon={Award}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t("profile.tabs.professional")}</p>
                      <p className="text-base font-bold text-slate-700">{jobData.requirements.education.en}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t("professional.experienceDetails")}</p>
                      <p className="text-base font-bold text-slate-700">{jobData.requirements.experience.en}</p>
                    </div>
                  </div>
                </Section>

                <Section title="Benefits & Perks" icon={TrendingUp}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {jobData.benefits.map((benefit, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <benefit.icon size={20} className="text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{benefit.labelEn}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>

            <div className="space-y-6">
              <Section title={t("workHistory.fields.company")} icon={Building2}>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-700">Payment Reliability</span>
                    <span className="font-black text-blue-800">{jobData.employer.paymentReliability}%</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${jobData.employer.paymentReliability}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <CompanyMetric label="Est." value={jobData.employer.established} />
                  <CompanyMetric label="Staff" value={jobData.employer.employees} />
                  <CompanyMetric label="Rating" value={`${jobData.employer.rating}★`} />
                </div>
              </Section>

              {companyJobs.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    {t("common.seeAll")} from {jobData.companyEn}
                  </h2>
                  <div className="space-y-4">
                    {companyJobs.slice(0, 4).map((job) => (
                      <RelatedJobCard key={job.id} job={job} onClick={(id) => {
                        navigate("/mobile-job-details", { state: { assignmentId: id } });
                        window.scrollTo(0, 0);
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={`fixed bottom-0 right-0 left-0 transition-all duration-300 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-50 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}>
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={handleShare} 
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-slate-700 active:scale-90"
                aria-label="Share Job"
              >
                <Share2 size={24} />
              </button>
              <button 
                onClick={handleSaveJob} 
                className={`p-3 rounded-2xl transition-all active:scale-90 ${
                  isBookmarked ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-700"
                }`}
                aria-label="Save Job"
              >
                <Bookmark size={24} className={isBookmarked ? "fill-primary" : ""} />
              </button>
            </div>
            <div className="flex-1">
              <ApplyNowButton hasApplied={hasApplied} onApply={() => setShowApplicationModal(true)} />
            </div>
          </div>
        </div>
      </main>

<JobApplicationModal
  isOpen={showApplicationModal}
  onClose={() => setShowApplicationModal(false)}
  jobData={jobData}
  workerProfile={workerProfile}
  onSubmit={() => {
    // 🔥 OPTIMISTIC UPDATE
    queryClient.setQueryData(["allJobs"], (oldJobs = []) =>
      oldJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: [
                ...(job.applicants || []),
                {
                  applicantId: user.id,
                  applicationStatus: "APPLIED",
                },
              ],
            }
          : job
      )
    );

    // 🔄 Background refetch (safety)
    queryClient.invalidateQueries(["allJobs"]);

    setShowApplicationModal(false);
  }}
/>


    </div>
  );
};

/* Sub-components */
const Section = ({ title, icon: IconComponent, children }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <h2 className="text-lg font-black flex items-center gap-3 mb-6 text-slate-800">
      <div className="p-2 bg-slate-100 rounded-xl">
        <IconComponent size={20} className="text-primary" />
      </div>
      {title}
    </h2>
    {children}
  </div>
);

const CompanyMetric = ({ label, value }) => (
  <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100 hover:bg-white transition-colors">
    <p className="text-base font-black text-slate-800">{value}</p>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
  </div>
);

const RelatedJobCard = ({ job, onClick }) => {
  const logo = job?.employer?.picture 
    ? `data:image/jpeg;base64,${job.employer.picture}` 
    : "https://img.rocket.new/generatedImages/rocket_default_company.png";

  return (
    <div 
      className="p-4 border border-slate-100 rounded-2xl bg-white hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick(job.id)}
    >
      <div className="flex gap-4">
        <img src={logo} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-slate-50" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{job.jobTitle}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-black text-emerald-600">₹{job.baseWageAmount}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">• {job.jobType || "Full-time"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileJobDetails;