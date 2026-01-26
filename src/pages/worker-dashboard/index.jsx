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

  // Musical Loading Component
  const MusicalLoader = () => (
    <div className="flex items-center justify-center gap-1 h-12">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className="w-1.5 bg-[#23acf6] rounded-full animate-musical-bar"
          style={{
            animationDelay: `${bar * 0.1}s`,
            height: '100%'
          }}
        />
      ))}
    </div>
  );

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

  useEffect(() => {
    if (profile && profile.Workeravailability !== undefined) {
      setIsAvailable(profile.Workeravailability);
    }
  }, [profile]);

  const handleAvailabilityToggle = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    try {
      const updatedProfile = { ...profile, id: user.id || profile.id, Workeravailability: newStatus };
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
    { id: "profile", icon: "User", label: t("dashboard.actions.profile"), subtitle: `${workerData.profileCompletion}%`, color: "#23acf6", bgColor: "bg-[#23acf6]/10", route: "/worker-profile" },
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
    finally { setTimeout(() => setIsRefreshing(false), 800); } // Small delay to enjoy the animation
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
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
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .card { border-radius: 24px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .card:hover { transform: translateY(-4px); }
        `}
      </style>

      <WorkerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 lg:p-8 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                {getGreeting()}, <span className="text-[#23acf6]">{workerData.name.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh} 
                disabled={isRefreshing} 
                className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <Icon name="RefreshCw" size={20} className={`${isRefreshing ? "animate-spin text-[#23acf6]" : "text-slate-400 group-hover:text-[#23acf6]"}`} />
              </button>
              <button onClick={() => navigate("/worker-profile")} className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#23acf6] to-[#1a8bc7] text-white flex items-center justify-center font-bold shadow-inner">
                  {workerData.name[0]}
                </div>
                <span className="font-bold text-sm hidden sm:block">{t("dashboard.actions.settings")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Availability Hero */}
            <div className="lg:col-span-2 card p-8 flex items-center justify-between bg-white border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative group">
              <div className="relative z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                   {isAvailable ? t("dashboard.status.online") : t("dashboard.status.offline")}
                </div>
                <h3 className="font-black text-2xl mb-1 text-slate-800">{isAvailable ? t("dashboard.status.active") : t("dashboard.status.away")}</h3>
                <p className="text-sm text-slate-500 font-medium max-w-[280px]">
                  {isAvailable ? t("dashboard.status.visible") : t("dashboard.status.hidden")}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 z-10">
                <button 
                  onClick={handleAvailabilityToggle} 
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 ${isAvailable ? "bg-[#23acf6] shadow-lg shadow-[#23acf6]/30" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-white shadow-md transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isAvailable ? "translate-x-10" : ""}`} />
                </button>
              </div>
              <Icon name="Zap" size={140} className="absolute -right-8 -bottom-10 text-[#23acf6] opacity-[0.05] group-hover:rotate-12 transition-transform duration-700" />
            </div>

            {/* Rating Card */}
            <div className="card p-8 bg-white border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{t("dashboard.rating.label")}</h3>
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-[6px] border-slate-50 flex items-center justify-center relative">
                  <span className="text-4xl font-black text-slate-800">{workerData.rating}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#23acf6]" strokeDasharray={276} strokeDashoffset={276 - (276 * workerData.rating) / 5} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("dashboard.rating.basedOn", { count: workerData.totalJobs })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Recommended Jobs */}
              <section>
                <div className="flex items-center justify-between mb-6 px-1">
                  <h3 className="font-black text-xl flex items-center gap-3 text-slate-800">
                    <div className="p-2 rounded-xl bg-[#23acf6]/10 text-[#23acf6]">
                      <Icon name="Briefcase" size={20} />
                    </div>
                    {t("dashboard.jobs.matchedTitle")}
                  </h3>
                  <button onClick={() => navigate("/worker-job-list")} className="text-xs font-black uppercase tracking-widest text-[#23acf6] hover:translate-x-1 transition-transform">{t("common.seeAll")}</button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                  {isLoadingJobs || isRefreshing ? (
                    <div className="w-full flex justify-center py-10 bg-white rounded-3xl border border-slate-50">
                      <MusicalLoader />
                    </div>
                  ) : recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job.id} className="card p-6 min-w-[300px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#23acf6]/30 cursor-pointer group" onClick={() => navigate("/assignment-detail", { state: { jobId: job.id } })}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#23acf6] group-hover:text-white transition-all">
                          <Icon name="Briefcase" size={18} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Verified</span>
                      </div>
                      <h4 className="font-black text-lg text-slate-800 truncate mb-1">{job.jobTitle || job.title}</h4>
                      <p className="text-xs text-slate-500 font-bold mb-6">{job.employer?.companyName || t("dashboard.jobs.verifiedRecruiter")}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="text-lg font-black text-[#23acf6]">
                          ₹{job.baseWageAmount || job.wage}<span className="text-[10px] text-slate-400 font-bold uppercase ml-1">/{t("common.day")}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#23acf6] group-hover:text-white transition-all">
                          <Icon name="ArrowUpRight" size={16} />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="w-full py-16 text-center bg-white rounded-[32px] border border-slate-100">
                      <Icon name="Search" size={40} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t("dashboard.jobs.looking")}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Activity Feed */}
              <section className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <ActivityFeed activities={getDynamicActivities()} />
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">{t("dashboard.shortcuts.label")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <div key={action.id} onClick={() => navigate(action.route)} className="card p-5 bg-white border border-slate-100 shadow-sm hover:shadow-lg cursor-pointer group">
                      <div className={`w-12 h-12 rounded-2xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon name={action.icon} size={22} style={{ color: action.color }} />
                      </div>
                      <h4 className="font-black text-xs text-slate-800">{action.label}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{action.subtitle}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Financial Section */}
              <section className="card p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                    <Icon name="TrendingUp" size={80} className="text-[#23acf6]" />
                </div>
                <h3 className="font-black text-lg mb-8 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Icon name="DollarSign" size={18} className="text-[#23acf6]" />
                  </div>
                  {t("dashboard.financial.title")}
                </h3>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dashboard.financial.calculated")}</span>
                      <span className="text-3xl font-black text-white">
                        ₹{calculatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#23acf6] rounded-full shadow-[0_0_15px_rgba(35,172,246,0.5)] animate-pulse" style={{ width: "100%" }} />
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-[#23acf6]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#23acf6] animate-pulse shadow-[0_0_8px_#23acf6]" />
                      <p className="text-[10px] font-black uppercase tracking-widest truncate">{t("dashboard.financial.latest")}: {recentCompany}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dashboard.financial.profileStrength")}</span>
                      <span className="text-sm font-black text-[#23acf6]">{workerData.profileCompletion}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#23acf6] to-emerald-400 rounded-full" style={{ width: `${workerData.profileCompletion}%` }} />
                    </div>
                  </div>
                </div>
                
                <button onClick={() => navigate("/worker-assignments")} className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] hover:bg-[#23acf6] hover:border-[#23acf6] transition-all uppercase tracking-widest">
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