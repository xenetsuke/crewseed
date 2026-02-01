import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { updateProfile } from "../../Services/ProfileService";
import { getAllJobs } from "../../Services/JobService";
import { changeProfile, setProfile } from "../../features/ProfileSlice";
import { getProfile } from "../../Services/ProfileService";

function WorkerJobList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    quickFilters: [],
    industry: [],
    jobType: [],
    shiftTiming: [],
  });

  const searchInputRef = useRef(null);

  const quickFilterOptions = [
    { id: "nearMe", label: "Near Me", icon: "MapPin" },
    { id: "highPay", label: "High Pay", icon: "IndianRupee" },
    { id: "immediateStart", label: "Immediate Start", icon: "Zap" },
    { id: "mySkills", label: "My Skills", icon: "Award" },
  ];

  const industryOptions = [
    "Construction",
    "Manufacturing",
    "Hospitality",
    "Retail",
    "Healthcare",
    "Transportation",
  ];
console.log("🟡 WorkerJobList mounted");

  /* =========================================================
      REACT QUERY: CACHED FETCHING
  ========================================================= */
  const {
    data: jobs,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["allJobs"],
    queryFn: getAllJobs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("🟢 JOBS FROM QUERY:", jobs);
    console.log("⏳ isLoading:", isLoading, "isFetching:", isFetching);
  }, [jobs, isLoading, isFetching]);

  /* =========================================================
      DERIVED STATE: FILTERING
  ========================================================= */
  const filteredJobs = useMemo(() => {
    // 1. First, exclude jobs where customJob is true
    if (!Array.isArray(jobs)) return [];

    let updated = jobs.filter((job) => job.customJob !== true);

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const lowQuery = searchQuery.toLowerCase();
      updated = updated.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(lowQuery) ||
          job.fullWorkAddress?.toLowerCase().includes(lowQuery) ||
          job?.employer?.companyName?.toLowerCase().includes(lowQuery),
      );
    }

    // 3. Filter by industry
    if (activeFilters.industry.length > 0) {
      updated = updated.filter((job) =>
        activeFilters.industry.includes(job.industryCategory),
      );
    }

    // 4. Sort by high pay if selected
    if (activeFilters.quickFilters.includes("highPay")) {
      updated.sort(
        (a, b) => (b?.baseWageAmount || 0) - (a?.baseWageAmount || 0),
      );
    }

    return updated;
  }, [jobs, activeFilters, searchQuery]);

  useEffect(() => {
    if (searchExpanded && searchInputRef?.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  /* =========================================================
      DATE LOGIC
  ========================================================= */
  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";
    let cleanDate =
      typeof dateValue === "string" ? dateValue.replace(",", "") : dateValue;
    const posted = new Date(cleanDate);
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

  /* =========================================================
      EVENT HANDLERS
  ========================================================= */
  const handleQuickFilterToggle = (id) => {
    setActiveFilters((prev) => ({
      ...prev,
      quickFilters: prev.quickFilters.includes(id)
        ? prev.quickFilters.filter((f) => f !== id)
        : [...prev.quickFilters, id],
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      quickFilters: [],
      industry: [],
      jobType: [],
      shiftTiming: [],
    });
    setSearchQuery("");
  };

  const handleSaveJob = async (jobId) => {
    if (!profile?.id) return;
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

  const handleViewJobDetails = (jobId) => {
    navigate("/mobile-job-details", { state: { assignmentId: jobId } });
  };

  // Musical Loader Sub-component
  const MusicalLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <style>
        {`
          @keyframes musical-bar {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          .animate-musical-bar {
            animation: musical-bar 0.8s ease-in-out infinite;
            transform-origin: bottom;
          }
        `}
      </style>
      <div className="flex items-center justify-center gap-1.5 h-12">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className="w-2 bg-[#23acf6] rounded-full animate-musical-bar"
            style={{
              animationDelay: `${bar * 0.1}s`,
              height: "100%",
            }}
          />
        ))}
      </div>
      <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#23acf6] animate-pulse">
        Fetching Jobs
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`main-content transition-all duration-300 ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Available Jobs</h1>
                <p className="text-sm text-muted-foreground">
{!isLoading && !isFetching && `${filteredJobs.length} jobs found`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!searchExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchExpanded(true)}
                  >
                    <Icon name="Search" size={20} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="relative"
                >
                  <Icon name="Filter" size={20} />
                  {activeFilters.quickFilters.length +
                    activeFilters.industry.length >
                    0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                      {activeFilters.quickFilters.length +
                        activeFilters.industry.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {searchExpanded && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex-1 relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search jobs, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickFilterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleQuickFilterToggle(f.id)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeFilters.quickFilters.includes(f.id)
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon name={f.icon} size={16} />
                  <span className="text-sm font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="border-t border-border bg-muted/30 p-4">
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((ind) => (
                  <label
                    key={ind}
                    className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.industry.includes(ind)}
                      onChange={(e) => {
                        const newInd = e.target.checked
                          ? [...activeFilters.industry, ind]
                          : activeFilters.industry.filter((i) => i !== ind);
                        setActiveFilters({
                          ...activeFilters,
                          industry: newInd,
                        });
                      }}
                    />
                    <span className="text-sm">{ind}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          {isLoading || isFetching ? (
            <MusicalLoader />
          ) : !Array.isArray(jobs) ? (
            <MusicalLoader />
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                name="Briefcase"
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <Button variant="ghost" onClick={handleClearAllFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => {
                const isSaved = profile.savedJobs?.includes(job.id);
                const userApplication = job.applicants?.find(
                  (app) => app.applicantId === user?.id,
                );
                const appStatus = userApplication?.applicationStatus;
                const isApplied = !!appStatus;

                const companyLogo = job?.employer?.picture
                  ? `data:image/jpeg;base64,${job.employer.picture}`
                  : "/company-placeholder.png";
                const companyName = job?.employer?.companyName || "Company";

                return (
                  <div
                    key={job.id}
                    className="card p-5 hover:shadow-md cursor-pointer transition-all border border-border bg-white rounded-xl"
                    onClick={() => handleViewJobDetails(job.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                        <Image
                          src={companyLogo}
                          alt={companyName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold truncate pr-2">
                            {job.jobTitle}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(job.id);
                            }}
                            className={`p-2 rounded-full transition-colors ${
                              isSaved
                                ? "text-[#23acf6] bg-[#23acf6]/10"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon
                              name="Bookmark"
                              size={18}
                              fill={isSaved ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        <p className="text-sm font-medium text-slate-600 truncate">
                          {companyName}
                        </p>

                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Icon name="MapPin" size={14} />
                          <span className="truncate">
                            {job.fullWorkAddress}
                          </span>
                        </div>

                        <div className="mt-4 bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                              {job.paymentFrequency || "WAGE"}
                            </p>
                            <p className="text-lg font-black text-[#23acf6]">
                              ₹{job.baseWageAmount}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                              EXPERIENCE
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                              {job?.experienceLevel?.replace("_", " ") ||
                                "Freshers"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Icon
                                name="Clock"
                                size={14}
                                className="text-[#23acf6]"
                              />
                              <span>
                                {getRelativeTime(
                                  job?.postedDate || job?.createdAt,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Icon
                                name="Users"
                                size={14}
                                className="text-blue-500"
                              />
                              <span>{job?.numberOfWorkers || 1} open</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 mb-4 overflow-x-auto scrollbar-hide">
                          {job?.transportProvided && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100 uppercase">
                              Transport
                            </span>
                          )}
                          {job?.foodProvided && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded border border-orange-100 uppercase">
                              Food
                            </span>
                          )}
                          {job?.accommodationProvided && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded border border-purple-100 uppercase">
                              Stay
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            fullWidth
                            className="h-10 text-xs font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewJobDetails(job.id);
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            variant="default"
                            fullWidth
                            className={`h-10 text-xs font-bold ${
                              isApplied
                                ? appStatus === "REJECTED"
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                                : ""
                            }`}
                            disabled={isApplied}
                          >
                            {isApplied
                              ? appStatus === "APPLIED"
                                ? "Applied"
                                : appStatus.replace("_", " ")
                              : "Apply Now"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(activeFilters.quickFilters.length > 0 || searchQuery) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <Button
              onClick={handleClearAllFilters}
              className="shadow-xl rounded-full px-6 py-2 h-auto text-sm font-bold"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerJobList;
