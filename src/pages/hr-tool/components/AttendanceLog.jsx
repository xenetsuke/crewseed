import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  RotateCcw,
  CalendarDays,
  Minus,
  Plus,
  Clock,
  Coins,
  Save,
  Loader,
  ExternalLink,
  Check // Imported Check icon for success state visual
} from "lucide-react";
import toast from "react-hot-toast";
import { approveAttendance, resetAttendance, updateHrPayroll, generateAttendancePhotoLink } from "Services/AttendanceService";
import { formatTimeIST } from "utils/time";
import { cn } from "utils/cn";
import { STATUS_UI } from "./attendanceStatusUI";

/** * Helper to calculate totals based on current values (prop + local edits) 
 */
const calculateTotals = (currentPayroll) => {
  const daily = Number(currentPayroll.dailyPay || 0);
  const ot = Number(currentPayroll.overtimePay || 0);
  const bata = Number(currentPayroll.bata || 0);
  const advance = Number(currentPayroll.advanceDeduction || 0);
  const pf = Number(currentPayroll.pfDeduction || 0);
  const esi = Number(currentPayroll.esiDeduction || 0);

  const gross = daily + ot + bata;
  const deductions = pf + esi + advance;
  const net = gross - deductions;

  return {
    ...currentPayroll,
    grossPay: gross,
    totalDeductions: deductions,
    netPayable: net,
  };
};

const AttendanceLog = ({
  logs = [],
  highlightedDay,
  onStatusUpdate,
  onRefresh, 
}) => {
  const [processingId, setProcessingId] = useState(null);
  const [refreshingId, setRefreshingId] = useState(null); 
  const [pendingChanges, setPendingChanges] = useState({}); 
  const logRefs = useRef({});
  const actionLockRef = useRef(false);

  // 1. Clear pending changes AND loading state when backend logs change
  useEffect(() => {
    setPendingChanges({});
    setRefreshingId(null); 
  }, [logs]);

  // 2. Scroll to highlighted day ONLY when highlightedDay changes (Removed logs from dependency)
  useEffect(() => {
    if (highlightedDay && logRefs.current[highlightedDay]) {
      logRefs.current[highlightedDay].scrollIntoView({
        behavior: "smooth",
        block: "center", // Changed to center for vertical view
        inline: "center",
      });
    }
  }, [highlightedDay]); 

  // Handles local UI updates (Plus/Minus) without API call
  const handleLocalUpdate = (attendanceId, field, delta, currentPayroll) => {
    const currentValue = Number(pendingChanges[attendanceId]?.[field] ?? currentPayroll[field] ?? 0);
    const newValue = Math.max(0, currentValue + delta);

    setPendingChanges((prev) => ({
      ...prev,
      [attendanceId]: {
        ...(prev[attendanceId] || {}),
        [field]: newValue,
      },
    }));
  };
// ✅ MOBILE-SAFE CLIPBOARD COPY (FIXES PERMISSION + MOBILE ISSUE)
const copyToClipboard = (text) => {
  try {
    // Modern browsers (desktop)
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    // 🔥 Fallback for mobile & in-app browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!success) throw new Error("Copy failed");
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

  // The "Submit" action - Sends data to API and shows Toast
  const submitPayrollChanges = async (log, mergedPayroll) => {
    const changes = pendingChanges[log.attendanceId];
    if (!changes) return;

    try {
      setProcessingId(`${log.attendanceId}-save`);
      
      const finalPayload = calculateTotals({ ...log.payroll, ...changes });

      await updateHrPayroll(log.attendanceId, finalPayload);
      
      setRefreshingId(log.attendanceId); 
      onRefresh?.(); 
      onStatusUpdate?.(log.attendanceId, log.status); 

      setPendingChanges((prev) => {
        const next = { ...prev };
        delete next[log.attendanceId];
        return next;
      });

      toast.success("Payroll updated successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      setRefreshingId(null); 
    } finally {
      setProcessingId(null);
    }
  };

  const runAction = async (attendanceId, newStatus, successMsg, apiFn) => {
    if (!attendanceId || String(attendanceId).startsWith("temp")) {
      toast.error("Attendance not yet created for this day");
      return;
    }
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    setProcessingId(attendanceId);

    // Optimistic update
    onStatusUpdate?.(attendanceId, newStatus);
    toast.success(successMsg);

    try {
      await apiFn();
      
      setRefreshingId(attendanceId);
      onRefresh?.();

    } catch (error) {
      console.error("Attendance update failed:", error);
      toast.error("Update failed. Please try again.");
      setRefreshingId(null); 
    } finally {
      setProcessingId(null);
      actionLockRef.current = false;
    }
  };

  return (
    <div className="bg-slate-50/50 md:p-4 border-t border-slate-100">
      {/* Mobile Changes: 
           - Changed to flex-col for vertical optimization
           - Removed snap-x/overflow-x for mobile, kept for larger screens if needed
           - w-full for cards
      */}
<div className="
  flex flex-row gap-4
  overflow-x-auto py-4 px-4
  snap-x snap-mandatory
  no-scrollbar
">
        {logs.map((log) => {
          const dateObj = new Date(log.date);
          const dayNum = dateObj.getDate();
          const ui = STATUS_UI[log.status] || STATUS_UI.EMPTY;
          
          const isProcessing = String(processingId).startsWith(log.attendanceId);
          const isCopying = processingId === `${log.attendanceId}-copy`; // Specific loading state for copying
          const isRefreshing = refreshingId === log.attendanceId; 

          const isApproved = log.status === "APPROVED";
          const isHalfDay = log.status === "HALF_DAY";
          const isAbsent = log.status === "REJECTED" || log.status === "AUTO_MARKED_ABSENT";
          const isEmpty = log.isEmpty === true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          const isFutureDay = logDate > today && !log.attendanceId;

          const activeChanges = pendingChanges[log.attendanceId] || {};
          const mergedPayroll = { ...log.payroll, ...activeChanges };
          const calculated = calculateTotals(mergedPayroll);
          const hasUnsavedChanges = Object.keys(activeChanges).length > 0;

          return (
            <div
              key={log.attendanceId || dayNum}
              ref={(el) => (logRefs.current[dayNum] = el)}
              /* Mobile Changes:
                  - w-full: Full width vertical stacking
                  - sm:min-w-[320px]: Keep card size on desktop
              */
           className={cn(
  "min-w-[300px] sm:min-w-[340px] snap-center bg-white border rounded-2xl p-4 shadow-sm relative transition-all duration-300",
  highlightedDay === dayNum ? "ring-2 ring-blue-500 border-transparent scale-[1.01]" : "border-slate-200",
  isProcessing && "ring-1 ring-slate-100 opacity-90"
)}

            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-colors duration-500", ui.stripe)} />

              {/* ✅ MODERN LOADING OVERLAY (Internal) */}
              {isRefreshing && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 animate-in fade-in">
                  <div className="bg-white p-3 rounded-full shadow-xl shadow-indigo-100/50 border border-indigo-50">
                    <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                  <div className="mt-3 flex flex-col items-center">
                    <p className="text-xs font-bold text-indigo-900 animate-pulse">Syncing Data</p>
                    <p className="text-[10px] text-slate-400 font-medium">Please wait...</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-20 h-20 border rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                  {log.sitePhoto ? (
                    <img src={log.sitePhoto} className="w-full h-full object-cover" alt="Verification" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6 opacity-30" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-black text-slate-800">
                      {dateObj.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </p>
                    <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors", ui.badge)}>
                      {ui.icon && <ui.icon className="w-3.5 h-3.5" />}
                      {ui.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-slate-600">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] font-bold">
                      <span className="block text-[9px] text-slate-400 uppercase">In</span>
                      {log.checkIn ? formatTimeIST(log.checkIn) : "--:--"}
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] font-bold">
                      <span className="block text-[9px] text-slate-400 uppercase">Out</span>
                      {log.checkOut ? formatTimeIST(log.checkOut) : "--:--"}
                    </div>
                  </div>
                </div>
              </div>

              {/* EARNINGS & HR CONTROLS SECTION */}
              {!isEmpty && !isFutureDay && (
                <div className="mt-3 space-y-3 border-t border-slate-50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Net Earned</span>
                    <span className={cn("text-sm font-black", calculated.netPayable < 0 ? "text-rose-600" : "text-emerald-600")}>
                      ₹{calculated.netPayable.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* SUMMARY TILES (PF, ESI, ADVANCE) */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex flex-col items-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">PF</span>
                      <span className="text-[10px] font-black text-slate-600">₹{mergedPayroll.pfDeduction || 0}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex flex-col items-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">ESI</span>
                      <span className="text-[10px] font-black text-slate-600">₹{mergedPayroll.esiDeduction || 0}</span>
                    </div>
                    <div className="bg-rose-50 p-1.5 rounded-lg border border-rose-100 flex flex-col items-center">
                      <span className="text-[8px] font-bold text-rose-400 uppercase">Advance</span>
                      <span className="text-[10px] font-black text-rose-600">₹{mergedPayroll.advanceDeduction || 0}</span>
                    </div>
                  </div>

                  {(isApproved || isHalfDay) && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-1.5 py-1">
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "overtimePay", 50, mergedPayroll)}>
                          <Plus className="w-3 h-3 text-emerald-600" />
                        </button>
                        <div className="flex flex-col items-center">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-[8px] font-bold text-slate-500">₹{mergedPayroll.overtimePay || 0}</span>
                        </div>
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "overtimePay", -50, mergedPayroll)}>
                          <Minus className="w-3 h-3 text-rose-600" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-1.5 py-1">
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "bata", 50, mergedPayroll)}>
                          <Plus className="w-3 h-3 text-emerald-600" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-black text-slate-400 leading-none">BATA</span>
                          <span className="text-[8px] font-bold text-slate-500">₹{mergedPayroll.bata || 0}</span>
                        </div>
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "bata", -50, mergedPayroll)}>
                          <Minus className="w-3 h-3 text-rose-600" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-rose-50 rounded-lg px-1.5 py-1">
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "advanceDeduction", 100, mergedPayroll)}>
                          <Plus className="w-3 h-3 text-rose-600" />
                        </button>
                        <div className="flex flex-col items-center">
                          <Coins className="w-3 h-3 text-rose-400" />
                          <span className="text-[8px] font-bold text-rose-500">₹{mergedPayroll.advanceDeduction || 0}</span>
                        </div>
                        <button className="active:scale-95 transition-transform touch-manipulation" onClick={() => handleLocalUpdate(log.attendanceId, "advanceDeduction", -100, mergedPayroll)}>
                          <Minus className="w-3 h-3 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* SUBMIT BUTTON */}
                  {hasUnsavedChanges && (
                    <button
                      onClick={() => submitPayrollChanges(log, mergedPayroll)}
                      disabled={isProcessing || isRefreshing}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-95 touch-manipulation"
                    >
                      {isProcessing ? (
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wide">Save Changes</span>
                    </button>
                  )}

                  {/* 🔗 SEND PHOTO LINK (HR ONLY) */}
                  {(log.status === "NOT_STARTED" || log.status === "PENDING_VERIFICATION") && (
                    <button
                      disabled={isRefreshing || isCopying}
                    onClick={async () => {
  try {
    const res = await generateAttendancePhotoLink(log.attendanceId);
    const { uploadUrl } = res.data;

    // ✅ BEST MOBILE SOLUTION
    if (navigator.share) {
      await navigator.share({
        title: "Attendance Photo Upload",
        text: "Upload your attendance photo using this link",
        url: uploadUrl,
      });
      toast.success("Share opened");
      return;
    }

    // Fallback (desktop only)
    window.open(uploadUrl, "_blank");
  } catch (err) {
    toast.error("Failed to generate photo link");
  }
}}

                      className={cn(
                        "w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 touch-manipulation transition-colors",
                        isCopying ? "bg-indigo-50 text-indigo-600" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      )}
                    >
                      {isCopying ? (
                         <>
                           <Loader className="w-4 h-4 animate-spin" />
                           Generating...
                         </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Photo Link
                        </>
                      )}
                    </button>
                  )}

                  {/* ACTION FOOTER */}
                  <div className="pt-2 flex gap-2">
                    {!isApproved && !isHalfDay && (
                      <button
                        disabled={isProcessing || isRefreshing}
                        onClick={() => runAction(log.attendanceId, "APPROVED", "Marked Present", () => approveAttendance(log.attendanceId, true, ""))}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:bg-slate-200 active:scale-95 touch-manipulation"
                      >
                        Mark Present
                      </button>
                    )}

                    {!isAbsent && (
                      <button
                        disabled={isProcessing || isRefreshing}
                        onClick={() => runAction(log.attendanceId, "REJECTED", "Marked Absent", () => approveAttendance(log.attendanceId, false, "Employer marked absent"))}
                        className="flex-1 py-2.5 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold disabled:border-slate-100 active:scale-95 touch-manipulation"
                      >
                        Mark Absent
                      </button>
                    )}

                    <button
                      disabled={isProcessing || isRefreshing}
                      onClick={() => runAction(log.attendanceId, "PENDING_VERIFICATION", "Record Reset", () => resetAttendance(log.attendanceId))}
                      className="px-4 py-2.5 border border-slate-200 text-xs text-blue-600 rounded-xl text-xs font-bold disabled:border-slate-100 disabled:opacity-50 active:scale-95 touch-manipulation"
                    >
                      Reupload
                    </button>
                  </div>
                </div>
              )}

              {/* EMPTY LOG OR FUTURE DAY FOOTER */}
              {(isEmpty || isFutureDay) && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  {isFutureDay ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <CalendarDays className="w-3.5 h-3.5" /> Upcoming Shift
                    </div>
                  ) : (
                    <div className="flex-1 py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter self-center">
                      No logs for this day
                    </div>
                  )}
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