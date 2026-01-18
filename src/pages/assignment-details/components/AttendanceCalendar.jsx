import React from "react";
import { cn } from "utils/cn";

/* =========================
   STATUS → COLOR MAP
========================= */
const getStatusClasses = (status) => {
  switch (status) {
    case "APPROVED":
    case "VERIFIED":
      return "bg-emerald-500 text-white border-emerald-600";

    case "REJECTED":
    case "ABSENT":
      return "bg-rose-500 text-white border-rose-600";

    case "PENDING":
    case "PENDING_VERIFICATION":
      return "bg-amber-400 text-white border-amber-500";

    case "NOT_STARTED":
      return "bg-blue-500 text-white border-blue-600";

    default:
      return "bg-white text-slate-400 border-slate-200";
  }
};

const AttendanceCalendar = ({ attendance = [] }) => {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const getStatusForDay = (day) => {
    const record = attendance.find((a) => {
      const d = new Date(a.date);
      return d.getDate() === day;
    });

    if (record) return record.status;

    // Future days → upcoming
    if (day > today.getDate()) return "UPCOMING";

    return "NOT_STARTED";
  };

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-slate-400 mb-3">
        Monthly Attendance
      </p>

      {/* 🔥 SLIDABLE CONTAINER */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = getStatusForDay(day);

          return (
            <div
              key={day}
              className={cn(
                "min-w-[40px] h-10 rounded-xl text-xs font-black flex items-center justify-center border transition-colors",
                getStatusClasses(status),
                status === "UPCOMING" &&
                  "bg-white text-slate-300 border-slate-100"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-500"></span> Approved
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-400"></span> Pending
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-rose-500"></span> Absent
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500"></span> Not Uploaded
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-slate-200"></span> Upcoming
        </span>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
