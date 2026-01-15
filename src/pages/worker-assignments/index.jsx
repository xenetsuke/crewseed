import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";

// Services
import { getAllJobs } from "../../Services/JobService";
import { updateProfile, getProfile } from "../../Services/ProfileService";
import { changeProfile, setProfile } from "../../features/ProfileSlice";

const WorkerAssignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const [activeAssignments, setActiveAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  /* ================= REACT QUERY ================= */
  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["allJobs"],
    queryFn: getAllJobs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  /* ================= DATA PROCESSING ================= */
  useEffect(() => {
    if (!user?.id || !allJobs) return;

    const appliedJobs = allJobs.filter((job) =>
      job.applicants?.some((app) => app.applicantId === user.id)
    );

    const appliedIds = new Set(appliedJobs.map((j) => j.id));

    const active = appliedJobs
      .filter((job) => {
        const myApp = job.applicants?.find(
          (a) => a.applicantId === user.id
        );
        return ["APPLIED", "UNDER_REVIEW", "INTERVIEWING"].includes(
          myApp?.applicationStatus
        );
      })
      .map((job) => formatJobData(job, user.id));

    const completed = appliedJobs
      .filter((job) => {
        const myApp = job.applicants?.find(
          (a) => a.applicantId === user.id
        );
        return ["SELECTED", "REJECTED", "JOINED", "NO_SHOW"].includes(
          myApp?.applicationStatus
        );
      })
      .map((job) => formatJobData(job, user.id));

    if (profile?.savedJobs) {
      const saved = allJobs
        .filter(
          (job) =>
            profile.savedJobs.includes(job.id) && !appliedIds.has(job.id)
        )
        .map((job) => formatJobData(job, user.id));
      setSavedJobs(saved);
    }

    setActiveAssignments(active);
    setCompletedAssignments(completed);
  }, [allJobs, user?.id, profile?.savedJobs]);

  /* ================= PROFILE SYNC ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id && !profile?.id) {
        const p = await getProfile(user.id);
        dispatch(setProfile(p));
      }
    };
    fetchProfile();
  }, [user?.id, profile?.id, dispatch]);

  const formatJobData = (job, userId) => {
    const myApp = job.applicants?.find((a) => a.applicantId === userId);
    return {
      ...job,
      title: job.jobTitle,
      company: job?.employer?.companyName || t("assignments.company"),
      companyLogo: job?.employer?.picture
        ? `data:image/jpeg;base64,${job.employer.picture}`
        : "/company-placeholder.png",
      location: job.fullWorkAddress,
      dailyWage: job.baseWageAmount,
      status: myApp?.applicationStatus || "SAVED",
      duration: job.experienceLevel?.replace("_", " ") || t("common.na"),
      benefits: {
        transport: job.transportProvided,
        food: job.foodProvided,
        accommodation: job.accommodationProvided,
      },
    };
  };

  const handleRemoveSavedJob = async (jobId) => {
    if (!profile?.id) return;
    const updatedProfile = {
      ...profile,
      savedJobs: profile.savedJobs.filter((id) => id !== jobId),
    };
    await updateProfile(updatedProfile);
    dispatch(changeProfile(updatedProfile));
  };

  /* ================= JOB CARD ================= */
  const renderJobCard = (job, isSavedTab = false) => (
    <div 
      key={job.id} 
      className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 md:flex"
    >
      <div className="p-5 flex-1">
        <div className="flex gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
            <Image src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="truncate">
                <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground truncate">{job.company}</p>
              </div>

              {isSavedTab ? (
                <button 
                  onClick={() => handleRemoveSavedJob(job.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <Icon name="Trash2" size={18} />
                </button>
              ) : (
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border
                  ${job.status === 'SELECTED' || job.status === 'JOINED' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-primary/5 text-primary border-primary/20'}`}
                >
                  {t(`assignmentStatus.${job.status}`, job.status)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Icon name="MapPin" size={14} className="text-primary" />
                <span className="truncate max-w-[150px] md:max-w-none">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Briefcase" size={14} className="text-primary" />
                <span>{job.duration}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-baseline gap-1">
               <span className="text-lg font-bold text-primary">₹{job.dailyWage}</span>
               <span className="text-xs text-muted-foreground font-medium">/{t("wage.daily")}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.benefits.transport && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  <Icon name="Bus" size={10} className="inline mr-1" /> {t("benefits.transport")}
                </span>
              )}
              {job.benefits.food && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  <Icon name="Utensils" size={10} className="inline mr-1" /> {t("benefits.food")}
                </span>
              )}
              {job.benefits.accommodation && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  <Icon name="Home" size={10} className="inline mr-1" /> {t("benefits.stay")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-4 border-t border-border md:border-t-0 md:border-l md:w-48 flex flex-col justify-center gap-3">
        <Button
          variant="outline"
          fullWidth
          size="sm"
          className="bg-white"
          onClick={() =>
            navigate("/mobile-job-details", {
              state: { assignmentId: job.id },
            })
          }
        >
          {t("common.viewDetails")}
        </Button>

        {isSavedTab ? (
          <Button fullWidth size="sm">
            {t("common.applyNow")}
          </Button>
        ) : (
          <div className="text-[10px] font-bold text-center uppercase text-muted-foreground bg-muted/50 rounded-md py-2 border border-border/50">
             {t(`assignmentStatus.${job.status}`, job.status)}
          </div>
        )}
      </div>
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content transition-all duration-300 ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {t("assignments.title")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {t("assignments.subtitle")}
            </p>
          </header>

          {/* Improved Tabs Navigation */}
          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl border border-border mb-6 overflow-x-auto no-scrollbar">
            {["active", "completed", "saved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t(`assignments.tabs.${tab}`)}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">{t("common.loading")}</p>
              </div>
            ) : activeTab === "active" ? (
              activeAssignments.length === 0
                ? <EmptyState message={t("assignments.empty.active")} />
                : activeAssignments.map((job) => renderJobCard(job))
            ) : activeTab === "completed" ? (
              completedAssignments.length === 0
                ? <EmptyState message={t("assignments.empty.completed")} />
                : completedAssignments.map((job) => renderJobCard(job))
            ) : savedJobs.length === 0 ? (
              <EmptyState message={t("assignments.empty.saved")} />
            ) : (
              savedJobs.map((job) => renderJobCard(job, true))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Empty State
const EmptyState = ({ message }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border flex flex-col items-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <Icon name="Inbox" size={32} className="text-muted-foreground" />
    </div>
    <p className="text-muted-foreground font-medium italic">{message}</p>
  </div>
);

export default WorkerAssignments;