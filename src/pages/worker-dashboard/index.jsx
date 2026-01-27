import React, { useState, useEffect, useMemo } from "react";
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

  // --- 📊 FINANCIAL LOGIC (CALCULATED FROM PREVIOUS CODE) ---
  const assignments = profile?.recentAssignments || [];
  
  const calculatedTotal = useMemo(() => {
    return assignments.reduce((sum, job) => sum + (Number(job.baseMonthlyPay) || 0), 0);
  }, [assignments]);

  const recentCompany = useMemo(() => {
    return assignments.length > 0 
      ? (assignments[0].companyName || assignments[0].company) 
      : t("dashboard.financial.noRecentWork");
  }, [assignments, t]);

  // Musical Loading Component
  const MusicalLoader = () => (
    <div className="flex items-end justify-center gap-1.5 h-10">
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
    totalJobs: profile?.statistics?.totalJobsCompleted || assignments.length || 0,
    rating: profile?.statistics?.averageRating || 0,
    totalEarnings: profile?.statistics?.totalEarnings || calculatedTotal,
  };

  const quickActions = [
    { id: "profile", icon: "User", label: t("dashboard.actions.profile"), subtitle: `${workerData.profileCompletion}%`, color: "#23acf6", bgColor: "bg-[#23acf6]/10", route: "/worker-profile" },
    { id: "applications", icon: "Send", label: t("dashboard.actions.applications"), subtitle: t("dashboard.actions.manage"), color: "#10b981", bgColor: "bg-emerald-50", route: "/worker-assignments" },
    { id: "documents", icon: "FileText", label: t("dashboard.actions.documents"), subtitle: t("dashboard.actions.verify"), color: "#f59e0b", bgColor: "bg-amber-50", route: "/worker-profile" },
    { id: "history", icon: "Clock", label: t("dashboard.actions.history"), subtitle: t("dashboard.actions.past"), color: "#6366f1", bgColor: "bg-indigo-50", route: "/worker-assignments" },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await getAllJobs();
      const jobsList = Array.isArray(data) ? data : data?.jobs || [];
      setRecommendedJobs(filterJobs(jobsList));
    } catch (e) { console.error("❌ Refresh Error:", e); }
    finally { setTimeout(() => setIsRefreshing(false), 800); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#23acf6]/20">
      <style>
        {`
          @keyframes musical-bar {
            0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
            50% { transform: scaleY(1); opacity: 1; }
          }
          .animate-musical-bar {
            animation: musical-bar 0.8s ease-in-out infinite;
            transform-origin: bottom;
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .card-modern { 
            background: white;
            border: 1px solid #f1f5f9;
            border-radius: 28px; 
            transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1); 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
          }
          .card-modern:hover { 
            transform: translateY(-6px); 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            border-color: #e2e8f0;
          }
        `}
      </style>

      <WorkerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 lg:p-10 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#23acf6]/10 text-[#23acf6] text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#23acf6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#23acf6]"></span>
                </span>
                {t("live-Updates")}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                {getGreeting()}, <br />
                <span className="text-[#23acf6]">{workerData.name.split(' ')[0]}</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh} 
                disabled={isRefreshing} 
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-90 group"
              >
                <Icon name="RefreshCw" size={22} className={`${isRefreshing ? "animate-spin text-[#23acf6]" : "text-slate-400 group-hover:text-[#23acf6]"}`} />
              </button>
              <button onClick={() => navigate("/worker-profile")} className="group flex items-center gap-3 pr-5 pl-2 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#d1ec44] flex items-center justify-center font-black shadow-lg group-hover:rotate-6 transition-transform">
                  {workerData.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">My Account</p>
                  <p className="font-bold text-sm leading-none">{t("dashboard.actions.settings")}</p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Status Hero */}
            <div className="lg:col-span-2 card-modern p-10 flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Availability Status</p>
                <h3 className="font-black text-3xl mb-2 text-slate-800">
                  {isAvailable ? t("dashboard.status.active") : t("dashboard.status.away")}
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-[300px] leading-relaxed">
                  {isAvailable ? t("dashboard.status.visible") : t("dashboard.status.hidden")}
                </p>
                
                <div className="mt-8 flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest ${isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {isAvailable ? "Discoverable" : "Private Mode"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 z-10">
                <button 
                  onClick={handleAvailabilityToggle} 
                  className={`relative w-24 h-12 rounded-full transition-all duration-500 shadow-inner ${isAvailable ? "bg-[#23acf6]" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-1.5 left-1.5 w-9 h-9 rounded-full bg-white shadow-xl transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center ${isAvailable ? "translate-x-12" : "translate-x-0"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-[#23acf6]" : "bg-slate-300"}`} />
                  </div>
                </button>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#23acf6]/5 rounded-full blur-3xl group-hover:bg-[#23acf6]/10 transition-colors" />
              <Icon name="Zap" size={160} className="absolute -right-6 -bottom-8 text-slate-100 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
            </div>

            {/* Rating Card */}
            <div className="card-modern p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t("dashboard.rating.label")}</p>
              <div className="relative mb-8">
                <div className="w-28 h-28 rounded-full border-[8px] border-slate-50 flex items-center justify-center relative shadow-inner">
                  <span className="text-5xl font-black text-slate-800 tracking-tighter">{workerData.rating}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="52" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#23acf6]" strokeDasharray={326} strokeDashoffset={326 - (326 * workerData.rating) / 5} strokeLinecap="round" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-full border-4 border-white flex items-center justify-center">
                   <Icon name="Star" size={14} className="text-[#d1ec44] fill-current" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t("dashboard.rating.basedOn", { count: workerData.totalJobs })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              
              {/* Recommended Jobs Slider */}
              <section>
                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#d1ec44] flex items-center justify-center shadow-lg">
                      <Icon name="Briefcase" size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-slate-800 tracking-tight">{t("dashboard.jobs.matchedTitle")}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top picks for your skills</p>
                    </div>
                  </div>
                  <button onClick={() => navigate("/worker-job-list")} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#23acf6]">
                    {t("common.seeAll")}
                    <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
                  {isLoadingJobs || isRefreshing ? (
                    <div className="w-full flex items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                      <MusicalLoader />
                    </div>
                  ) : recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job.id} className="card-modern p-7 min-w-[320px] cursor-pointer group" onClick={() => navigate("/assignment-detail", { state: { jobId: job.id } })}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#23acf6] group-hover:text-white transition-all shadow-sm">
                          <Icon name="Zap" size={20} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">New</span>
                          <span className="text-[9px] text-slate-300 font-bold uppercase">Today</span>
                        </div>
                      </div>
                      <h4 className="font-black text-xl text-slate-800 truncate mb-1 group-hover:text-[#23acf6] transition-colors">{job.jobTitle || job.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mb-8 flex items-center gap-1.5">
                        <Icon name="MapPin" size={12} />
                        {job.employer?.companyName || t("dashboard.jobs.verifiedRecruiter")}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Base Wage</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">
                            ₹{job.baseWageAmount || job.wage}<span className="text-xs text-slate-400 font-medium ml-1">/day</span>
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-[#d1ec44] transition-all shadow-sm">
                          <Icon name="ArrowUpRight" size={20} />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="w-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={24} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t("dashboard.jobs.looking")}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Activity Feed Container */}
              <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-[#23acf6]/10 text-[#23acf6] flex items-center justify-center">
                      <Icon name="Activity" size={20} />
                   </div>
                   <h3 className="font-black text-2xl text-slate-800 tracking-tight">Recent Updates</h3>
                </div>
                <ActivityFeed activities={getDynamicActivities()} />
              </section>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              
              {/* Financial Dashboard Card */}
              <section className="card-modern p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                <Icon name="TrendingUp" size={140} className="absolute -right-10 -top-10 text-[#23acf6] opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
                
                <div className="relative z-10">
                  <h3 className="font-black text-xl mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <Icon name="Wallet" size={18} className="text-[#23acf6]" />
                    </div>
                    {t("dashboard.financial.title")}
                  </h3>
                  
                  <div className="space-y-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{t("dashboard.financial.calculated")}</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-black text-black tracking-tighter">
                          ₹{workerData.totalEarnings.toLocaleString('en-IN')}
                        </span>
                        <Icon name="ArrowUpRight" size={16} className="text-emerald-400" />
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-[#23acf6] rounded-full shadow-[0_0_20px_rgba(35,172,246,0.6)] animate-pulse" style={{ width: "100%" }} />
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[#23acf6] animate-pulse" />
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-300 truncate">
                          {t("dashboard.financial.latest")}: <span className="text-[#23acf6]">{recentCompany}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t("dashboard.financial.profileStrength")}</span>
                        <span className="text-sm font-black text-[#d1ec44]">{workerData.profileCompletion}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#23acf6] via-[#d1ec44] to-emerald-400 rounded-full" style={{ width: `${workerData.profileCompletion}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => navigate("/worker-profile")} className="w-full mt-10 py-4 rounded-2xl bg-[#23acf6] text-slate-900 font-black text-xs hover:bg-[#d1ec44] transition-all uppercase tracking-widest shadow-lg shadow-[#23acf6]/20">
                    {t("dashboard.financial.viewHistory")}
                  </button>
                </div>
              </section>

              {/* Quick Actions Grid */}
              <section>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">{t("dashboard.shortcuts.label")}</p>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <div key={action.id} onClick={() => navigate(action.route)} className="card-modern p-6 cursor-pointer group">
                      <div className={`w-12 h-12 rounded-2xl ${action.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon name={action.icon} size={22} style={{ color: action.color }} />
                      </div>
                      <h4 className="font-black text-sm text-slate-800 mb-1">{action.label}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{action.subtitle}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;