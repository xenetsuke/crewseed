import React, { useState, useMemo, useRef } from "react";
import { Info } from "lucide-react";
import AttendanceLog from "./AttendanceLog";
import { cn } from "utils/cn";

const WorkerRow = ({ worker, viewMonth, viewYear, viewDay }) => {
  if (!worker || !Array.isArray(worker.attendance)) return null;

  // Lift attendance state to parent so heatmap updates instantly
  const [attendanceRecords, setAttendanceRecords] = useState(worker.attendance);

  const safeWorker = {
    workerId: worker.workerId,
    name: worker.name,
    role: worker.role,
    // avatar: worker.picture || "Avatar.png",
    dailyWage: worker.dailyWage || 0,
    attendance: attendanceRecords,
    pfApplicable: worker.pfApplicable,
    esiApplicable: worker.esiApplicable,
    advanceAmount: worker.advanceAmount || 0,
  };

  const [showLogs, setShowLogs] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const currentMonth = viewMonth;
  const currentYear = viewYear;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getDayInfo = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(currentYear, currentMonth, day);
    if (targetDate > today) {
      return { status: "FUTURE", label: "Upcoming (Shift not started)" };
    }

    const record = safeWorker.attendance.find((a) => {
      const d = new Date(a.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    if (!record) return { status: "EMPTY", label: "No Record" };

    switch (record.status) {
      case "APPROVED":
      case "VERIFIED":
        return { status: "APPROVED", label: "Approved / Present" };
      case "REJECTED":
      case "ABSENT":
        return { status: "REJECTED", label: "Rejected / Absent" };
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
      const existingRecord = safeWorker.attendance.find((a) => {
        const d = new Date(a.date);
        return d.getDate() === dayNum && d.getMonth() === currentMonth;
      });

      return existingRecord || {
        attendanceId: `temp-${dayNum}`,
        date: new Date(currentYear, currentMonth, dayNum).toISOString(),
        status: "EMPTY",
        isEmpty: true
      };
    });
  }, [safeWorker.attendance, currentMonth, currentYear, daysInMonth]);

  // Handler to update the lifted state
  const handleStatusChange = (attendanceId, newStatus) => {
    setAttendanceRecords(prev => 
      prev.map(rec => rec.attendanceId === attendanceId ? { ...rec, status: newStatus } : rec)
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4 overflow-hidden">
      <div className="p-4">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          {/* <img src={safeWorker.avatar} className="w-10 h-10 rounded-full border" alt="avatar" /> */}
          <div>
            <h3 className="font-bold text-sm">{safeWorker.name}</h3>
            {/* <p className="text-[10px] text-slate-500 font-bold uppercase">
              {safeWorker.role} • {safeWorker.workerId}
            </p> */}
          </div>
        </div>

        {/* HEATMAP */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const { status, label } = getDayInfo(day);
            const isSelected = selectedDay === day;
            const showTooltip = hoveredDay === day || isSelected;

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
                    "w-9 h-10 rounded-lg border text-[11px] font-bold transition-all",
                    status === "APPROVED" && "bg-emerald-500 text-white border-emerald-600",
                    status === "REJECTED" && "bg-rose-500 text-white border-rose-600",
                    status === "PENDING" && "bg-amber-400 text-white border-amber-500",
                    status === "NOT_STARTED" && "bg-blue-500 text-white border-blue-600",
                    status === "FUTURE" && "bg-white text-slate-300 border-slate-200",
                    status === "EMPTY" && "bg-white text-slate-400 border-slate-200",
                    isSelected && "ring-2 ring-slate-900 ring-offset-1"
                  )}
                >
                  {day}
                </button>

                {showTooltip && (
                  <div className="absolute -top-8 z-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
                    <Info className="w-3 h-3" />
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="mt-3 px-3 py-1.5 border rounded-lg text-[11px] font-bold hover:bg-slate-50"
        >
          {showLogs ? "Hide Detailed Logs" : "View Detailed Logs"}
        </button>
      </div>

      {showLogs && (
        <div className="border-t border-slate-100">
          <AttendanceLog 
            logs={fullMonthLogs} 
            highlightedDay={selectedDay} 
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default WorkerRow;