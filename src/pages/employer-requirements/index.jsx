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

import { getJobsPostedBy, deleteJob, updateJobStatus } from "../../Services/JobService";

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
          postedDate: job.createdAt ? new Date(job.createdAt).toDateString() : "Recently posted",
          expiryDate: job.applicationDeadline ? new Date(job.applicationDeadline).toDateString() : "Not specified",
          status: job.jobStatus ? job.jobStatus.toLowerCase() : "draft",
          applications: job.applicants?.length ?? 0,
          views: Math.floor(Math.random() * 300) + 50,
          recentApplicants: job.applicants?.slice(0, 3).map((a) => ({
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
      message: "Are you sure you want to close this job? It will be marked as EXPIRED and hidden from applicants.",
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
          prev.map((req) => req.id === jobId ? { ...req, status: "expired" } : req)
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <EmployerSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className={`flex-1 transition-all duration-300 w-full ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

          {/* HEADER - Responsive stack on small mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Requirements</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
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

          {/* METRICS - Handles its own internal responsive grid */}
          <DashboardMetrics metrics={[
            { icon: "FileText", label: "Total Jobs", value: requirements.length, description: "All posted jobs" },
            { icon: "Users", label: "Applications", value: requirements.reduce((sum, r) => sum + r.applications, 0), description: "Across all jobs" },
            { icon: "Eye", label: "Views", value: "—", description: "Mock data" },
            { icon: "TrendingUp", label: "Response Rate", value: "18%", description: "Industry average" },
          ]} />

          {/* JOB LIST CONTAINER */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-muted-foreground font-medium">Fetching requirements...</p>
              </div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                  <Icon name="Briefcase" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold">No jobs posted yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                  Start by creating your first job requirement to attract top talent.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => navigate("/post-job-requirement/0")}>
                  Create First Posting
                </Button>
              </div>
            ) : viewMode === "table" ? (
              /* TABLE VIEW - Fixed for responsiveness */
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full border-collapse min-w-[600px] md:min-w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border text-left">
                      <th className="px-4 py-4 w-10 hidden sm:table-cell"></th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Details</th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Posted</th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Views</th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Expiry</th>
                      <th className="px-4 py-4 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
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
              /* GRID VIEW */
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-muted/10">
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
        onClose={() => setConfirmModal({ isOpen: false, title: "", message: "", data: null })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default EmployerRequirements;