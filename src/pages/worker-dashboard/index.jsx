import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import Icon from "../../components/AppIcon";
import ActivityFeed from "./components/ActivityFeed"; 
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile } from "../../features/ProfileSlice";
import { getAllJobs } from "../../Services/JobService";
import { useTranslation } from "react-i18next";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 📌 Updated: Synchronized with backend field 'Workeravailability'
  const [isAvailable, setIsAvailable] = useState(profile?.Workeravailability ?? true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // --- START FINANCIAL LOGIC ---
  const assignments = profile?.recentAssignments || [];
  const calculatedTotal = assignments.reduce((sum, job) => sum + (Number(job.wage) || 0), 0);
  const recentCompany = assignments.length > 0 ? assignments[0].company : t("dashboard.financial.noRecentWork");
  // --- END FINANCIAL LOGIC ---

  const getDynamicActivities = () => {
    const activities = [];
    recommendedJobs.forEach((job) => {
      const myApp = job.applicants?.find(app => app.applicantId === user.id);
      if (myApp) {
        activities.push({
          id: `app-${job.id}`,
          type: 'application',
          title: job.jobTitle || job.title,
          description: t("dashboard.activity.applicationStatus", {
            status: myApp.applicationStatus.replace('_', ' ')
          }),
          timestamp: new Date().toISOString(),
          jobId: job.id,
          actionable: true
        });
      }
    });

    if (profile?.savedJobs?.length > 0) {
      activities.push({
        id: 'saved-jobs-info',
        type: 'saved',
        title: t("dashboard.activity.savedJobs"),
        description: t("dashboard.activity.savedJobsDesc", { count: profile.savedJobs.length }),
        timestamp: new Date().toISOString(),
        route: '/worker-assignments',
        actionable: true
      });
    }

    if (profile?.profileCompletion < 90) {
      activities.push({
        id: 'prof-update',
        type: 'update',
        title: t("dashboard.activity.completeProfile"),
        description: t("dashboard.activity.completeProfileDesc"),
        timestamp: new Date().toISOString(),
        route: '/worker-profile',
        actionable: true
      });
    }

    return activities.slice(0, 5);
  };

  // 📌 Updated: Sync internal state with 'Workeravailability' from Redux
  useEffect(() => {
    if (profile && profile.Workeravailability !== undefined) {
      setIsAvailable(profile.Workeravailability);
    }
  }, [profile]);

  // 📌 Updated: Handle toggle specifically for 'Workeravailability'
  const handleAvailabilityToggle = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    try {
      const updatedProfile = { 
        ...profile, 
        id: user.id || profile.id, 
        Workeravailability: newStatus 
      };
      
      const savedProfile = await updateProfile(updatedProfile);
      dispatch(setProfile(savedProfile));
    } catch (err) {
      console.error("Failed to update availability:", err);
      setIsAvailable(!newStatus);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user?.id && (!profile || Object.keys(profile).length === 0)) {
        try {
          const profileRes = await getProfile(user.id);
          dispatch(setProfile(profileRes));
        } catch (err) { console.error("❌ Profile Load Error:", err); }
      }
    };
    loadData();
  }, [user?.id, dispatch, profile]);

  const filterJobs = (jobsList) => {
    const profileCat = profile?.category?.toLowerCase() || "";
    const userSkills = profile?.skills?.map((s) => s.toLowerCase()) || [];
    const filtered = jobsList.filter((job) => {
      const jobCat = job.category?.toLowerCase() || "";
      const jobTitle = job.jobTitle?.toLowerCase() || job.title?.toLowerCase() || "";
      return (profileCat && jobCat === profileCat) || userSkills.some((skill) => jobTitle.includes(skill));
    });
    return filtered.slice(0, 5);
  };

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!profile || Object.keys(profile).length === 0) return;
      setIsLoadingJobs(true);
      try {
        const data = await getAllJobs();
        const jobsList = Array.isArray(data) ? data : data?.jobs || [];
        setRecommendedJobs(filterJobs(jobsList));
      } catch (err) { console.error("❌ Job Fetch Error:", err); }
      finally { setIsLoadingJobs(false); }
    };
    fetchRecommendedJobs();
  }, [profile]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return t("dashboard.greeting.morning");
    if (hour < 18) return t("dashboard.greeting.afternoon");
    return t("dashboard.greeting.evening");
  };

  const workerData = {
    name: profile?.fullName || t("sidebar.worker"),
    profileCompletion: profile?.profileCompletion || 0,
    totalJobs: profile?.statistics?.totalJobsCompleted || 0,
    rating: profile?.statistics?.averageRating || 0,
    totalEarnings: profile?.statistics?.totalEarnings || 0,
  };

  const quickActions = [
    { id: "profile", icon: "User", label: t("dashboard.actions.profile"), subtitle: `${workerData.profileCompletion}%`, color: "var(--color-primary)", bgColor: "bg-primary/10", route: "/worker-profile" },
    { id: "applications", icon: "Send", label: t("dashboard.actions.applications"), subtitle: t("dashboard.actions.manage"), color: "var(--color-success)", bgColor: "bg-success/10", route: "/worker-assignments" },
    { id: "documents", icon: "FileText", label: t("dashboard.actions.documents"), subtitle: t("dashboard.actions.verify"), color: "var(--color-warning)", bgColor: "bg-warning/10", route: "/worker-profile" },
    { id: "history", icon: "Clock", label: t("dashboard.actions.history"), subtitle: t("dashboard.actions.past"), color: "var(--color-accent)", bgColor: "bg-accent/10", route: "/worker-assignments" },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await getAllJobs();
      const jobsList = Array.isArray(data) ? data : data?.jobs || [];
      setRecommendedJobs(filterJobs(jobsList));
    } catch (e) { console.error("❌ Refresh Error:", e); }
    finally { setIsRefreshing(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WorkerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {getGreeting()}, {workerData.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} disabled={isRefreshing} className="p-2.5 rounded-xl border bg-card hover:bg-muted transition-all active:scale-95">
                <Icon name="RefreshCw" size={20} className={isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"} />
              </button>
              <button onClick={() => navigate("/worker-profile")} className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                  {workerData.name[0]}
                </div>
                <span className="font-semibold text-sm hidden sm:block">{t("dashboard.actions.settings")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card p-6 flex items-center justify-between bg-card border-none shadow-sm overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1">{t("dashboard.status.label")}: {isAvailable ? t("dashboard.status.active") : t("dashboard.status.away")}</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  {isAvailable ? t("dashboard.status.visible") : t("dashboard.status.hidden")}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 z-10">
                <button 
                  onClick={handleAvailabilityToggle} 
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${isAvailable ? "bg-success shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]" : "bg-muted"}`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAvailable ? "translate-x-8" : ""}`} />
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAvailable ? "text-success" : "text-muted-foreground"}`}>
                  {isAvailable ? t("dashboard.status.online") : t("dashboard.status.offline")}
                </span>
              </div>
              <Icon name="Zap" size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12" />
            </div>

            <div className="card p-6 bg-card border-none shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">{t("dashboard.rating.label")}</h3>
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-[6px] border-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-black text-foreground">{workerData.rating}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-warning text-warning-foreground px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1">
                  <Icon name="Star" size={10} className="fill-current" /> {t("dashboard.rating.topRated")}
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className={i < Math.floor(workerData.rating) ? "text-warning fill-warning" : "text-muted-foreground"} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">{t("dashboard.rating.basedOn", { count: workerData.totalJobs })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icon name="Briefcase" size={20} className="text-primary" />
                    {t("dashboard.jobs.matchedTitle")}
                  </h3>
                  <button onClick={() => navigate("/worker-job-list")} className="text-xs font-bold text-primary hover:opacity-80">{t("common.seeAll")}</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                  {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job.id} className="card p-5 min-w-[280px] bg-card hover:border-primary/50 transition-all cursor-pointer shadow-sm group" onClick={() => navigate("/assignment-detail", { state: { jobId: job.id } })}>
                      <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">{job.jobTitle || job.title}</h4>
                      <p className="text-xs text-muted-foreground mb-4">{job.employer?.companyName || t("dashboard.jobs.verifiedRecruiter")}</p>
                      <div className="items-center justify-between mt-auto flex">
                        <div className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                          ₹{job.baseWageAmount || job.wage}/{t("common.day")}
                        </div>
                        <Icon name="ArrowUpRight" size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  )) : (
                    <div className="w-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/20">
                      <Icon name="Search" size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">{t("dashboard.jobs.looking")}</p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <ActivityFeed activities={getDynamicActivities()} />
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1">{t("dashboard.shortcuts.label")}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <div key={action.id} onClick={() => navigate(action.route)} className="card p-4 bg-card border-none hover:bg-muted/50 transition-all cursor-pointer shadow-sm group">
                      <div className={`w-10 h-10 rounded-xl ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon name={action.icon} size={20} style={{ color: action.color }} />
                      </div>
                      <h4 className="font-bold text-xs">{action.label}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">{action.subtitle}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-6 bg-card border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Icon name="TrendingUp" size={40} className="text-success" />
                </div>
                <h3 className="font-bold text-base mb-6 flex items-center gap-2">
                  {t("dashboard.financial.title")}
                </h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("dashboard.financial.calculated")}</span>
                      <span className="text-2xl font-black text-success">
                        ₹{calculatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]" style={{ width: "100%" }} />
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <p className="text-[10px] text-muted-foreground font-bold truncate">{t("dashboard.financial.latest")}: {recentCompany}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("dashboard.financial.profileStrength")}</span>
                      <span className="text-sm font-black text-primary">{workerData.profileCompletion}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${workerData.profileCompletion}%` }} />
                    </div>
                  </div>
                </div>
                
                <button onClick={() => navigate("/worker-assignments")} className="w-full mt-8 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-[10px] hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-sm">
                  {t("dashboard.financial.viewHistory")}
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;