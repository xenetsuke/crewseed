import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import DashboardMetrics from "../../components/ui/DashboardMetrics";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

import RequirementRow from "./components/RequirementRow";
import RequirementCard from "./components/RequirementCard";
import ConfirmationModal from "./components/ConfirmationModal";

import {
  getJobsPostedBy,
  deleteJob,
  updateJobStatus,
} from "../../Services/JobService";

const EmployerRequirements = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    data: null,
  });
  // 1. ADD THIS HELPER
<<<<<<< Updated upstream
  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";
    const posted = new Date(dateValue);
    const now = new Date();

    if (isNaN(posted.getTime())) return dateValue;

    const diffInMs = now - posted;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return posted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
=======
const getRelativeTime = (dateValue) => {
  if (!dateValue) return "Recently";
  const posted = new Date(dateValue);
  const now = new Date();

  if (isNaN(posted.getTime())) return dateValue;

  const diffInMs = now - posted;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return posted.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
>>>>>>> Stashed changes

  useEffect(() => {
    if (!user?.id) return;

    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await getJobsPostedBy(user.id);

        const mappedJobs = (res || []).map((job) => ({
          id: job.id,
          title: job.jobTitle || "Job Title Not Provided",
          location: job.fullWorkAddress || "Location not specified",
<<<<<<< Updated upstream
          postedDate: getRelativeTime(job.postedDate || job.createdAt),
          expiryDate: job.applicationDeadline
            ? new Date(job.applicationDeadline).toDateString()
            : "Not specified",
=======
postedDate: getRelativeTime(job.postedDate || job.createdAt),    
      expiryDate: job.applicationDeadline ? new Date(job.applicationDeadline).toDateString() : "Not specified",
>>>>>>> Stashed changes
          status: job.jobStatus ? job.jobStatus.toLowerCase() : "draft",
          applications: job.applicants?.length ?? 0,
          views: Math.floor(Math.random() * 300) + 50,
          recentApplicants:
            job.applicants?.slice(0, 3).map((a) => ({
              name: a?.name || "Applicant",
              time: "Recently applied",
            })) || [],
          metrics: {
            applicationRate: "18%",
            responseTime: "4.2 hrs",
            qualityScore: "8.3",
          },
        }));

        setRequirements(mappedJobs);
      } catch (err) {
        console.error("Failed to load employer jobs:", err);
        setRequirements([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user]);

  const handleEdit = (id) => navigate(`/post-job-requirement/${id}`);
  const handleViewDetails = (id) => navigate(`/requirement-details/${id}`);

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Job",
      message: "This action cannot be undone.",
      data: id,
    });
  };

  const handlePause = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Close Job",
      message:
        "Are you sure you want to close this job? It will be marked as EXPIRED and hidden from applicants.",
      data: id,
    });
  };

  const handleConfirmAction = async () => {
    const jobId = confirmModal.data;
    setLoading(true);
    try {
      if (confirmModal.title === "Delete Job") {
        await deleteJob(jobId);
        setRequirements((prev) => prev.filter((req) => req.id !== jobId));
      } else if (confirmModal.title === "Close Job") {
        await updateJobStatus(jobId, "EXPIRED");
        setRequirements((prev) =>
          prev.map((req) =>
            req.id === jobId ? { ...req, status: "expired" } : req
          )
        );
      }
    } catch (err) {
      console.error("Action failed:", err);
      alert("Operation failed. Please try again.");
    } finally {
      setLoading(false);
      setConfirmModal({ isOpen: false, title: "", message: "", data: null });
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <EmployerSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
          {/* HEADER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Job Requirements
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage and track your job postings
              </p>
            </div>

            <Button
              className="w-full sm:w-auto"
              iconName="Plus"
              onClick={() => navigate("/post-job-requirement/0")}
            >
              Post New Job
            </Button>
          </div>

          <DashboardMetrics
            metrics={[
              {
                icon: "FileText",
                label: "Total Jobs",
                value: requirements.length,
                description: "All posted jobs",
              },
              {
                icon: "Users",
                label: "Applications",
                value: requirements.reduce((sum, r) => sum + r.applications, 0),
                description: "Across all jobs",
              },
              {
                icon: "Eye",
                label: "Views",
                value: "—",
                description: "Mock data",
              },
              {
                icon: "TrendingUp",
                label: "Response Rate",
                value: "18%",
                description: "Industry average",
              },
            ]}
          />

          <div className="bg-white rounded-lg sm:rounded-xl border border-border shadow-sm w-full overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 space-y-3">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground font-medium">
                  Fetching requirements...
                </p>
              </div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="inline-flex p-3 bg-muted rounded-full mb-4">
<<<<<<< Updated upstream
                  <Icon
                    name="Briefcase"
                    size={28}
                    className="text-muted-foreground"
                  />
=======
                  <Icon name="Briefcase" size={28} className="text-muted-foreground" />
>>>>>>> Stashed changes
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  No jobs posted yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto mt-2">
<<<<<<< Updated upstream
                  Start by creating your first job requirement to attract top
                  talent.
=======
                  Start by creating your first job requirement to attract top talent.
>>>>>>> Stashed changes
                </p>
                <Button
                  variant="outline"
                  className="mt-5 w-full sm:w-auto"
                  onClick={() => navigate("/post-job-requirement/0")}
                >
                  Create First Posting
                </Button>
              </div>
            ) : viewMode === "table" ? (
              <div className="w-full overflow-x-auto">
                <table className="min-w-[760px] w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="px-3 py-3 hidden sm:table-cell"></th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground">
                        Job Details
                      </th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground hidden md:table-cell">
                        Posted
                      </th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground">
                        Applicants
                      </th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground hidden sm:table-cell">
                        Views
                      </th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground">
                        Status
                      </th>
                      <th className="px-3 py-3 text-[11px] font-semibold uppercase text-muted-foreground hidden lg:table-cell">
                        Expiry
                      </th>
                      <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requirements.map((req) => (
                      <RequirementRow
                        key={req.id}
                        requirement={req}
                        onEdit={handleEdit}
                        onPause={handlePause}
                        onDelete={handleDelete}
                        onView={handleViewDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 p-4 sm:p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-muted/10">
                {requirements.map((req) => (
                  <RequirementCard
                    key={req.id}
                    requirement={req}
                    onEdit={handleEdit}
                    onPause={handlePause}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() =>
          setConfirmModal({ isOpen: false, title: "", message: "", data: null })
        }
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default EmployerRequirements;
