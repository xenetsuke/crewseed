import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query'; 
import EmployerSidebar from '../../components/navigation/EmployerSidebar';
import RequirementsTable from './components/RequirementsTable';
import ActivityFeed from './components/ActivityFeed';
import WorkerManagementPanel from './components/WorkerManagementPanel';
import Icon from '../../components/AppIcon';

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

import { getAllProfiles, getProfile, updateProfile } from "../../Services/ProfileService";
import { getJobsPostedBy } from "../../Services/JobService";
import { changeProfile } from "../../features/ProfileSlice";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Collapsible States
  const [requirementsOpen, setRequirementsOpen] = useState(true);
  const [workersOpen, setWorkersOpen] = useState(true);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* =========================================================
      DATA FETCHING & CACHING (REACT QUERY)
  ========================================================= */
  const { data, isLoading: loading, isFetching, refetch } = useQuery({
    queryKey: ["employerDashboardData", user?.id],
    queryFn: async () => {
      const [profileRes, jobsRes] = await Promise.all([
        getAllProfiles(),
        getJobsPostedBy(user.id)
      ]);

      const allWorkers = (profileRes || []).filter(p => p.accountType === "APPLICANT");
      
      const workerStatusMap = {};
      jobsRes.forEach(job => {
        job.applicants?.forEach(app => {
          workerStatusMap[app.applicantId] = app.applicationStatus?.toUpperCase();
        });
      });

      const pipeline = allWorkers.map((w) => {
        const status = workerStatusMap[w.id];
        if (["APPLIED", "UNDER_REVIEW", "INTERVIEWING"].includes(status)) {
          return { ...w, applicationStatus: status, pipelineStatus: 'Under Review' };
        }
        if (["SELECTED", "JOINED"].includes(status)) {
          return { ...w, applicationStatus: status, pipelineStatus: 'hired' };
        }
        if (profile?.savedWorkers?.includes(w.id)) {
          return { ...w, pipelineStatus: 'saved' };
        }
        return { ...w, pipelineStatus: 'unassigned' };
      });

      const formattedRequirements = jobsRes.slice(0, 5).map(job => ({
        id: job.id,
        position: job.jobTitle || "Untitled Position",
        location: job.fullWorkAddress || "Site Location",
        icon: "HardHat",
        applications: job.applicants?.length || 0,
        status: job.jobStatus === "ACTIVE" ? "active" : job.jobStatus === "EXPIRED" ? "expired" : "draft",
        postedDate: getRelativeTime(job.postedDate || job.createdAt),
      }));

      return {
        pipelineWorkers: pipeline,
        requirements: formattedRequirements,
        workerCount: allWorkers.length,
        jobStats: {
          active: jobsRes.filter(j => j.jobStatus?.toLowerCase() === 'active').length,
          totalApplicants: jobsRes.reduce((sum, job) => sum + (job.applicants?.length || 0), 0),
          fulfillmentRate: 72
        }
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!user?.id,
  });

  const pipelineWorkers = data?.pipelineWorkers || [];
  const requirements = data?.requirements || [];
  const workerCount = data?.workerCount || 0;
  const jobStats = data?.jobStats || { active: 0, totalApplicants: 0, fulfillmentRate: 65 };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleViewWorkerProfile = async (worker) => {
    try {
      const profileData = await getProfile(worker.id);
      setSelectedWorker({
        id: worker.id,
        fullName: profileData.fullName || worker.fullName,
        profile: { ...profileData, availability: profileData.availability ?? ["Available"] },
        applicationStatus: worker.applicationStatus || "APPLIED",
      });
      setShowProfileModal(true);
    } catch (err) {
      console.error("❌ Failed to load worker profile", err);
    }
  };

  function getRelativeTime(dateValue) {
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
  }

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Reusable Section Loader (Musical/Equalizer Style)
  const SectionLoader = ({ message = "Syncing..." }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
      <div className="flex items-end gap-1 h-8">
        <div className="w-1 bg-primary/30 rounded-full animate-[bounce_0.8s_infinite] [animation-delay:0.1s]" style={{ height: '40%' }} />
        <div className="w-1 bg-primary/60 rounded-full animate-[bounce_0.8s_infinite] [animation-delay:0.3s]" style={{ height: '100%' }} />
        <div className="w-1 bg-primary rounded-full animate-[bounce_0.8s_infinite] [animation-delay:0.2s]" style={{ height: '70%' }} />
        <div className="w-1 bg-primary/40 rounded-full animate-[bounce_0.8s_infinite] [animation-delay:0.4s]" style={{ height: '50%' }} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} p-4 lg:p-8 relative`}>
        {isFetching && !loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden z-50">
            <div className="h-full bg-primary animate-[shimmer_1.5s_infinite] w-full origin-left" />
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {getGreeting()}, {profile?.companyName?.split(' ')[0] || 'Employer'}!
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                <Icon name="Calendar" size={16} />
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh} 
                disabled={isFetching}
                className="p-2.5 rounded-xl border bg-card hover:bg-muted transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Icon 
                  name="RefreshCw" 
                  size={20} 
                  className={isFetching ? "animate-spin text-primary" : "text-muted-foreground"} 
                />
              </button>
              <button
                onClick={() => navigate('/post-job-requirement/0')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <Icon name="Plus" size={18} /> Post New Job
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
               { icon: 'Briefcase', label: 'My Active Jobs', value: jobStats.active, color: 'text-primary', bg: 'bg-primary/10' },
               { icon: 'Users', label: 'Available Workers', value: workerCount, color: 'text-blue-500', bg: 'bg-blue-500/10' },
               { icon: 'Clock', label: 'Under Review', value: pipelineWorkers.filter(w => w.pipelineStatus === 'Under Review').length, color: 'text-review', bg: 'bg-success/10' },
               { icon: 'UserCheck',label: 'Hired', value: pipelineWorkers.filter(w => w.pipelineStatus === 'hired').length,  color: 'text-success',bg: 'bg-warning/10' },
            ].map((m, i) => (
              <div key={i} className="card p-5 bg-card border-none shadow-sm flex items-center gap-4 group hover:translate-y-[-2px] transition-all">
                <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center`}>
                  <Icon name={m.icon} size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.label}</p>
                  <p className="text-2xl font-black">
                    {loading ? (
                       <span className="flex gap-0.5 items-end h-5">
                         <span className="w-1 h-3 bg-slate-200 animate-pulse" />
                         <span className="w-1 h-5 bg-slate-200 animate-pulse" />
                         <span className="w-1 h-4 bg-slate-200 animate-pulse" />
                       </span>
                    ) : m.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Requirements Section */}
              <section className="card bg-card border-none shadow-sm overflow-hidden transition-all">
                <div 
                  className="p-6 border-b border-muted/50 flex justify-between items-center cursor-pointer hover:bg-muted/10"
                  onClick={() => setRequirementsOpen(!requirementsOpen)}
                >
                   <h3 className="font-bold text-lg flex items-center gap-2 uppercase tracking-tight">
                     <Icon name="List" size={20} className="text-primary" /> Recent Requirements
                   </h3>
                   <div className="flex items-center gap-4">
                     <button onClick={(e) => { e.stopPropagation(); navigate('/employer-requirements'); }} className="text-[10px] font-black text-primary hover:underline mr-2">VIEW ALL</button>
                     <Icon name={requirementsOpen ? "ChevronUp" : "ChevronDown"} size={20} className="text-muted-foreground" />
                   </div>
                </div>
                <div className={`${requirementsOpen ? 'block' : 'hidden'}`}>
                  {loading ? (
                    <SectionLoader message="Fetching Requirements" />
                  ) : (
                    <RequirementsTable requirements={requirements} />
                  )}
                </div>
              </section>

              {/* Workers Section */}
              <section className="transition-all">
                <div 
                  className="flex items-center justify-between mb-4 px-1 cursor-pointer group"
                  onClick={() => setWorkersOpen(!workersOpen)}
                >
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-primary" /> MyWorker List
                    <Icon name={workersOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </h3>
                </div>
                <div className={`${workersOpen ? 'block' : 'hidden'}`}>
                  {loading ? (
                    <SectionLoader message="Assembling Worker List" />
                  ) : (
                    <WorkerManagementPanel
                      workers={pipelineWorkers}
                      onViewProfile={handleViewWorkerProfile}
                      onRemoveWorker={async (workerId) => {
                        if (!profile?.id) return;
                        try {
                          let savedWorkers = profile.savedWorkers || [];
                          savedWorkers = savedWorkers.filter(id => id !== workerId);
                          const updatedProfile = { ...profile, savedWorkers };
                          await updateProfile(updatedProfile);
                          dispatch(changeProfile(updatedProfile));
                          refetch(); 
                        } catch (err) {
                          console.error("❌ Failed to remove worker", err);
                        }
                      }}
                    />
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section className="card p-6 bg-card border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Icon name="TrendingUp" size={40} className="text-success" />
                </div>
                <h3 className="font-black text-sm text-muted-foreground uppercase tracking-widest mb-6">Recruitment Health</h3>
                <div className="space-y-6 relative z-10">
                  {loading ? (
                    <div className="space-y-8 py-2">
                      <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
                      <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Fulfillment Rate</span>
                          <span className="text-xl font-black text-success">{jobStats.fulfillmentRate}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${jobStats.fulfillmentRate}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">App Volume</span>
                          <span className="text-xl font-black text-primary">{jobStats.totalApplicants}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-muted flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                    <Icon name="ShieldCheck" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tight">Verified Employer</p>
                    <p className="text-[10px] text-muted-foreground">Premium Account Active</p>
                  </div>
                </div>
              </section>
              <section className="card p-0 bg-card border-none shadow-sm overflow-hidden">
                <div className="p-4 border-b border-muted/50 bg-muted/20">
                  <h3 className="text-xs font-black uppercase tracking-widest">Live Activity</h3>
                </div>
                {loading ? (
                  <div className="p-8"><SectionLoader message="Updating Feed" /></div>
                ) : (
                  <ActivityFeed activities={[]} />
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <WorkerProfileModal
        worker={selectedWorker}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onScheduleInterview={(worker) => {
          setSelectedWorker(worker);
          setShowScheduleModal(true);
        }}
      />

      <ScheduleInterviewModal
        worker={selectedWorker}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={() => setShowScheduleModal(false)}
      />
    </div>
  );
};

export default EmployerDashboard;