import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bell,
  X,
  Camera,
  CheckCircle2,
  Users,
  Briefcase,
  Menu
} from "lucide-react";

import StatsOverview from "./components/StatsOverview";
import WorkerRow from "./components/WorkerRow";
import { cn } from "utils/cn";
import EmployerSidebar from "components/navigation/EmployerSidebar";
import { useQuery } from "@tanstack/react-query";
import { getJobsPostedBy } from "../../Services/JobService";
import { getAttendanceByJob } from "../../Services/AttendanceService";
import { getEmployerDashboardStats } from "Services/EmployerDashboardService";

const WorkerAttendanceHR = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState("ALL");

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const { data: jobsFromApi = [] } = useQuery({
    queryKey: ["employerJobs"],
    queryFn: getJobsPostedBy,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const changeMonth = (offset) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1));
    setSelectedDay("ALL");
  };

  const { data: attendanceByJob = [] } = useQuery({
    queryKey: ["attendance", expandedJobId],
    queryFn: () => getAttendanceByJob(expandedJobId),
    enabled: !!expandedJobId,
  });

  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      workerName: "Lakhan Yadav",
      workerId: "W103",
      message: "uploaded a site photo. Please mark attendance.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      workerName: "Ravi Kumar",
      workerId: "W101",
      message: "updated shift remarks.",
      time: "1 hour ago",
      read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const removeNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));

  const { data: statsFromApi } = useQuery({
    queryKey: ["employerDashboardStats"],
    queryFn: getEmployerDashboardStats,
  });

  const stats = statsFromApi ?? {
    totalGross: 0,
    pendingApprovals: 0,
    totalOTHours: 0,
    complianceEnabled: true,
  };

  const buildWorkers = (attendanceList = []) => {
    const map = {};
    attendanceList.forEach(a => {
      const hr = a.hrSnapshot;
      if (!hr) return;
      if (!map[hr.workerId]) {
        map[hr.workerId] = {
          workerId: hr.workerId,
          name: hr.workerName,
          role: hr.workerRole,
          dailyWage: hr.dailyWage,
          avatar: hr.workerPhoto ? `database64:image/jpeg;,${hr.workerPhoto}` : null,
          attendance: []
        };
      }
      map[hr.workerId].attendance.push({
        attendanceId: a.id,
        date: a.attendanceDate,
        checkIn: a.checkInTime,
        checkOut: a.checkOutTime,
        status: a.status === "PENDING_VERIFICATION" ? "PENDING" : a.status,
        otHours: a.otHours ?? 0,
        dayType: a.dayType ?? "FULL_DAY",
        remarks: a.employerRemark,
        sitePhoto: a.sitePhoto ? `data:image/jpeg;base64,${a.sitePhoto}` : null
      });
    });
    return Object.values(map);
  };

  const jobs = useMemo(() => {
    return jobsFromApi.map(job => ({
      jobId: `JOB${job.id}`,
      backendJobId: job.id,
      jobTitle: job.jobTitle,
      location: job.locationName || "Site",
      managerName: job.managerName?.companyName || "Bobis",
      workers: expandedJobId === job.id && attendanceByJob?.length ? buildWorkers(attendanceByJob) : [],
    }));
  }, [jobsFromApi, attendanceByJob, expandedJobId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Fixed Position */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <EmployerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area - Adjusted for Fixed Sidebar */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        "ml-0" 
      )}>
        {/* TOP STICKY BAR */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              <span className="hidden sm:inline">Manage Workforce</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative group hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Find a worker..."
                className="pl-10 pr-4 py-2 bg-slate-100/50 border-transparent border focus:border-teal-500 focus:bg-white rounded-xl text-sm w-48 lg:w-64 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={cn(
                  "p-2 lg:p-2.5 rounded-xl transition-all relative",
                  showNotifPanel ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifPanel && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
                  <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-widest text-slate-500">Live Updates</span>
                      <button onClick={markAllRead} className="text-[10px] font-black text-teal-600 hover:text-teal-700">MARK ALL AS READ</button>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className={cn("p-4 border-b last:border-0 flex gap-4 transition-colors", !n.read ? "bg-teal-50/30" : "hover:bg-slate-50")}>
                            <div className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center shrink-0">
                              <Camera className="w-5 h-5 text-teal-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-600 leading-relaxed">
                                <span className="font-bold text-slate-900">{n.workerName}</span> {n.message}
                              </p>
                              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{n.time}</span>
                            </div>
                            <button onClick={() => removeNotification(n.id)} className="text-slate-300 hover:text-rose-500 transition-colors self-start">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inbox Zero</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* HEADER & DATE SELECTOR */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10">
            <div>
              <h2 className="text-teal-600 g:text-3xl font-bold uppercase tracking-widest mb-1">Operational Overview</h2>
              {/* <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Active Jobs</h2> */}
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-fit">
              <div className="flex items-center flex-1 justify-between lg:justify-start">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center px-2 lg:px-4 gap-2 lg:gap-3">
                  <Calendar className="w-4 h-4 text-teal-500 hidden sm:block" />
                  <div className="flex items-center font-black text-[10px] lg:text-xs text-slate-700 uppercase tracking-wider">
                    <select
                      value={currentMonth}
                      onChange={(e) => setViewDate(new Date(currentYear, Number(e.target.value), 1))}
                      className="bg-transparent appearance-none cursor-pointer outline-none hover:text-teal-600"
                    >
                      {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <span className="mx-1">/</span>
                    <select
                      value={currentYear}
                      onChange={(e) => setViewDate(new Date(Number(e.target.value), currentMonth, 1))}
                      className="bg-transparent appearance-none cursor-pointer outline-none hover:text-teal-600"
                    >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* <StatsOverview stats={stats} /> */}

          {/* PROJECT LIST */}
          <div className="space-y-4 lg:space-y-6 mt-8 lg:mt-10 pb-24">
            {jobs.map(job => (
              <div key={job.jobId} className="group relative">
                <div className={cn(
                  "bg-white rounded-2xl lg:rounded-[2rem] border transition-all duration-300 overflow-hidden",
                  expandedJobId === job.backendJobId 
                    ? "border-teal-200 shadow-xl ring-4 ring-teal-500/5" 
                    : "border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md"
                )}>
                  <div
                    className="p-5 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 cursor-pointer"
                    onClick={() => setExpandedJobId(expandedJobId === job.backendJobId ? null : job.backendJobId)}
                  >
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className={cn(
                        "w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center transition-colors shrink-0",
                        expandedJobId === job.backendJobId ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600"
                      )}>
                        <MapPin className="w-6 h-6 lg:w-8 lg:h-8" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors truncate">{job.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-1 font-bold text-[10px] lg:text-[11px] uppercase tracking-widest">
                          <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-teal-500">Manager: {job.managerName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 lg:gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2 justify-start md:justify-end">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-xs lg:text-sm font-black text-slate-900">{expandedJobId === job.backendJobId ? job.workers.length : "--"} Workers</span>
                        </div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-emerald-500 uppercase mt-0.5 tracking-tighter">● Attendance active</p>
                      </div>
                      <div className={cn(
                        "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all border shrink-0",
                        expandedJobId === job.backendJobId ? "bg-slate-900 border-slate-900 text-white rotate-180" : "bg-white border-slate-200 text-slate-400"
                      )}>
                        <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                    </div>
                  </div>

                  {expandedJobId === job.backendJobId && (
                    <div className="px-4 lg:px-8 pb-5 lg:pb-8 pt-2 bg-slate-50/50">
                      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-200 p-1 lg:p-2 space-y-2 shadow-inner overflow-x-auto">
                        {job.workers.length === 0 ? (
                          <div className="py-10 lg:py-12 text-center">
                            <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-xs lg:text-sm text-slate-400 font-bold uppercase tracking-widest">No Active Records Found</p>
                          </div>
                        ) : (
                          <div className="min-w-[600px] lg:min-w-0">
                            {job.workers
                              .filter(w =>
                                w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                w.workerId.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                              .map(worker => (
                                <WorkerRow
                                  key={worker.workerId}
                                  worker={worker}
                                  viewMonth={currentMonth}
                                  viewYear={currentYear}
                                  viewDay={selectedDay}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerAttendanceHR;