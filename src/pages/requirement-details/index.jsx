import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Added React Query hooks
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

// 🔹 Backend API
import { getJob, changeAppStatus, updateJobStatus, deleteJob } from "../../Services/JobService";

const RequirementDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient(); // ✅ For cache management

  // 🧠 UI STATE (Kept minimal as per instructions)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* =========================================================
      REACT QUERY FETCHING
  ========================================================= */
  const { data: job, isLoading: loading, refetch } = useQuery({
    queryKey: ["requirementDetail", id],
    queryFn: () => getJob(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // ✅ Mutation for updating application statuses
  const statusMutation = useMutation({
    mutationFn: (payload) => changeAppStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["requirementDetail", id]);
    },
  });

  // 🧩 HELPERS (Maintain original logic)
  const formatEnum = (val) =>
    val ? val.replace(/_/g, " ").toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not Specified";

  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";
    if (dateValue === "Just now") return "Just now";
    let cleanDate = typeof dateValue === 'string' ? dateValue.replace(',', '') : dateValue;
    const now = new Date();
    const posted = new Date(cleanDate);
    if (isNaN(posted.getTime())) return dateValue;
    const diffInMs = now - posted;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInMins < 60) return diffInMins <= 1 ? "Just now" : `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return posted.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // 🧩 JOB → UI MODEL
  const requirement = job ? {
    ...job,
    jobTitle: job.jobTitle || "Untitled Requirement",
    status: job.jobStatus || "DRAFT",
    location: job.fullWorkAddress || `${job.city}, ${job.state}`,
    postedDate: getRelativeTime(job.postedDate || job.createdAt),
    expiryDate: job.applicationDeadline ? new Date(job.applicationDeadline).toDateString() : "Not specified",
    compensation: job.baseWageAmount ? `₹${job.baseWageAmount} / ${job.paymentFrequency?.toLowerCase()}` : "Not disclosed",
    experience: formatEnum(job.experienceLevel),
    duration: job.contractDuration === "CUSTOM" ? job.customDuration : formatEnum(job.contractDuration),
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
  } : null;

  // 👥 APPLICATIONS MAPPING
  const applications = job?.applicants?.map((a) => ({
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
    applicationStatus: a.applicationStatus || "APPLIED",
    interviewTime: a.interviewTime || null,
  })) || [];

  // 🔘 HANDLERS (Migrated to Mutation for cache updates)
  const handleApprove = async (app) => {
    statusMutation.mutate({ id: job.id, applicantId: app.applicantId, applicationStatus: "UNDER_REVIEW" }, {
      onSuccess: () => toast.success("Application shortlisted")
    });
  };

  const handleSelect = async (app) => {
    const appId = app?.applicantId || app?.id;
    statusMutation.mutate({ id: job.id, applicantId: appId, applicationStatus: "SELECTED" }, {
      onSuccess: () => toast.success("Worker Selected Successfully")
    });
  };

  const handleChangeStatus = async (app) => {
    const appId = app?.applicantId || app?.id;
    const newStatus = prompt("Enter new status:", app.applicationStatus);
    if (!newStatus) return;
    statusMutation.mutate({ id: job.id, applicantId: appId, applicationStatus: newStatus.toUpperCase() }, {
      onSuccess: () => toast.success("Status updated")
    });
  };

  const handleReject = async (app) => {
    statusMutation.mutate({ id: job.id, applicantId: app.applicantId, applicationStatus: "REJECTED" }, {
      onSuccess: () => toast.success("Application rejected")
    });
  };

  const handleScheduleSubmit = async (data) => {
    statusMutation.mutate({ id: job.id, applicantId: data.applicantId, applicationStatus: "INTERVIEWING", interviewTime: data.interviewTime }, {
      onSuccess: () => {
        toast.success("Interview scheduled");
        setShowScheduleModal(false);
      }
    });
  };

  const handleScheduleInterview = (worker) => { setSelectedWorker(worker); setShowScheduleModal(true); };
  const handleViewProfile = (worker) => { setSelectedWorker(worker); setShowProfileModal(true); };

  const handleCloseJob = async () => {
    if (!window.confirm("Close this job?")) return;
    try {
      await updateJobStatus(id, "EXPIRED");
      queryClient.invalidateQueries(["requirementDetail", id]);
      toast.success("Job closed");
    } catch (err) { toast.error("Failed to close job"); }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      queryClient.invalidateQueries(["employerRequirements"]); // Refresh the list cache
      toast.success("Job deleted successfully");
      navigate("/employer-requirements");
    } catch (err) { toast.error("Operation failed"); }
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
              <RequirementHeader 
                requirement={requirement} 
                onEdit={() => navigate(`/post-job-requirement/${id}`)} 
                onClose={handleCloseJob} 
                onDelete={handleDeleteJob} 
              />
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