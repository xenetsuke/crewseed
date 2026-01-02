import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

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

  const industryOptions = ['Construction', 'Manufacturing', 'Hospitality', 'Retail', 'Healthcare', 'Transportation'];

  useEffect(() => {
    if (searchExpanded && searchInputRef?.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  /* =========================================================
      FETCH JOBS
  ========================================================= */
  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      if (Array.isArray(res)) {
        setJobs(res);
        setFilteredJobs(res);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  /* =========================================================
      FETCH PROFILE
  ========================================================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const userProfile = await getProfile(user.id);
          dispatch(setProfile(userProfile));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (user?.id && !profile?.id) fetchProfile();
  }, [profile, user, dispatch]);

  /* =========================================================
      FILTER LOGIC
  ========================================================= */
  const applyFilters = (filters = activeFilters, query = searchQuery) => {
    let updated = [...jobs];

    if (query.trim()) {
      updated = updated.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(query.toLowerCase()) ||
          job.fullWorkAddress?.toLowerCase().includes(query.toLowerCase()) ||
          job?.employer?.companyName?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.quickFilters.includes("highPay")) {
      updated.sort((a, b) => (b?.baseWageAmount || 0) - (a?.baseWageAmount || 0));
    }

    if (filters.industry.length > 0) {
      updated = updated.filter((job) => 
        filters.industry.includes(job.industryCategory)
      );
    }

    setFilteredJobs(updated);
  };

  const handleQuickFilterToggle = (id) => {
    const newFilters = activeFilters.quickFilters.includes(id)
      ? activeFilters.quickFilters.filter((f) => f !== id)
      : [...activeFilters.quickFilters, id];

    const updatedState = { ...activeFilters, quickFilters: newFilters };
    setActiveFilters(updatedState);
    applyFilters(updatedState);
  };

  const handleClearAllFilters = () => {
    const reset = { quickFilters: [], industry: [], jobType: [], shiftTiming: [] };
    setActiveFilters(reset);
    setSearchQuery('');
    setFilteredJobs(jobs);
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

  return (
    <div className="min-h-screen bg-background">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Available Jobs</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} jobs found
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!searchExpanded && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchExpanded(true)}>
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
                  {activeFilters.quickFilters.length + activeFilters.industry.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                      {activeFilters.quickFilters.length + activeFilters.industry.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {searchExpanded && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex-1 relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search jobs, companies, or locations"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      applyFilters(activeFilters, e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => {setSearchExpanded(false); setSearchQuery(''); applyFilters(activeFilters, '');}}>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {industryOptions.map((ind) => (
                    <label key={ind} className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.industry.includes(ind)}
                        onChange={(e) => {
                          const newInd = e.target.checked 
                            ? [...activeFilters.industry, ind] 
                            : activeFilters.industry.filter(i => i !== ind);
                          const up = { ...activeFilters, industry: newInd };
                          setActiveFilters(up);
                          applyFilters(up);
                        }}
                      />
                      <span className="text-sm">{ind}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-10">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Briefcase" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <Button variant="ghost" onClick={handleClearAllFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => {
                const isSaved = profile.savedJobs?.includes(job.id);
                
                // 🔥 LOGIC TO GET APPLICATION STATUS
                const userApplication = job.applicants?.find(app => app.applicantId === user?.id);
                const appStatus = userApplication?.applicationStatus;
                const isApplied = !!appStatus;

                const companyLogo = job?.employer?.picture
                  ? `data:image/jpeg;base64,${job.employer.picture}`
                  : "/company-placeholder.png";
                const companyName = job?.employer?.companyName || "Company";

                return (
                  <div
                    key={job.id}
                    className="card p-6 hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => handleViewJobDetails(job.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-lg font-semibold truncate">{job.jobTitle}</h3>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSaveJob(job.id); }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              isSaved ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon name="Bookmark" size={14} />
                            {isSaved ? "Saved" : "Save"}
                          </button>
                        </div>

                        <p className="text-sm text-muted-foreground truncate">{companyName}</p>
                        <p className="text-sm text-muted-foreground truncate">{job.fullWorkAddress}</p>

                        <div className="mt-3 bg-primary/5 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{job.paymentFrequency || 'Wage'}</p>
                            <p className="text-xl font-bold text-primary">₹{job.baseWageAmount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Experience</p>
                            <p className="text-sm font-semibold">{job?.experienceLevel?.replace('_', ' ') || "Any"}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 my-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Clock" size={14} />
                            <span>{job?.shiftStartTime || "Flexible"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Users" size={14} />
                            <span>{job?.numberOfWorkers || 1} needed</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          {job?.transportProvided && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center gap-1"><Icon name="Bus" size={12} /> Transport</span>}
                          {job?.foodProvided && <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded flex items-center gap-1"><Icon name="UtensilsCrossed" size={12} /> Food</span>}
                          {job?.accommodationProvided && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded flex items-center gap-1"><Icon name="Home" size={12} /> Stay</span>}
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" fullWidth onClick={(e) => { e.stopPropagation(); handleViewJobDetails(job.id); }}>
                            View Details
                          </Button>
                          <Button 
                            variant="default" 
                            fullWidth 
                            disabled={isApplied}
                            className={isApplied ? "!bg-green-600 !text-white !opacity-100" : ""}
                          >
                            {/* 🔥 Displaying the dynamic status */}
                            {isApplied ? (appStatus === 'APPLIED' ? 'Applied' : appStatus.replace('_', ' ')) : "Apply Now"}
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
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <Button onClick={handleClearAllFilters} className="shadow-2xl rounded-full px-6">
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerJobList;   