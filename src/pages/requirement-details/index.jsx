import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import RequirementHeader from "./components/RequirementHeader";
import RequirementDetails from "./components/RequirementDetails";
import ApplicationsList from "./components/ApplicationsList";
import PerformanceAnalytics from "./components/PerformanceAnalytics";
import CandidateComparison from "./components/CandidateComparison";
import QuickActions from "./components/QuickActions";
import WorkerProfileModal from "./components/WorkerProfileModal";
import ScheduleInterviewModal from "./components/ScheduleInterviewModal";
import { getJobsPostedBy, deleteJob, updateJobStatus } from "../../Services/JobService";

// 🔹 Backend API
import { getJob, changeAppStatus } from "../../Services/JobService";

const RequirementDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🧠 STATE
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [applicationStatuses, setApplicationStatuses] = useState({});

  // 🔥 FETCH JOB
  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getJob(id);
        console.log("DEBUG: API Response:", res);
        setJob(res);
      } catch (err) {
        console.error("❌ Failed to fetch job:", err);
        toast.error("Failed to load requirement details");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  // 🧩 HELPERS
  const formatEnum = (val) =>
    val
      ? val
          .replace(/_/g, " ")
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Not Specified";

  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";
    
    // If backend sent "Just now" string, we try to use the actual date if available
    // but if that's all we have, we display it.
    if (dateValue === "Just now") return "Just now";

    // Handle "dd MMM yyyy, HH:mm" by removing the comma for JS Date parsing
    let cleanDate = dateValue;
    if (typeof dateValue === 'string') {
        cleanDate = dateValue.replace(',', '');
    }
    
    const now = new Date();
    const posted = new Date(cleanDate);

    // If parsing fails, return the raw string
    if (isNaN(posted.getTime())) return dateValue;

    const diffInMs = now - posted;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    // 1. Show Minutes if under 1 hour
    if (diffInMins < 60) {
      return diffInMins <= 1 ? "Just now" : `${diffInMins}m ago`;
    }
    // 2. Show Hours if under 24 hours
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    // 3. Otherwise show Date
    return posted.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // 🧩 JOB → UI MODEL
  const requirement = job
    ? {
        ...job,
        jobTitle: job.jobTitle || "Untitled Requirement",
        status: job.jobStatus || "DRAFT",
        location: job.fullWorkAddress || `${job.city}, ${job.state}`,
        // Primary: postedDate from DTO, Fallback: createdAt
        postedDate: getRelativeTime(job.postedDate || job.createdAt),
        expiryDate: job.applicationDeadline
          ? new Date(job.applicationDeadline).toDateString()
          : "Not specified",
        compensation: job.baseWageAmount
          ? `₹${job.baseWageAmount} / ${job.paymentFrequency?.toLowerCase()}`
          : "Not disclosed",
        experience: formatEnum(job.experienceLevel),
        duration:
          job.contractDuration === "CUSTOM"
            ? job.customDuration
            : formatEnum(job.contractDuration),
        shift: formatEnum(job.shiftType),
        skills: [...(job.primarySkills || []), ...(job.secondarySkills || [])],
        requirements: job.documentRequirements || [],
        benefits: [
          job.transportProvided && "Transport Provided",
          job.foodProvided && "Food Provided",
          job.accommodationProvided && "Accommodation Provided",
          job.medicalInsurance && "Medical Insurance",
          job.esiPfBenefits && "ESI & PF Benefits",
        ].filter(Boolean),
      }
    : null;

  // 👥 APPLICATIONS MAPPING
  const applications =
    job?.applicants?.map((a) => {
      const local = applicationStatuses[a.applicantId];
      return {
        ...a,
        id: a.applicantId, 
        fullName: a.name || a.fullName || "Anonymous Worker",
        profile: a.profile || {
          fullName: a.name || a.fullName,
          skills: a.skills || [],
          recentAssignments: a.recentAssignments || [],
          Workeravailability: a.isAvailable ?? true,
          about: a.about || a.bio,
          certifications: a.certifications || []
        },
        applicationStatus: local?.status || a.applicationStatus || "APPLIED",
        interviewTime: local?.interviewTime || a.interviewTime || null,
      };
    }) || [];

  // 🔘 HANDLERS
  const handleApprove = async (app) => {
    try {
      const payload = { id: job.id, applicantId: app.applicantId, applicationStatus: "UNDER_REVIEW" };
      await changeAppStatus(payload);
      setApplicationStatuses(prev => ({ ...prev, [app.applicantId]: { status: "UNDER_REVIEW" } }));
      toast.success("Application shortlisted");
    } catch (err) { toast.error("Failed to shortlist"); }
  };

  const handleSelect = async (app) => {
    const appId = app?.applicantId || app?.id;
    try {
      await changeAppStatus({ id: job.id, applicantId: appId, applicationStatus: "SELECTED" });
      setApplicationStatuses(prev => ({ ...prev, [appId]: { status: "SELECTED" } }));
      toast.success("Worker Selected Successfully");
    } catch (err) { toast.error("Failed to mark Selected"); }
  };

  const handleChangeStatus = async (app) => {
    const appId = app?.applicantId || app?.id;
    const currentStatus = applicationStatuses[appId]?.status || app.applicationStatus;
    const newStatus = prompt("Enter new status:", currentStatus);
    if (!newStatus) return;
    try {
      await changeAppStatus({ id: job.id, applicantId: appId, applicationStatus: newStatus.toUpperCase() });
      setApplicationStatuses(prev => ({ ...prev, [appId]: { status: newStatus.toUpperCase() } }));
      toast.success(`Status updated`);
    } catch (err) { toast.error("Failed to update status"); }
  };

  const handleReject = async (app) => {
    try {
      await changeAppStatus({ id: job.id, applicantId: app.applicantId, applicationStatus: "REJECTED" });
      setApplicationStatuses(prev => ({ ...prev, [app.applicantId]: { status: "REJECTED" } }));
      toast.success("Application rejected");
    } catch (err) { toast.error("Failed to reject"); }
  };

  const handleScheduleSubmit = async (data) => {
    try {
      await changeAppStatus({ id: job.id, applicantId: data.applicantId, applicationStatus: "INTERVIEWING", interviewTime: data.interviewTime });
      setApplicationStatuses(prev => ({ ...prev, [data.applicantId]: { status: "INTERVIEWING", interviewTime: data.interviewTime } }));
      toast.success("Interview scheduled");
      setShowScheduleModal(false);
    } catch (err) { toast.error("Failed to schedule interview"); }
  };

  const handleScheduleInterview = (worker) => { setSelectedWorker(worker); setShowScheduleModal(true); };
  const handleViewProfile = (worker) => { setSelectedWorker(worker); setShowProfileModal(true); };

  const handleCloseJob = async () => {
    if (!window.confirm("Close this job?")) return;
    try {
      setLoading(true);
      await updateJobStatus(id, "EXPIRED");
      setJob(prev => ({ ...prev, jobStatus: "EXPIRED" }));
      toast.success("Job closed");
    } catch (err) { toast.error("Failed to close job"); } finally { setLoading(false); }
  };

  if (!id) return <div className="p-10 text-center text-error font-bold">Invalid Job ID</div>;

  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Fetching requirement details...</p>
            </div>
          ) : !job ? (
            <div className="text-center py-20">
              <p className="text-error font-bold text-xl">Job Not Found</p>
              <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">Go Back</button>
            </div>
          ) : (
            <>
              <RequirementHeader requirement={requirement} onEdit={() => navigate(`/post-job-requirement/${id}`)} onClose={handleCloseJob} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <RequirementDetails requirement={requirement} />
                  <ApplicationsList applications={applications} onApprove={handleApprove} onReject={handleReject} onSelect={handleSelect} onChangeStatus={handleChangeStatus} onScheduleInterview={handleScheduleInterview} onViewProfile={handleViewProfile} />
                  <CandidateComparison applications={applications} />
                </div>
                <div className="space-y-6">
                  <QuickActions onSendMessage={() => toast.success("Message sent")} />
                  <PerformanceAnalytics analytics={{ totalViews: "842", viewsGrowth: "+12%", totalApplications: applications.length, applicationsGrowth: "+8%", conversionRate: "3.6%", conversionChange: "-0.4%", avgMatchScore: "84%", matchScoreChange: "+2.1%", experienceMatch: "82%", skillsMatch: "88%", locationMatch: "76%", recommendations: ["Increase compensation", "Add clearer skills", "Extend posting", "High demand area"] }} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <WorkerProfileModal worker={selectedWorker} isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} onScheduleInterview={handleScheduleInterview} onSelect={handleSelect} onChangeStatus={handleChangeStatus} onApprove={handleApprove} onReject={handleReject} />
      <ScheduleInterviewModal worker={selectedWorker} isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} onSchedule={handleScheduleSubmit} />
    </div>
  );
};

export default RequirementDetailsPage;