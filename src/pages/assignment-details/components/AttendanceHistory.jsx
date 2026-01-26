import React, { useState, useMemo } from "react";
import { cn } from "utils/cn";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CircleDollarSign,
  Clock3
} from "lucide-react";

const AttendanceHistory = ({ attendance = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState(null);
  const [isMainExpanded, setIsMainExpanded] = useState(true); // New state for main collapse

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Logic to handle Month/Year change
  const handlePrevMonth = (e) => {
    e.stopPropagation(); // Prevent toggling the collapse when clicking nav
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation(); // Prevent toggling the collapse when clicking nav
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
  };

  // Filter attendance for the selected Month and Year
  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const d = new Date(a.date);
      return (
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
  }, [attendance, selectedDate]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all">
      {/* 📅 MODERN DATE PICKER HEADER */}
      <div 
        onClick={() => setIsMainExpanded(!isMainExpanded)}
        className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between cursor-pointer group/main"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover/main:scale-110 transition-transform">
            <CalendarIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <ChevronDown 
                    size={16} 
                    className={cn(
                        "text-slate-400 transition-transform duration-300",
                        isMainExpanded && "rotate-180"
                    )} 
                />
            </div>
            <p className="text-[10px] text-slate-400 font-bold">
              {filteredAttendance.length} RECORDS FOUND
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 📜 SLIDABLE / COLLAPSIBLE LIST BODY */}
      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden",
        isMainExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
            {filteredAttendance.length === 0 ? (
            <div className="py-10 text-center">
                <p className="text-slate-400 text-sm font-medium">No records for this month</p>
            </div>
            ) : (
            filteredAttendance.map((a, i) => {
                const isExpanded = expandedDate === i;
                const payroll = a.payroll || {};

                return (
                <div
                    key={i}
                    className={cn(
                    "group border transition-all duration-300 rounded-2xl overflow-hidden",
                    isExpanded 
                        ? "border-blue-200 bg-blue-50/30 shadow-md" 
                        : "border-slate-100 bg-white hover:border-slate-300"
                    )}
                >
                    {/* INDIVIDUAL DAY HEADER */}
                    <div 
                    onClick={() => setExpandedDate(isExpanded ? null : i)}
                    className="p-4 cursor-pointer flex items-center justify-between"
                    >
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl px-3 py-1.5 min-w-[55px] group-hover:bg-blue-100 transition-colors">
                        <span className="text-[10px] font-black text-slate-400">
                            {new Date(a.date).toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}
                        </span>
                        <span className="text-lg font-black text-slate-700 leading-none">
                            {new Date(a.date).getDate()}
                        </span>
                        </div>

                        <div>
                        <div className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-md inline-block mb-1",
                            a.status === "APPROVED" && "bg-emerald-100 text-emerald-700",
                            a.status === "HALF_DAY" && "bg-indigo-100 text-indigo-700",
                            a.status === "REJECTED" && "bg-rose-100 text-rose-700",
                            a.status === "PENDING" && "bg-amber-100 text-amber-700",
                            a.status === "NOT_STARTED" && "bg-slate-100 text-slate-500"
                        )}>
                            {a.status}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock3 size={12} />
                            <span className="text-[11px] font-bold tracking-tight">
                                {a.checkIn || '--:--'} - {a.checkOut || '--:--'}
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Net Pay</span>
                        <span className="text-sm font-black text-slate-700">₹{payroll.netPayable?.toLocaleString("en-IN")}</span>
                        </div>
                        <ChevronDown size={18} className={cn("text-slate-400 transition-transform duration-300", isExpanded && "rotate-180 text-blue-600")} />
                    </div>
                    </div>

                    {/* COLLAPSIBLE PAYROLL DETAILS */}
                    <div className={cn(
                    "grid transition-all duration-300 ease-in-out overflow-hidden",
                    isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                    )}>
                    <div className="px-4 pb-4">
                        <div className="pt-3 border-t border-slate-200/60 grid grid-cols-3 sm:grid-cols-3 gap-2">
                        <Tile label="Base Pay" value={payroll.basePay} />
                        {/* <Tile label="Daily Pay" value={payroll.dailyPay} /> */}
                        <Tile label="OT Pay" value={payroll.overtimePay} />
                        <Tile label="Advance" value={payroll.advanceDeduction} danger />
                        {/* <Tile label="Deductions" value={payroll.totalDeductions} danger /> */}
                        {/* <Tile label="Total Net" value={payroll.netPayable} highlight /> */}
                        </div>
                    </div>
                    </div>
                </div>
                );
            })
            )}
        </div>
      </div>
    </div>
  );
};

/* ===============================
    SMALL REUSABLE TILE
================================ */
const Tile = ({ label, value = 0, danger, highlight }) => (
  <div
    className={cn(
      "flex flex-col rounded-xl p-2.5 border transition-all",
      highlight
        ? "bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-100"
        : danger
        ? "bg-rose-50 text-rose-600 border-rose-100"
        : "bg-white text-slate-700 border-slate-100 hover:border-slate-300 shadow-sm"
    )}
  >
    <span className={cn(
      "text-[8px] uppercase font-black tracking-widest mb-0.5",
      highlight ? "text-blue-100" : "text-slate-400"
    )}>
      {label}
    </span>
    <span className="text-xs font-black flex items-center gap-1">
      ₹{Number(value || 0).toLocaleString("en-IN")}
    </span>
  </div>
);

export default AttendanceHistory;