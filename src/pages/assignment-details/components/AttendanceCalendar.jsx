import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "utils/cn";

/* =========================
   STATUS → COLOR MAP
========================= */
const getStatusClasses = (status) => {
  switch (status) {
    case "APPROVED":
    case "VERIFIED":
      return "bg-emerald-500 text-white border-emerald-600";
    case "HALF_DAY":
      return "bg-amber-500 text-white border-amber-600";
    case "REJECTED":
    case "AUTO_MARKED_ABSENT":
    case "ABSENT":
      return "bg-rose-500 text-white border-rose-600";
    case "PENDING":
    case "PENDING_VERIFICATION":
      return "bg-blue-400 text-white border-blue-500";
    case "NOT_STARTED":
      return "bg-blue-600 text-white border-blue-700";
    default:
      return "bg-white text-slate-400 border-slate-200";
  }
};

const AttendanceCalendar = ({
  attendance = [],
  viewMonth,
  viewYear,
  onMonthChange,
}) => {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  /* ✅ MONTH + YEAR FILTER */
  const monthAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const d = new Date(a.date);
      return (
        d.getMonth() === viewMonth &&
        d.getFullYear() === viewYear
      );
    });
  }, [attendance, viewMonth, viewYear]);

  const getRecordForDay = (day) => {
    return monthAttendance.find((a) => {
      const d = new Date(a.date);
      return d.getDate() === day;
    });
  };

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase text-slate-400">
          Monthly Attendance
        </p>

        <div className="flex items-center gap-2">
          <button onClick={() => onMonthChange(-1)}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-[11px] font-black">
            {new Date(viewYear, viewMonth).toLocaleString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <button onClick={() => onMonthChange(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const record = getRecordForDay(day);
          const status = record?.status || "NOT_STARTED";

          return (
            <div
              key={day}
              className={cn(
                "min-w-[50px] h-14 rounded-xl text-xs font-black flex flex-col items-center justify-center border",
                getStatusClasses(status)
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
