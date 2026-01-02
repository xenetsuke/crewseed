import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EmployerSidebar from '../../components/navigation/EmployerSidebar';
import DashboardMetrics from '../../components/ui/DashboardMetrics';
import RequirementsTable from './components/RequirementsTable';
import ActivityFeed from './components/ActivityFeed';
import WorkerManagementPanel from './components/WorkerManagementPanel';
import Icon from '../../components/AppIcon';

import WorkerProfileModal from "../requirement-details/components/WorkerProfileModal";
import ScheduleInterviewModal from "../requirement-details/components/ScheduleInterviewModal";

import { getAllProfiles, getProfile } from "../../Services/ProfileService";
import { getJobsPostedBy } from "../../Services/JobService";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workerCount, setWorkerCount] = useState(0);
  const [jobStats, setJobStats] = useState({ active: 0, totalApplicants: 0, fulfillmentRate: 65 });
  const [requirements, setRequirements] = useState([]);
  const [pipelineWorkers, setPipelineWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal States
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // --- UI Helpers ---
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleViewWorkerProfile = async (worker) => {
    try {
      const profile = await getProfile(worker.id);
      setSelectedWorker({
        id: worker.id,
        fullName: profile.fullName || worker.fullName,
        profile: { ...profile, availability: profile.availability ?? ["Available"] },
        applicationStatus: worker.pipelineStatus?.toUpperCase() || "APPLIED",
      });
      setShowProfileModal(true);
    } catch (err) {
      console.error("❌ Failed to load worker profile", err);
    }
  };

  const fetchData = async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    try {
      setLoading(true);
      const [profileRes, jobsRes] = await Promise.all([
        getAllProfiles(),
        getJobsPostedBy(user.id)
      ]);

      const allWorkers = (profileRes || []).filter(p => p.accountType === "APPLICANT");
      setWorkerCount(allWorkers.length);

      const demoPipeline = allWorkers.slice(0, 8).map((w, idx) => ({
        ...w,
        pipelineStatus: idx % 3 === 0 ? 'saved' : idx % 3 === 1 ? 'interviewing' : 'hired'
      }));
      setPipelineWorkers(demoPipeline);

      setJobStats({
        active: jobsRes.filter(j => j.jobStatus?.toLowerCase() === 'active').length,
        totalApplicants: jobsRes.reduce((sum, job) => sum + (job.applicants?.length || 0), 0),
        fulfillmentRate: 72 // Demo value
      });

      setRequirements(jobsRes.slice(0, 5).map(job => ({
        id: job.id,
        position: job.jobTitle || "Untitled Position",
        location: job.fullWorkAddress || "Site Location",
        icon: "HardHat",
        applications: job.applicants?.length || 0,
        status: job.jobStatus?.toLowerCase() || "draft",
        postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent",
      })));

    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} p-4 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
          
          {/* --- HEADER SECTION --- */}
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
              <button onClick={fetchData} className="p-2.5 rounded-xl border bg-card hover:bg-muted transition-all active:scale-95 shadow-sm">
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

          {/* --- METRICS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
               { icon: 'Briefcase', label: 'Active Jobs', value: jobStats.active, color: 'text-primary', bg: 'bg-primary/10' },
               { icon: 'Users', label: 'Talent Pool', value: workerCount, color: 'text-blue-500', bg: 'bg-blue-500/10' },
               { icon: 'UserCheck', label: 'In Pipeline', value: pipelineWorkers.length, color: 'text-success', bg: 'bg-success/10' },
               { icon: 'Clock', label: 'Interviews', value: '12', color: 'text-warning', bg: 'bg-warning/10' },
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
            {/* --- LEFT COLUMN: CORE TABLES --- */}
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
                    <Icon name="Users" size={20} className="text-primary" /> Active Pipeline
                  </h3>
                </div>
                <WorkerManagementPanel
                  workers={pipelineWorkers}
                  onViewProfile={handleViewWorkerProfile}
                />
              </section>
            </div>

            {/* --- RIGHT COLUMN: ANALYTICS & FEED --- */}
            <div className="lg:col-span-4 space-y-6">
              {/* COMPANY OVERVIEW CARD */}
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

      {/* --- MODALS --- */}
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