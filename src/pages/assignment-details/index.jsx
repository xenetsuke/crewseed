import React, { useEffect, useState } from "react";
import WorkerSidebar from "components/navigation/WorkerSidebar";
import { MapPin, ChevronDown, Briefcase, Wallet, Clock, TrendingUp } from "lucide-react";
import { cn } from "utils/cn";
import { getMyAssignments } from "../../Services/AssignmentService";

import AssignmentHeader from "./components/AssignmentHeader";
import TodayAttendanceCard from "./components/TodayAttendanceCard";
import AttendanceCalendar from "./components/AttendanceCalendar";
import AttendanceHistory from "./components/AttendanceHistory";

import { getMyAttendanceHistory } from "../../Services/AttendanceService";
import { getAssignmentByIdAndJob } from "../../Services/AssignmentService";

/* ===============================
    TIME FORMATTER (SAFE)
================================ */
export const formatTimeIST = (value) => {
  if (!value) return "--:--";
  if (typeof value === "string" && value.length === 8 && value.includes(":")) {
    const [h, m] = value.split(":");
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
};

const EMPTY_STATE = [];

const AssignmentDetails = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [calendarMonth, setCalendarMonth] = useState(
  new Date().getMonth()
);
const [calendarYear, setCalendarYear] = useState(
  new Date().getFullYear()
);

const changeCalendarMonth = (offset) => {
  const d = new Date(calendarYear, calendarMonth + offset);
  setCalendarMonth(d.getMonth());
  setCalendarYear(d.getFullYear());
};

  // useEffect(() => {
  //   setLoading(true);
  //   getMyAttendanceHistory()
  //   .then(async (res) => {
  //     const data = res.data || [];
  //     if (!data.length) {
  //       setAssignments(EMPTY_STATE);
  //       setLoading(false);
  //       return;
  //     }
      
  //     const map = {};
  //     const assignmentFetches = {};
        
  //     data.forEach((a) => {
  //       const snapshot = a.jobSnapshot || {};
  //       if (!map[a.assignmentId]) {
  //         map[a.assignmentId] = {
  //           assignmentId: a.assignmentId,
  //             jobId: a.jobId,
  //             workerId: a.workerId,
  //              BasePay : Number(a?.payroll?.basePay || 0),
  //             jobTitle: snapshot.jobTitle || "Archived Job",
  //             companyName: snapshot.companyName || "Company",
  //             managerName: snapshot.managerName || "Manager",
  //             location: snapshot.location || "Location Unavailable",
  //             shift: "--:--",
  //             role: a.hrSnapshot?.workerRole || "Worker",
  //             dailyWage: a.hrSnapshot?.payroll?.dailyPay || 0,
  //                           basePay: 0,

  //                           attendance: [],
  //           };
  //           assignmentFetches[a.assignmentId] = getAssignmentByIdAndJob(a.assignmentId, a.jobId, a.workerId);
  //         }

  //         map[a.assignmentId].attendance.push({
  //           attendanceId: a.id,
  //           date: a.attendanceDate,
  //           status: a.status,
  //           checkIn: a.checkInTime ? formatTimeIST(a.checkInTime) : "--:--",
  //           checkOut: a.checkOutTime ? formatTimeIST(a.checkOutTime) : "--:--",
  //           siteVerified: a.sitePhotoUploaded,
  //           payroll: {
  //             basePay: a.hrSnapshot?.payroll?.basePay || 0,
  //             dailyPay: a.hrSnapshot?.payroll?.dailyPay || 0,
  //             overtimePay: a.hrSnapshot?.payroll?.overtimePay || 0,
  //             bata: a.hrSnapshot?.payroll?.bata || 0,
  //             pfDeduction: a.hrSnapshot?.payroll?.pfDeduction || 0,
  //             esiDeduction: a.hrSnapshot?.payroll?.esiDeduction || 0,
  //             advanceDeduction: a.hrSnapshot?.payroll?.advanceDeduction || 0,
  //             totalDeductions: a.hrSnapshot?.payroll?.totalDeductions || 0,
  //             netPayable: a.hrSnapshot?.payroll?.netPayable || 0,
  //           },
  //         });
  //       });

  //       await Promise.all(
  //         Object.entries(assignmentFetches).map(async ([assignmentId, promise]) => {
  //           try {
  //             const assignment = await promise;
  //             if (assignment?.shiftStartTime && assignment?.shiftEndTime) {
  //               map[assignmentId].shift = `${formatTimeIST(assignment.shiftStartTime)} - ${formatTimeIST(assignment.shiftEndTime)}`;
  //             }
  //                   map[assignmentId].payroll = assignment?.payroll || { basePay: 0 };

  //           } catch (e) {}
  //         })
  //       );
  //       setAssignments(Object.values(map));
  //     })
  //     .catch(() => setAssignments(EMPTY_STATE))
  //     .finally(() => setLoading(false));
  // }, []);
// useEffect(() => {
//   let isMounted = true;
//   setLoading(true);

//   (async () => {
//     try {
//       /* ===============================
//          1️⃣ FETCH ATTENDANCE HISTORY
//       ================================ */
//       const res = await getMyAttendanceHistory();
//       const data = res?.data || [];

//       const map = {};
//       const assignmentFetches = {};

//       /* ===============================
//          2️⃣ BUILD FROM ATTENDANCE
//       ================================ */
//       data.forEach((a) => {
//         const snapshot = a.jobSnapshot || {};

//         if (!map[a.assignmentId]) {
//           map[a.assignmentId] = {
//             assignmentId: a.assignmentId,
//             jobId: a.jobId,
//             workerId: a.workerId,

//             jobTitle: snapshot.jobTitle || "Archived Job",
//             companyName: snapshot.companyName || "Company",
//             managerName: snapshot.managerName || "Manager",
//             location: snapshot.location || "Location Unavailable",

//             role: a.hrSnapshot?.workerRole || "Worker",
//             shift: "--:--",

//             payroll: { basePay: 0 },
//             attendance: [],
//           };

//           // fetch assignment even if attendance exists
//           assignmentFetches[a.assignmentId] = getAssignmentByIdAndJob(
//             a.assignmentId,
//             a.jobId,
//             a.workerId
//           );
//         }

//         map[a.assignmentId].attendance.push({
//           attendanceId: a.id,
//           date: a.attendanceDate,
//           status: a.status,
//           checkIn: a.checkInTime ? formatTimeIST(a.checkInTime) : "--:--",
//           checkOut: a.checkOutTime ? formatTimeIST(a.checkOutTime) : "--:--",
//           siteVerified: a.sitePhotoUploaded,
//           payroll: {
//             basePay: a.hrSnapshot?.payroll?.basePay || 0,
//             dailyPay: a.hrSnapshot?.payroll?.dailyPay || 0,
//             overtimePay: a.hrSnapshot?.payroll?.overtimePay || 0,
//             bata: a.hrSnapshot?.payroll?.bata || 0,
//             pfDeduction: a.hrSnapshot?.payroll?.pfDeduction || 0,
//             esiDeduction: a.hrSnapshot?.payroll?.esiDeduction || 0,
//             advanceDeduction: a.hrSnapshot?.payroll?.advanceDeduction || 0,
//             totalDeductions: a.hrSnapshot?.payroll?.totalDeductions || 0,
//             netPayable: a.hrSnapshot?.payroll?.netPayable || 0,
//           },
//         });
//       });

//       /* ===============================
//          3️⃣ FETCH & MERGE ASSIGNMENTS
//       ================================ */
//       const results = await Promise.allSettled(
//         Object.values(assignmentFetches)
//       );

//       results.forEach((res) => {
//         if (res.status !== "fulfilled") return;

//         const assignment = res.value;
//         const id = assignment?.id || assignment?.assignmentId;

//         if (!map[id]) {
//           // 👇 assignment WITHOUT attendance
//           map[id] = {
//             assignmentId: id,
//             jobId: assignment.jobId,
//             workerId: assignment.workerId,

//             jobTitle: assignment.jobTitle,
//             companyName: assignment.companyName,
//             managerName: assignment.managerName,
//             location: assignment.location || "Location Unavailable",

//             role: assignment.workerRole || "Worker",
//             shift:
//               assignment.shiftStartTime && assignment.shiftEndTime
//                 ? `${formatTimeIST(
//                     assignment.shiftStartTime
//                   )} - ${formatTimeIST(assignment.shiftEndTime)}`
//                 : "--:--",

//             payroll: assignment.payroll || { basePay: 0 },
//             attendance: [], // 👈 NO attendance yet
//           };
//         } else {
//           // 👇 enrich existing assignment
//           if (assignment.shiftStartTime && assignment.shiftEndTime) {
//             map[id].shift = `${formatTimeIST(
//               assignment.shiftStartTime
//             )} - ${formatTimeIST(assignment.shiftEndTime)}`;
//           }
//           map[id].payroll = assignment.payroll || { basePay: 0 };
//         }
//       });

//       if (isMounted) {
//         setAssignments(Object.values(map));
//       }
//     } catch (e) {
//       if (isMounted) setAssignments(EMPTY_STATE);
//     } finally {
//       if (isMounted) setLoading(false);
//     }
//   })();

//   return () => {
//     isMounted = false;
//   };
// }, []);

useEffect(() => {
  let isMounted = true;
  setLoading(true);

  (async () => {
    try {
      /* ===============================
         1️⃣ FETCH ALL ASSIGNMENTS (SOURCE OF TRUTH)
      ================================ */
      const assignmentsRes = await getMyAssignments();
      const assignmentsList = assignmentsRes || [];

      /* ===============================
         2️⃣ INIT MAP FROM ASSIGNMENTS
      ================================ */
      const map = {};

      assignmentsList.forEach((a) => {
        map[a.id] = {
          assignmentId: a.id,
          jobId: a.jobId,
          workerId: a.workerId,

          jobTitle: a.jobTitle || "Job",
          companyName: a.companyName || "Company",
          managerName: a.managerName || "Manager",
          location: a.location || "Location Unavailable",

          role: a.workerRole || "Worker",
          shift:
            a.shiftStartTime && a.shiftEndTime
              ? `${formatTimeIST(a.shiftStartTime)} - ${formatTimeIST(
                  a.shiftEndTime
                )}`
              : "--:--",

          payroll: a.payroll || { basePay: 0 },
          attendance: [], // 👈 empty initially
        };
      });

      /* ===============================
         3️⃣ FETCH ATTENDANCE HISTORY
      ================================ */
      const attendanceRes = await getMyAttendanceHistory();
      const attendanceList = attendanceRes?.data || [];

      /* ===============================
         4️⃣ MERGE ATTENDANCE INTO ASSIGNMENTS
      ================================ */
      attendanceList.forEach((a) => {
        if (!map[a.assignmentId]) return;

        map[a.assignmentId].attendance.push({
          attendanceId: a.id,
          date: a.attendanceDate,
          status: a.status,
          checkIn: a.checkInTime
            ? formatTimeIST(a.checkInTime)
            : "--:--",
          checkOut: a.checkOutTime
            ? formatTimeIST(a.checkOutTime)
            : "--:--",
          siteVerified: a.sitePhotoUploaded,
          payroll: {
            basePay: a.hrSnapshot?.payroll?.basePay || 0,
            dailyPay: a.hrSnapshot?.payroll?.dailyPay || 0,
            overtimePay: a.hrSnapshot?.payroll?.overtimePay || 0,
            bata: a.hrSnapshot?.payroll?.bata || 0,
            pfDeduction: a.hrSnapshot?.payroll?.pfDeduction || 0,
            esiDeduction: a.hrSnapshot?.payroll?.esiDeduction || 0,
            advanceDeduction:
              a.hrSnapshot?.payroll?.advanceDeduction || 0,
            totalDeductions:
              a.hrSnapshot?.payroll?.totalDeductions || 0,
            netPayable: a.hrSnapshot?.payroll?.netPayable || 0,
          },
        });
      });

      if (isMounted) {
        setAssignments(Object.values(map));
      }
    } catch (err) {
      console.error("Failed to load assignments", err);
      if (isMounted) setAssignments([]);
    } finally {
      if (isMounted) setLoading(false);
    }
  })();

  return () => {
    isMounted = false;
  };
}, []);
  const getPayroll = (assignment) => {
    const netTotal = assignment.attendance.reduce((sum, a) => sum + Number(a.payroll?.netPayable || 0), 0);
    return { netTotal };
  };

  // Musical Loader Component
  const MusicalLoader = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
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
        `}
      </style>
      <div className="flex items-center justify-center gap-1.5 h-12">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className="w-2 bg-[#23acf6] rounded-full animate-musical-bar"
            style={{ animationDelay: `${bar * 0.1}s`, height: '100%' }}
          />
        ))}
      </div>
      <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#23acf6] animate-pulse">
        Loading Assignments
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className="fixed inset-y-0 left-0 z-50 shadow-2xl">
        <WorkerSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      <main className={cn("transition-all duration-500 ease-in-out min-h-screen", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
          {/* HEADER SECTION */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                My <span className="text-[#23acf6]">Assignments</span>
              </h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg font-medium">
                Real-time tracking of your work contracts and earnings.
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm hidden md:flex items-center gap-3">
              <TrendingUp className="text-emerald-500 w-5 h-5" />
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Active Status</span>
            </div>
          </header>

          {/* PART-WISE LOADING LOGIC */}
          {loading ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <MusicalLoader />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="font-black text-2xl text-slate-800">No active assignments</h3>
              <p className="text-slate-500 mt-2">When you are assigned a job, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignments.map((assignment) => {
                const isOpen = expandedAssignment === assignment.assignmentId;
                const payroll = getPayroll(assignment);

                return (
                  <div
                    key={assignment.assignmentId}
                    className={cn(
                      "bg-white rounded-[2rem] transition-all duration-300 overflow-hidden border",
                      isOpen ? "border-[#23acf6] ring-4 ring-blue-50 shadow-2xl" : "border-white shadow-md hover:shadow-xl hover:translate-y-[-2px]"
                    )}
                  >
                    {/* CARD HEADER / TOGGLE */}
                    <div
                      className="p-5 md:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                      onClick={() => setExpandedAssignment(isOpen ? null : assignment.assignmentId)}
                    >
                      <div className="flex items-start md:items-center gap-4 md:gap-6">
                        <div className={cn(
                          "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                          isOpen ? "bg-[#23acf6] text-white" : "bg-blue-50 text-[#23acf6]"
                        )}>
                          <MapPin className="w-7 h-7" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 truncate">
                            {assignment.jobTitle}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="text-xs md:text-sm font-bold text-slate-400 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              {assignment.companyName}
                            </span>
                            <span className="text-xs md:text-sm font-bold text-[#23acf6] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {assignment.shift}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right">
                           <div className="flex items-center gap-1 justify-end text-slate-400 mb-1">
                          <Wallet className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Base Pay
                          </span>
                        </div>
                      <p className="text-3xl font-black text-emerald-600 tabular-nums">
    ₹{Number(assignment?.payroll?.basePay || 0).toLocaleString("en-IN")}
  </p>
                      {/* </div> */}
                        </div>
                        
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
                          isOpen ? "bg-slate-100 rotate-180 border-slate-200" : "bg-white border-slate-100"
                        )}>
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED CONTENT */}
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-5 md:p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                          <div className="lg:col-span-5 order-2 lg:order-1">
                            <TodayAttendanceCard assignment={assignment} />
                          </div>
                          <div className="lg:col-span-7 order-1 lg:order-2">
                         <AttendanceCalendar
  attendance={assignment.attendance}
  viewMonth={calendarMonth}
  viewYear={calendarYear}
  onMonthChange={changeCalendarMonth}
/>

                          </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                          <AttendanceHistory attendance={assignment.attendance} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignmentDetails;