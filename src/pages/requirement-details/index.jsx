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

  // 🧩 JOB → UI MODEL
  const requirement = job
    ? {
        ...job,
        jobTitle: job.jobTitle || "Untitled Requirement",
        status: job.jobStatus || "DRAFT",
        location: job.fullWorkAddress || `${job.city}, ${job.state}`,
        postedDate: job.createdAt
          ? new Date(job.createdAt).toLocaleDateString()
          : "Recently",
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

  // 👥 APPLICATIONS MAPPING (Ensuring nested profile support)
  const applications =
    job?.applicants?.map((a) => {
      const local = applicationStatuses[a.applicantId];
      return {
        ...a,
        // Ensure standard fields for Card/Modal
        id: a.applicantId, 
        fullName: a.name || a.fullName || "Anonymous Worker",
        // Map nested profile if it exists in the applicant object
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
      const payload = {
        id: job.id,
        applicantId: app.applicantId,
        applicationStatus: "UNDER_REVIEW",
        interviewTime: app.interviewTime || null,
      };
      await changeAppStatus(payload);
      setApplicationStatuses((prev) => ({
        ...prev,
        [app.applicantId]: { status: "UNDER_REVIEW" },
      }));
      toast.success("Application shortlisted");
    } catch (err) {
      console.error("❌ Approve failed:", err);
      toast.error("Failed to shortlist");
    }
  };

  const handleSelect = async (app) => {
    const appId = app?.applicantId || app?.id; // Safety check for ID
    try {
      const payload = {
        id: job.id,
        applicantId: appId,
        applicationStatus: "SELECTED",
      };
      await changeAppStatus(payload);
      setApplicationStatuses((prev) => ({
        ...prev,
        [appId]: { status: "SELECTED" },
      }));
      toast.success("Worker Selected Successfully");
    } catch (err) {
      console.error("❌ Select failed:", err);
      toast.error("Failed to mark Selected");
    }
  };

  const handleChangeStatus = async (app) => {
    const appId = app?.applicantId || app?.id;
    const currentStatus = applicationStatuses[appId]?.status || app.applicationStatus;
    
    const newStatus = prompt(
      "Enter new status (APPLIED, UNDER_REVIEW, INTERVIEWING, SELECTED, REJECTED, JOINED):",
      currentStatus
    );
    if (!newStatus) return;

    try {
      const payload = {
        id: job.id,
        applicantId: appId,
        applicationStatus: newStatus.toUpperCase(),
      };
      await changeAppStatus(payload);
      setApplicationStatuses((prev) => ({
        ...prev,
        [appId]: { status: newStatus.toUpperCase() },
      }));
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error("❌ Status change failed:", err);
      toast.error("Failed to update status");
    }
  };

  const handleReject = async (app) => {
    try {
      const payload = {
        id: job.id,
        applicantId: app.applicantId,
        applicationStatus: "REJECTED",
      };
      await changeAppStatus(payload);
      setApplicationStatuses((prev) => ({
        ...prev,
        [app.applicantId]: { status: "REJECTED" },
      }));
      toast.success("Application rejected");
    } catch (err) {
      console.error("❌ Reject failed:", err);
      toast.error("Failed to reject");
    }
  };

  const handleScheduleSubmit = async (data) => {
    try {
      const payload = {
        id: job.id,
        applicantId: data.applicantId,
        applicationStatus: "INTERVIEWING",
        interviewTime: data.interviewTime,
      };
      await changeAppStatus(payload);
      setApplicationStatuses((prev) => ({
        ...prev,
        [data.applicantId]: {
          status: "INTERVIEWING",
          interviewTime: data.interviewTime,
        },
      }));
      toast.success("Interview scheduled");
      setShowScheduleModal(false);
    } catch (err) {
      console.error("❌ Scheduling failed:", err);
      toast.error("Failed to schedule interview");
    }
  };

  const handleScheduleInterview = (worker) => {
    setSelectedWorker(worker);
    setShowScheduleModal(true);
  };

  const handleViewProfile = (worker) => {
    setSelectedWorker(worker);
    setShowProfileModal(true);
  };

  const handleCloseJob = async () => {
    if (!window.confirm("Are you sure you want to close this job? It will be marked as EXPIRED and hidden from applicants.")) return;
    try {
      setLoading(true);
      await updateJobStatus(id, "EXPIRED");
      setJob(prev => ({ ...prev, jobStatus: "EXPIRED" }));
      toast.success("Job closed successfully");
    } catch (err) {
      console.error("❌ Close job failed:", err);
      toast.error("Failed to close job");
    } finally {
      setLoading(false);
    }
  };

  // UI
  if (!id) return <div className="p-10 text-center text-error font-bold">Invalid Job ID</div>;

  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground animate-pulse">Fetching requirement details...</p>
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
                onRenew={() => toast.info("Renewal feature coming soon")}
                onClose={handleCloseJob}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <RequirementDetails requirement={requirement} />

                  <ApplicationsList
                    applications={applications}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onSelect={handleSelect}
                    onChangeStatus={handleChangeStatus}
                    onScheduleInterview={handleScheduleInterview}
                    onViewProfile={handleViewProfile}
                  />

                  <CandidateComparison applications={applications} />
                </div>

                <div className="space-y-6">
                  <QuickActions onSendMessage={(data) => toast.success("Message sent to candidates")} />
                  <PerformanceAnalytics
                    analytics={{
                      totalViews: "842",
                      viewsGrowth: "+12%",
                      totalApplications: applications.length,
                      applicationsGrowth: "+8%",
                      conversionRate: "3.6%",
                      conversionChange: "-0.4%",
                      avgMatchScore: "84%",
                      matchScoreChange: "+2.1%",
                      experienceMatch: "82%",
                      skillsMatch: "88%",
                      locationMatch: "76%",
                      recommendations: [
                        "Increase compensation to attract skilled workers",
                        "Add clearer skill requirements",
                        "Extend posting duration",
                        "High demand for this role in your area",
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <WorkerProfileModal
        worker={selectedWorker}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onScheduleInterview={handleScheduleInterview}
        onSelect={handleSelect}
        onChangeStatus={handleChangeStatus}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ScheduleInterviewModal
        worker={selectedWorker}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleSubmit}
      />
    </div>
  );
};

export default RequirementDetailsPage;
