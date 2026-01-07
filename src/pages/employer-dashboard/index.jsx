import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query'; // ✅ Added for caching
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* =========================================================
      DATA FETCHING & CACHING (REACT QUERY)
  ========================================================= */
  const { data, isLoading: loading, refetch } = useQuery({
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

      // Maintain original mapping logic
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: !!user?.id,
  });

  // Extract data with fallbacks for first render
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} p-4 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Employer'}!
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                <Icon name="Calendar" size={16} />
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="p-2.5 rounded-xl border bg-card hover:bg-muted transition-all active:scale-95 shadow-sm">
                <Icon name="RefreshCw" size={20} className={isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"} />
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
                  <p className="text-2xl font-black">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="card bg-card border-none shadow-sm overflow-hidden">
                <div className="p-6 border-b border-muted/50 flex justify-between items-center">
                   <h3 className="font-bold text-lg flex items-center gap-2 uppercase tracking-tight">
                     <Icon name="List" size={20} className="text-primary" /> Recent Requirements
                   </h3>
                   <button onClick={() => navigate('/employer-requirements')} className="text-[10px] font-black text-primary hover:underline">VIEW ALL</button>
                </div>
                <RequirementsTable requirements={requirements} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-primary" /> MyWorker List
                  </h3>
                </div>
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
                      refetch(); // ✅ Refresh the query data
                    } catch (err) {
                      console.error("❌ Failed to remove worker", err);
                    }
                  }}
                />
              </section>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section className="card p-6 bg-card border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Icon name="TrendingUp" size={40} className="text-success" />
                </div>
                <h3 className="font-black text-sm text-muted-foreground uppercase tracking-widest mb-6">Recruitment Health</h3>
                <div className="space-y-6 relative z-10">
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
                <ActivityFeed activities={[]} />
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