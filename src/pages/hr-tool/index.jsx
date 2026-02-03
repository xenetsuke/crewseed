import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  Users,
  Menu,
  Plus,
  LayoutDashboard,
  Pencil,
  Loader2,
  Activity,
} from "lucide-react";
import CustomJobManager from "./CustomJobManager";
import WorkerRow from "./components/WorkerRow";
import EditAssignmentDrawer from "./components/EditAssignmentDrawer";
import ManageWorkersDrawer from "./components/ManageWorkersDrawer";
import { cn } from "utils/cn";
import EmployerSidebar from "components/navigation/EmployerSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobsPostedBy, getJob } from "../../Services/JobService";
import { getAttendanceByJob } from "../../Services/AttendanceService";
import { getAssignmentsByJob } from "../../Services/AssignmentService";
import { getProfile } from "../../Services/ProfileService";
import { useSelector } from "react-redux";

const WorkerAttendanceHR = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCustomJob, setShowCustomJob] = useState(false);
  const [frontendUpdateFlag, setFrontendUpdateFlag] = useState(0);

  const queryClient = useQueryClient();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (expandedJobId) {
      queryClient.invalidateQueries(["attendance", expandedJobId]);
      queryClient.invalidateQueries(["assignments", expandedJobId]);
    }
  }, [frontendUpdateFlag, expandedJobId]);

  const [editJobOpen, setEditJobOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [manageWorkersOpen, setManageWorkersOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const employerId = useSelector((state) => state.user?.id);

const getISTDate = () => {
  const now = new Date();

  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  return new Date(utc + istOffset);
};

const [viewDate, setViewDate] = useState(getISTDate());

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // 1. Fetch Main Jobs
  const { data: jobsFromApi = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ["employerJobs"],
    queryFn: getJobsPostedBy,
  });

  // 2. Fetch Detailed Data for Expanded Section
  const { data: attendanceResponse, isFetching: isAttendanceLoading } = useQuery({
    queryKey: ["attendance", expandedJobId],
    queryFn: () => getAttendanceByJob(expandedJobId),
    enabled: !!expandedJobId,
  });

  const { data: assignmentsByJob = [], isFetching: isAssignmentsLoading } = useQuery({
    queryKey: ["assignments", expandedJobId],
    queryFn: () => getAssignmentsByJob(expandedJobId),
    enabled: !!expandedJobId,
  });
const isExpandedContentLoading =
  isAttendanceLoading || isAssignmentsLoading;


  const { data: profilesMap = {} } = useQuery({
    queryKey: ["workerProfiles", expandedJobId],
    enabled: !!expandedJobId && assignmentsByJob.length > 0,
    queryFn: async () => {
      const map = {};
      for (const a of assignmentsByJob) {
        const profile = await getProfile(a.workerId);
        map[a.workerId] = profile;
      }
      return map;
    },
  });

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1));
  };

  const attendanceByJob = useMemo(() => {
    if (!attendanceResponse) return [];
    if (Array.isArray(attendanceResponse)) return attendanceResponse;
    if (Array.isArray(attendanceResponse.data)) return attendanceResponse.data;
    if (Array.isArray(attendanceResponse.attendances)) return attendanceResponse.attendances;
    return [];
  }, [attendanceResponse]);

  const buildWorkers = (assignments = [], attendanceList = []) => {
    const attendanceMap = {};
    if (!Array.isArray(attendanceList)) return [];

    attendanceList.forEach((a) => {
      const hr = a.hrSnapshot;
      if (!hr) return;
      const workerId = Number(hr.workerId);
      if (!attendanceMap[workerId]) attendanceMap[workerId] = [];
      attendanceMap[workerId].push({
        attendanceId: hr.attendanceId || a._id,
        date: a.attendanceDate,
        status: hr.status,
        checkIn: a.checkInTime || null,
        checkOut: a.checkOutTime || null,
        payroll: { ...hr.payroll },
        sitePhoto: a.sitePhoto ? `data:image/jpeg;base64,${a.sitePhoto}` : null,
      });
    });

    return assignments.map((a) => ({
      workerId: Number(a.workerId),
      name: profilesMap[a.workerId]?.fullName || "Worker",
      role: profilesMap[a.workerId]?.primaryJobRole || "Worker",
      assignment: a,
      attendance: attendanceMap[Number(a.workerId)] || [],
    }));
  };
const hasExpandedData =
  assignmentsByJob.length > 0 || attendanceByJob.length > 0;

const showExpandedLoader =
  isExpandedContentLoading && !hasExpandedData;

  const jobs = useMemo(() => {
    return jobsFromApi.map((job) => ({
      jobId: `JOB${job.id}`,
      backendJobId: job.id,
      jobTitle: job.jobTitle,
      fullWorkAddress: job.fullWorkAddress || "",
      managerName: job.managerName,
      City: job.city || "Site",
      workers: Number(expandedJobId) === Number(job.id) ? buildWorkers(assignmentsByJob, attendanceByJob) : [],
    }));
  }, [jobsFromApi, assignmentsByJob, attendanceByJob, expandedJobId, profilesMap]);

  // NEW MODERN LOADER COMPONENT
// MUSICAL LOADING COMPONENT
  const ModernJobLoader = () => (
    <div className="space-y-4 lg:space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative overflow-hidden bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200/60 p-5 lg:p-8 shadow-sm">
          {/* Shimmer Effect Overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-50/40 to-transparent" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 lg:gap-5">
              {/* Musical Equalizer Bars */}
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-slate-50 flex items-end justify-center gap-[3px] pb-3 px-2 overflow-hidden">
                <div className="w-1 bg-teal-300 rounded-full animate-bounce [animation-duration:0.8s]" style={{ height: '40%' }}></div>
                <div className="w-1 bg-teal-500 rounded-full animate-bounce [animation-duration:1.1s]" style={{ height: '70%' }}></div>
                <div className="w-1 bg-teal-600 rounded-full animate-bounce [animation-duration:0.9s]" style={{ height: '100%' }}></div>
                <div className="w-1 bg-teal-400 rounded-full animate-bounce [animation-duration:1.2s]" style={{ height: '60%' }}></div>
              </div>

              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-100 rounded-lg" />
                <div className="h-3 w-32 bg-slate-50 rounded-md" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-slate-50 rounded-xl" />
              <div className="h-10 w-32 bg-indigo-50/50 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ExpandedLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
        <Users className="absolute w-6 h-6 text-teal-600 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Workforce Data</p>
        <div className="flex gap-1 justify-center mt-2">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-teal-50 border-t-teal-600 rounded-full animate-spin"></div>
            <Loader2 className="absolute w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <h3 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Loading Assets</h3>
        </div>
      )}

      <div className={cn("fixed inset-y-0 left-0 z-[100] transition-all duration-300", mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <EmployerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <main className={cn("transition-all duration-300 min-h-screen flex flex-col", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Menu className="w-5 h-5" />
              </button> */}
              <h1 className="text-base lg:text-xl font-black text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-teal-600 hidden xs:block" />
                <span>Workforce Control</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="relative group hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-100/50 rounded-xl text-sm w-32 lg:w-72 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 lg:p-2.5 rounded-xl border border-slate-200 bg-white relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-teal-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-8 flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-8 lg:mb-10">
            <div>
              <h2 className="text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Operational Overview</h2>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Active Sites</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border shadow-sm">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-xs px-2 text-center">{months[currentMonth]} {currentYear}</span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <button onClick={() => setShowCustomJob(true)} className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3.5 rounded-2xl font-bold text-[10px] uppercase hover:bg-teal-600 transition-all shadow-lg">
                <Plus className="w-4 h-4" /> Create Custom Job
              </button>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6 pb-24">
            {isJobsLoading ? (
              <ModernJobLoader />
            ) : (
              jobs.map((job) => (
                <div key={job.jobId} className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-5 lg:p-8 cursor-pointer group" onClick={() => setExpandedJobId(Number(expandedJobId) === Number(job.backendJobId) ? null : Number(job.backendJobId))}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-5">
                        <div className={cn("w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-all", Number(expandedJobId) === Number(job.backendJobId) ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "bg-slate-50 text-slate-400")}>
                          <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-black text-slate-900 truncate">{job.jobTitle}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{job.City} • {job.managerName}</p>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform sm:hidden", Number(expandedJobId) === Number(job.backendJobId) && "rotate-180")} />
                      </div>

                      <div className="flex flex-row items-center gap-2 lg:gap-3 ml-0 sm:ml-auto">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setIsNavigating(true);
                            try {
                              const fullJob = await getJob(job.backendJobId);
                              setSelectedJobForEdit(fullJob);
                              setEditJobOpen(true);
                            } catch (error) { console.error(error); } finally { setTimeout(() => setIsNavigating(false), 500); }
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-wider bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"
                        >
                          <Pencil className="w-3 h-3" /> <span>Edit Job</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsNavigating(true);
                            setSelectedJobId(job.backendJobId);
                            setTimeout(() => { setIsNavigating(false); setManageWorkersOpen(true); }, 600);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-4 py-2.5 rounded-xl transition-all"
                        >
                          <Users className="w-4 h-4" /> <span>Manage Workers</span>
                        </button>
                        <ChevronDown className={cn("hidden sm:block w-6 h-6 text-slate-300 transition-transform", Number(expandedJobId) === Number(job.backendJobId) && "rotate-180 text-teal-600")} />
                      </div>
                    </div>
                  </div>

                  {Number(expandedJobId) === Number(job.backendJobId) && (
                    <div className="px-3 lg:px-8 pb-5 lg:pb-8 pt-2 bg-slate-50/30 border-t border-slate-100">
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-2 lg:p-4 shadow-inner min-h-[150px]">
          {showExpandedLoader ? (
  <ExpandedLoadingState />
) : job.workers.length === 0 ? (

                          <div className="py-10 text-center animate-in fade-in duration-500">
                            <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Workers Assigned</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 lg:gap-4 animate-in slide-in-from-top-4 duration-500">
                        {job.workers
  .filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map((worker) => (
    <WorkerRow
      key={worker.workerId}
      worker={worker}
      viewMonth={currentMonth}
      viewYear={currentYear}
      isLoading={showExpandedLoader}   // ✅ IMPORTANT
      onEditAssignment={(assignment) => {
        setSelectedAssignment(assignment);
        setEditOpen(true);
      }}
      onAttendanceUpdated={() =>
        setFrontendUpdateFlag((prev) => prev + 1)
      }
    />
))}

                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <EditAssignmentDrawer open={editOpen} assignment={selectedAssignment} onClose={() => setEditOpen(false)} onSaved={() => { queryClient.invalidateQueries(["assignments", expandedJobId]); queryClient.invalidateQueries(["attendance", expandedJobId]); setEditOpen(false); }} />
        <ManageWorkersDrawer open={manageWorkersOpen} jobId={selectedJobId} employerId={employerId} onClose={() => setManageWorkersOpen(false)} />

        {showCustomJob && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCustomJob(false)} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <CustomJobManager mode="CREATE" onClose={() => setShowCustomJob(false)} onSuccess={() => { setShowCustomJob(false); queryClient.invalidateQueries(["employerJobs"]); }} />
            </div>
          </div>
        )}

        {editJobOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditJobOpen(false)} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <CustomJobManager mode="EDIT" jobId={selectedJobForEdit?.id} initialData={selectedJobForEdit} onClose={() => setEditJobOpen(false)} onSuccess={() => { setEditJobOpen(false); queryClient.invalidateQueries(["employerJobs"]); setFrontendUpdateFlag((v) => v + 1); }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerAttendanceHR;