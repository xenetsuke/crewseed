import React, { useEffect, useRef } from "react";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Zap,
  RotateCcw,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { approveAttendance, resetAttendance } from "Services/AttendanceService";
import { formatTimeIST } from "utils/time";
import { cn } from "utils/cn";

const STATUS_UI = {
  PENDING: { stripe: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label: "Pending Verification" },
  APPROVED: { stripe: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", label: "Approved" },
  REJECTED: { stripe: "bg-rose-500", badge: "bg-rose-100 text-rose-700", label: "Rejected" },
  REUPLOAD_SENT: { stripe: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700", label: "Reupload Sent" },
  EMPTY: { stripe: "bg-slate-200", badge: "bg-slate-100 text-slate-400", label: "No Record" }
};

const AttendanceLog = ({ logs = [], highlightedDay, onStatusChange }) => {
  const logRefs = useRef({});

  useEffect(() => {
    if (highlightedDay && logRefs.current[highlightedDay]) {
      logRefs.current[highlightedDay].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [highlightedDay]);

  const handleVerify = async (log) => {
    try {
      await approveAttendance(log.attendanceId, true, "");
      onStatusChange(log.attendanceId, "APPROVED");
      toast.success("Attendance approved");
    } catch { toast.error("Failed to approve"); }
  };

  const handleAbsent = async (log) => {
    try {
      await approveAttendance(log.attendanceId, false, "Marked absent by employer");
      onStatusChange(log.attendanceId, "REJECTED");
      toast.success("Marked as absent");
    } catch { toast.error("Failed to mark absent"); }
  };

  const handleReUpload = async (log) => {
    try {
      await resetAttendance(log.attendanceId);
      onStatusChange(log.attendanceId, "PENDING");
      toast.success("Reopened for re-upload");
    } catch { toast.error("Failed to request re-upload"); }
  };

  return (
    <div className="bg-slate-50/50 p-4 border-t border-slate-100">
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide px-2">
        {logs.map((log) => {
          const dateObj = new Date(log.date);
          const dayNum = dateObj.getDate();
          const isHighlighted = highlightedDay === dayNum;
          const ui = STATUS_UI[log.status] || STATUS_UI.PENDING;

          return (
            <div
              key={log.attendanceId}
              ref={(el) => (logRefs.current[dayNum] = el)}
              className={cn(
                "min-w-[320px] bg-white border rounded-2xl p-4 shadow-sm relative transition-all duration-300",
                isHighlighted ? "border-slate-900 ring-2 ring-slate-900/10 scale-[1.02] z-10" : "border-slate-200"
              )}
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl", ui.stripe)} />

              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl border overflow-hidden bg-slate-50 flex-shrink-0">
                  {log.sitePhoto ? (
                    <img src={log.sitePhoto} alt="Site" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-black">{dateObj.toLocaleDateString("en-IN")}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                        <MapPin className="w-3 h-3" /> GPS Verified
                      </div>
                    </div>
                    <span className={cn("p-1.5 rounded-full ring-4", ui.badge)}>
                      {log.status === "APPROVED" ? <CheckCircle2 className="w-4 h-4" /> : 
                       log.status === "REJECTED" ? <XCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Check In</span>
                      <span className="text-xs font-black">{log.checkIn ? formatTimeIST(log.checkIn) : "--:--"}</span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Check Out</span>
                      <span className="text-xs font-black">{log.checkOut ? formatTimeIST(log.checkOut) : "--:--"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {!log.isEmpty && (
                <>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">
                      {log.dayType || "FULL DAY"}
                    </span>
                    {log.otHours > 0 && (
                      <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {log.otHours}h OT
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    {log.status === "PENDING" && (
                      <>
                        <button onClick={() => handleVerify(log)} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">Verify</button>
                        <button onClick={() => handleAbsent(log)} className="flex-1 border border-rose-200 text-rose-600 py-2 rounded-xl text-xs font-bold">Absent</button>
                      </>
                    )}
                    {log.status === "APPROVED" && (
                      <button onClick={() => handleAbsent(log)} className="flex-1 border border-rose-200 text-rose-600 py-2 rounded-xl text-xs font-bold">Change to Absent</button>
                    )}
                    {log.status === "REJECTED" && (
                      <button onClick={() => handleVerify(log)} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">Change to Approved</button>
                    )}
                    <button onClick={() => handleReUpload(log)} className="flex items-center gap-1 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded-xl text-xs font-bold transition-colors">
                      <RotateCcw className="w-4 h-4" /> Re-Upload
                    </button>
                  </div>
                </>
              )}
              {log.isEmpty && (
                <div className="mt-4 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  No activity recorded for this day
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceLog;