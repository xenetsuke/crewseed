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

    case "HALF_DAY":
      return "bg-amber-500 text-white border-amber-600";

    case "REJECTED":
    case "ABSENT":
      return "bg-rose-500 text-white border-rose-600";

    case "PENDING":
    case "PENDING_VERIFICATION":
    case "PRESENT":
      return "bg-blue-400 text-white border-blue-500";

    case "NOT_STARTED":
      return "bg-blue-600 text-white border-blue-700";

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

  const getRecordForDay = (day) => {
    return attendance.find((a) => {
      const d = new Date(a.date);
      return d.getDate() === day;
    });
  };

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-bold uppercase text-slate-400">
          Monthly Attendance
        </p>
        {/* ✅ Updated Header Label */}
        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Showing Net Pay
        </span>
      </div>

      {/* 🔥 SLIDABLE CONTAINER */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const record = getRecordForDay(day);
          const status = record?.status || (day > today.getDate() ? "UPCOMING" : "NOT_STARTED");

          // ✅ NEW: Extract Net Pay from HR Payroll Object
          const netPay = Number(record?.payroll?.netPayable || 0);

          return (
            <div
              key={day}
              className={cn(
                "min-w-[50px] h-14 rounded-xl text-xs font-black flex flex-col items-center justify-center border transition-all",
                getStatusClasses(status),
                status === "UPCOMING" && "bg-white text-slate-300 border-slate-100"
              )}
            >
              <span>{day}</span>
              
              {/* ✅ NEW: Dynamic Badge for Net Pay (Positive/Negative) */}
              {netPay !== 0 && (
                <span
                  className={cn(
                    "text-[9px] mt-0.5 font-bold px-1 rounded",
                    netPay < 0
                      ? "bg-rose-600/20 text-rose-700"
                      : "bg-emerald-600/20 text-emerald-700"
                  )}
                >
                  ₹{netPay}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Full Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Half Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-blue-400"></span> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> Not Uploaded
        </span>
      </div>
    </div>
  );
};

export default AttendanceCalendar;