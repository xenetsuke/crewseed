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
  Loader2,
} from "lucide-react";
import CustomJobManager from "./CustomJobManager";
import WorkerRow from "./components/WorkerRow";
import EditAssignmentDrawer from "./components/EditAssignmentDrawer";
import ManageWorkersDrawer from "./components/ManageWorkersDrawer";
import { cn } from "utils/cn";
import EmployerSidebar from "components/navigation/EmployerSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobsPostedBy,getJob } from "../../Services/JobService"; // Ensure getJobById is imported
import { getAttendanceByJob } from "../../Services/AttendanceService";
import { getAssignmentsByJob } from "../../Services/AssignmentService";
import { getProfile } from "../../Services/ProfileService";
import { useSelector } from "react-redux";
// import { updateHrPayroll } from "../../Services/AttendanceService";


const WorkerAttendanceHR = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCustomJob, setShowCustomJob] = useState(false);
  const [frontendUpdateFlag, setFrontendUpdateFlag] = useState(0);

  const queryClient = useQueryClient();
useEffect(() => {
  if (expandedJobId) {
    queryClient.invalidateQueries(["attendance", expandedJobId]);
    queryClient.invalidateQueries(["assignments", expandedJobId]);
  }
}, [frontendUpdateFlag, expandedJobId]);

  // EDIT JOB STATES
  const [editJobOpen, setEditJobOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);

  // DRAWER STATES
  const [manageWorkersOpen, setManageWorkersOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const employerId = useSelector((state) => state.user?.id);

  const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const { data: jobsFromApi = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ["employerJobs"],
    queryFn: getJobsPostedBy,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (offset) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1));
  };

  const { data: attendanceResponse } = useQuery({
    queryKey: ["attendance", expandedJobId],
    queryFn: () => getAttendanceByJob(expandedJobId),
    enabled: !!expandedJobId,
  });

  useEffect(() => {
    console.log("🟡 expandedJobId:", expandedJobId);
    console.log("🟢 RAW attendanceResponse:", attendanceResponse);
  }, [attendanceResponse, expandedJobId]);

  const attendanceByJob = useMemo(() => {
    if (!attendanceResponse) return [];
    if (Array.isArray(attendanceResponse)) return attendanceResponse;
    if (Array.isArray(attendanceResponse.data)) return attendanceResponse.data;
    if (Array.isArray(attendanceResponse.attendances)) return attendanceResponse.attendances;
    return [];
  }, [attendanceResponse]);

  const { data: assignmentsByJob = [] } = useQuery({
    queryKey: ["assignments", expandedJobId],
    queryFn: () => getAssignmentsByJob(expandedJobId),
    enabled: !!expandedJobId,
  });

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

  const buildWorkers = (assignments = [], attendanceList = []) => {
    const attendanceMap = {};
    if (!Array.isArray(attendanceList)) return [];

    attendanceList.forEach((a) => {
      const hr = a.hrSnapshot;
      if (!hr) return;
      const workerId = Number(hr.workerId);
      if (!attendanceMap[workerId]) {
        attendanceMap[workerId] = [];
      }
      attendanceMap[workerId].push({
        attendanceId: hr.attendanceId || a._id,
        date: a.attendanceDate,
        status: hr.status,
        checkIn: a.checkInTime || null,
        checkOut: a.checkOutTime || null,
        payroll: {
          basePay: hr.payroll?.basePay || 0,
          dailyPay: hr.payroll?.dailyPay || 0,
          overtimePay: hr.payroll?.overtimePay || 0,
          bata: hr.payroll?.bata || 0,
          pfDeduction: hr.payroll?.pfDeduction || 0,
          esiDeduction: hr.payroll?.esiDeduction || 0,
          advanceDeduction: hr.payroll?.advanceDeduction || 0,
          totalDeductions: hr.payroll?.totalDeductions || 0,
          grossPay: hr.payroll?.grossPay || 0,
          netPayable: hr.payroll?.netPayable || 0,
        },
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

  const jobs = useMemo(() => {
    return jobsFromApi.map((job) => ({
      jobId: `JOB${job.id}`,
      backendJobId: job.id,
      jobTitle: job.jobTitle,
      fullWorkAddress: job.fullWorkAddress || "",
      managerName: job.managerName,
      City:job.city || "Site",
      workers:
        Number(expandedJobId) === Number(job.id)
          ? buildWorkers(assignmentsByJob, attendanceByJob)
          : [],
    }));
  }, [jobsFromApi, assignmentsByJob, attendanceByJob, expandedJobId, profilesMap]);

  if (isJobsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className={cn("fixed inset-y-0 left-0 z-[100] transition-all duration-300", mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <EmployerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className={cn("transition-all duration-300 min-h-screen flex flex-col", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-teal-600" />
                <span className="hidden sm:inline">Workforce Control</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workers..."
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm w-48 lg:w-72 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2.5 rounded-xl border bg-white relative">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-teal-600 text-xs font-black uppercase tracking-widest">Operational Overview</h2>
              <h3 className="text-3xl font-black text-slate-900">Active Sites</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border">
                <button onClick={() => changeMonth(-1)} className="p-2"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-xs px-2">{months[currentMonth]} {currentYear}</span>
                <button onClick={() => changeMonth(1)} className="p-2"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <button
                onClick={() => setShowCustomJob(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase hover:bg-teal-600 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Custom Job
              </button>
            </div>
          </div>

          <div className="space-y-6 pb-24">
            {jobs.map((job) => (
              <div key={job.jobId} className="bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                  onClick={() => setExpandedJobId(Number(expandedJobId) === Number(job.backendJobId) ? null : Number(job.backendJobId))}
                >
                  <div className="flex items-center gap-5">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", Number(expandedJobId) === Number(job.backendJobId) ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-400")}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{job.jobTitle}</h3>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
  {job.fullWorkAddress || job.City || "Site"} • {job.managerName}
</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const fullJob = await getJob(job.backendJobId);
                          setSelectedJobForEdit(fullJob);
                          setEditJobOpen(true);
                        } catch (error) {
                          console.error("Failed to fetch job details", error);
                        }
                      }}
                      className="text-xs font-black text-slate-600 hover:text-teal-600 uppercase tracking-wider bg-slate-100 px-4 py-2 rounded-xl transition-colors"
                    >
                      ✏️ Edit Job
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJobId(job.backendJobId);
                        setManageWorkersOpen(true);
                      }}
                      className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Users className="w-4 h-4" /> Manage Workers
                    </button>
                    <ChevronDown className={cn("w-6 h-6 text-slate-400 transition-transform duration-300", Number(expandedJobId) === Number(job.backendJobId) && "rotate-180 text-teal-600")} />
                  </div>
                </div>

                {Number(expandedJobId) === Number(job.backendJobId) && (
                  <div className="px-6 lg:px-8 pb-8 pt-2 bg-slate-50/50">
                    <div className="bg-white rounded-3xl border p-4">
                      {job.workers.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase">No Workers Assigned</div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {job.workers.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase())).map((worker) => (
<WorkerRow
  key={worker.workerId}
  worker={worker}
  viewMonth={currentMonth}
  viewYear={currentYear}
  onEditAssignment={(assignment) => {
    setSelectedAssignment(assignment);
    setEditOpen(true);
  }}
  onAttendanceUpdated={() => {
    setFrontendUpdateFlag((prev) => prev + 1);
  }}
/>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <EditAssignmentDrawer open={editOpen} assignment={selectedAssignment} onClose={() => setEditOpen(false)} onSaved={() => { queryClient.invalidateQueries(["assignments", expandedJobId]); queryClient.invalidateQueries(["attendance", expandedJobId]); setEditOpen(false); }} />
        
        <ManageWorkersDrawer open={manageWorkersOpen} jobId={selectedJobId} employerId={employerId} onClose={() => setManageWorkersOpen(false)} />

        {/* CREATE DRAWER */}
        {showCustomJob && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCustomJob(false)} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl p-8 overflow-y-auto">
              <CustomJobManager mode="CREATE" onSuccess={() => { setShowCustomJob(false); queryClient.invalidateQueries(["employerJobs"]); }} />
            </div>
          </div>
        )}

        {/* ✅ STEP 5: EDIT DRAWER */}
        {editJobOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditJobOpen(false)} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl p-8 overflow-y-auto">
              <CustomJobManager
                mode="EDIT"
                jobId={selectedJobForEdit?.id}
                initialData={selectedJobForEdit}
                onSuccess={() => {
                  setEditJobOpen(false);
                  queryClient.invalidateQueries(["employerJobs"]);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerAttendanceHR;