import React, { useState, useEffect, useMemo } from "react";
import { Info, User, ExternalLink, Download, ClipboardList,  Loader2 } from "lucide-react";
import AttendanceLog from "./AttendanceLog";
import AssignmentStatsOverview from "./AssignmentStatsOverview";
import { cn } from "utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyPayrollForAssignment } from "Services/monthlyPayroll.service";
import PayrollSlipEditor from "./PayrollSlipEditor";
const WorkerRow = ({
  worker,
  onEditAssignment,
  viewMonth,
  viewYear,
  onAttendanceUpdated,
  isLoading = false, // Added loading prop for modern transition
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
const [isNavigating, setIsNavigating] = useState(false);
  const currentMonth = viewMonth;
  const currentYear = viewYear;
const [showStats, setShowStats] = useState(false); // 🔒 hidden initially
const [isExpanded, setIsExpanded] = useState(false); // 🔒 collapsed by default

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const attendanceRecords = worker?.attendance || [];
const handleEditClick = async () => {
    setIsNavigating(true);
    
    // We give it a small delay so the user sees the professional loader 
    // before the drawer slides in from the parent.
    setTimeout(() => {
      onEditAssignment(worker.assignment);
      setIsNavigating(false);
    }, 600);
  };

const hasData =
  worker &&
  Array.isArray(worker.attendance) &&
  worker.attendance.length > 0;
  // Skeleton Loading State
if (!hasData && isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-20 bg-slate-50 rounded" />
            </div>
          </div>
          <div className="h-8 w-28 bg-slate-50 rounded-lg" />
        </div>
        <div className="h-20 w-full bg-slate-50/50 rounded-xl mb-6" />
        <div className="flex gap-1.5 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-9 h-11 bg-slate-100 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ SINGLE PAYROLL SOURCE (HR SNAPSHOT)
  const effectivePayroll = useMemo(() => {
    let basePay = 0;
    let dailyPay = 0;
    let otPay = 0;
    let bata = 0;
    let pf = 0;
    let esi = 0;
    let advanceDeduction = 0;

attendanceRecords.forEach((a) => {
  if (!a.payroll) return;

  const d = new Date(a.date);

  // ✅ FILTER BY VIEW MONTH & YEAR
  if (
    d.getMonth() !== viewMonth ||
    d.getFullYear() !== viewYear
  ) {
    return;
  }

  if (a.payroll.basePay) {
    basePay = Number(a.payroll.basePay);
  }

  dailyPay += Number(a.payroll.dailyPay || 0);
  otPay += Number(a.payroll.overtimePay || 0);
  bata += Number(a.payroll.bata || 0);
  pf += Number(a.payroll.pfDeduction || 0);
  esi += Number(a.payroll.esiDeduction || 0);
  advanceDeduction += Number(a.payroll.advanceDeduction || 0);
});


    const grossPay = dailyPay + otPay + bata;
    const totalDeductions = pf + esi + advanceDeduction;
    const netPayable = grossPay - totalDeductions;

    return {
      basePay,
      dailyPay,
      overtimePay: otPay,
      bata,
      pfDeduction: pf,
      esiDeduction: esi,
      advanceDeduction,
      grossPay,
      totalDeductions,
      netPayable,
    };
  }, [attendanceRecords, viewMonth, viewYear]);
const ytdPayroll = useMemo(() => {
  let gross = 0;
  let deductions = 0;
  let net = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  attendanceRecords.forEach((a) => {
    if (!a.payroll) return;

    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);

    // 🔒 SAME YEAR ONLY
    if (d.getFullYear() !== viewYear) return;

    // 🔒 NO FUTURE DAYS
    if (d > today) return;

    const p = a.payroll;
    const g =
      Number(p.dailyPay || 0) +
      Number(p.overtimePay || 0) +
      Number(p.bata || 0);

    const ded =
      Number(p.pfDeduction || 0) +
      Number(p.esiDeduction || 0) +
      Number(p.advanceDeduction || 0);

    gross += g;
    deductions += ded;
    net += g - ded;
  });

  return {
    gross,
    deductions,
    net,
  };
}, [attendanceRecords, viewYear]);
const payrollWithYTD = useMemo(() => {
  return {
    ...effectivePayroll,      // month-scoped
    ytdNetPay: ytdPayroll.net // year-to-date
  };
}, [effectivePayroll, ytdPayroll]);

const [showSlipEditor, setShowSlipEditor] = useState(false);

const downloadPayrollChit = () => {
  setShowSlipEditor(true);
};


  const handleAttendanceStatusChange = (attendanceId, newStatus) => {
    // Handled via onRefresh prop to parent
  };

  const getDayInfo = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(currentYear, currentMonth, day);
    if (targetDate > today) return { status: "FUTURE", label: "Upcoming" };

    const record = attendanceRecords.find((a) => {
      const d = new Date(a.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    if (!record) return { status: "EMPTY", label: "No Record" };

    switch (record.status) {
      case "APPROVED":
      case "VERIFIED":
        return { status: "APPROVED", label: "Approved / Present" };
      case "REJECTED":
      case "ABSENT":
        return { status: "REJECTED", label: "Rejected / Absent" };
        case "AUTO_MARKED_ABSENT":
  return { status: "REJECTED", label: "Auto Marked Absent" };
      case "PENDING":
      case "PENDING_VERIFICATION":
        return { status: "PENDING", label: "Pending Verification" };
      case "NOT_STARTED":
        return { status: "NOT_STARTED", label: "Photo Not Uploaded" };
      default:
        return { status: "EMPTY", label: "No Record" };
    }
  };

  const fullMonthLogs = useMemo(() => {
    return Array.from({ length: daysInMonth }).map((_, i) => {
      const dayNum = i + 1;
      const existingRecord = attendanceRecords.find((a) => {
        const d = new Date(a.date);
        return d.getDate() === dayNum && d.getMonth() === currentMonth;
      });
      return (
        existingRecord || {
          attendanceId: `temp-${dayNum}`,
          date: new Date(currentYear, currentMonth, dayNum).toISOString(),
          status: "EMPTY",
          isEmpty: true,
        }
      );
    });
  }, [attendanceRecords, currentMonth, currentYear, daysInMonth]);

  return (
  <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm mb-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300/80">
    {isNavigating && (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-xs font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">
          Fetching Assignment
        </p>
      </div>
    )}

    <div className="p-5 lg:p-7">
      {/* ================= WORKER HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
            <User className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-black text-slate-900 text-base tracking-tight">
              {worker.name}
            </h3>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              {worker.role}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-800 rounded-xl border border-slate-200 uppercase tracking-wider"
          >
            <Info className="w-3.5 h-3.5" />
            {isExpanded ? "Hide Details" : "View Details"}
          </button>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl border border-indigo-100 uppercase tracking-wider"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Edit Assignment
          </button>
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={() => setShowStats(!showStats)}
            className="mb-4 flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-700 bg-white border border-slate-200 rounded-xl uppercase"
          >
            <Info className="w-4 h-4" />
            {showStats ? "Hide Stats" : "View Stats"}
          </button>

          {showStats && (
            <div className="mb-6">
              <AssignmentStatsOverview payroll={payrollWithYTD} />
            </div>
          )}

          <PayrollSlipEditor
            open={showSlipEditor}
            onClose={() => setShowSlipEditor(false)}
            worker={worker}
            payroll={effectivePayroll}
            viewMonth={viewMonth}
            viewYear={viewYear}
          />

          {/* ================= HEATMAP ================= */}
          <div className="group/heatmap">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Monthly Attendance Tracker
            </h4>

            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { status, label } = getDayInfo(day);
                const isSelected = selectedDay === day;

                return (
                  <div
                    key={day}
                    className="relative flex flex-col items-center flex-shrink-0"
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <button
                      onClick={() => {
                        setSelectedDay(isSelected ? null : day);
                        setShowLogs(true);
                      }}
                      className={cn(
                        "w-10 h-12 rounded-xl border-2 text-[11px] font-black transition-all duration-300 flex items-center justify-center",
                        status === "APPROVED" &&
                          "bg-emerald-500 text-white border-emerald-400",
                        status === "REJECTED" &&
                          "bg-rose-500 text-white border-rose-400",
                        status === "PENDING" &&
                          "bg-amber-400 text-white border-amber-300",
                        status === "NOT_STARTED" &&
                          "bg-blue-500 text-white border-blue-400",
                        status === "FUTURE" &&
                          "bg-white text-slate-200 border-slate-50",
                        status === "EMPTY" &&
                          "bg-slate-50 text-slate-300 border-slate-100",
                        isSelected &&
                          "ring-4 ring-slate-900/10 border-slate-900 scale-110 z-10"
                      )}
                    >
                      {day}
                    </button>

                    {(hoveredDay === day || isSelected) && (
                      <div className="absolute -top-10 z-30 bg-slate-900 text-white text-[10px] px-3 py-2 rounded-xl shadow-2xl">
                        {label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end gap-3">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase"
            >
              <ClipboardList className="w-4 h-4" />
              {showLogs ? "Hide Logs" : "View Logs"}
            </button>

            <button
              onClick={downloadPayrollChit}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase"
            >
              <Download className="w-4 h-4" />
              Download Slip
            </button>
          </div>
        </div>
      )}
    </div>

    {showLogs && (
      <div className="border-t border-slate-100 bg-slate-50/40">
        <AttendanceLog
          logs={fullMonthLogs}
          highlightedDay={selectedDay}
          onStatusUpdate={handleAttendanceStatusChange}
          onRefresh={onAttendanceUpdated}
        />
      </div>
    )}
  </div>
);

  
};

export default WorkerRow;