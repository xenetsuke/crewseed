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
  Check, // Using this for the cinematic success state
  Sparkles // Added for modern flair
} from "lucide-react";
import toast from "react-hot-toast";
import { approveAttendance, resetAttendance, updateHrPayroll, generateAttendancePhotoLink } from "Services/AttendanceService";
import { formatTimeIST } from "utils/time";
import { cn } from "utils/cn";
import { STATUS_UI } from "./attendanceStatusUI";

/** Helper to calculate totals based on current values (prop + local edits) */
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
  
  // New state to handle the artificial 4-second delay
  const [extendedLoadingId, setExtendedLoadingId] = useState(null);
  
  const [pendingChanges, setPendingChanges] = useState({});
  const logRefs = useRef({});
  const actionLockRef = useRef(false);

  // 1. Clear pending changes when backend logs change. 
  // NOTE: We do NOT clear extendedLoadingId here, ensuring the animation persists.
  useEffect(() => {
    setPendingChanges({});
  }, [logs]);

  // 2. Scroll to highlighted day
  useEffect(() => {
    if (highlightedDay && logRefs.current[highlightedDay]) {
      logRefs.current[highlightedDay].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [highlightedDay]);

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

  // The "Submit" action
  const submitPayrollChanges = async (log, mergedPayroll) => {
    const changes = pendingChanges[log.attendanceId];
    if (!changes) return;

    try {
      setProcessingId(`${log.attendanceId}-save`);
      const finalPayload = calculateTotals({ ...log.payroll, ...changes });

      await updateHrPayroll(log.attendanceId, finalPayload);
      
      // Trigger data refresh
      onRefresh?.();
      onStatusUpdate?.(log.attendanceId, log.status);

      // Start the Cinematic Delay (4 Seconds)
      setExtendedLoadingId(log.attendanceId);
      setTimeout(() => {
        setExtendedLoadingId(null);
      }, 4000); 

      setPendingChanges((prev) => {
        const next = { ...prev };
        delete next[log.attendanceId];
        return next;
      });

      toast.success("Payroll updated successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      setExtendedLoadingId(null);
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
      
      // Trigger data refresh
      onRefresh?.();

      // Start the Cinematic Delay (4 Seconds)
      setExtendedLoadingId(attendanceId);
      setTimeout(() => {
        setExtendedLoadingId(null);
      }, 6000);

    } catch (error) {
      console.error("Attendance update failed:", error);
      toast.error("Update failed. Please try again.");
      setExtendedLoadingId(null);
    } finally {
      setProcessingId(null);
      actionLockRef.current = false;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 md:p-6 border-t border-slate-200/60 min-h-[400px]">
      <div className="
        flex flex-row gap-6
        overflow-x-auto py-6 px-4
        snap-x snap-mandatory
        no-scrollbar pb-12
      ">
        {logs.map((log) => {
          const dateObj = new Date(log.date);
          const dayNum = dateObj.getDate();
          const ui = STATUS_UI[log.status] || STATUS_UI.EMPTY;
          
          const isProcessing = String(processingId).startsWith(log.attendanceId);
          const isCopying = processingId === `${log.attendanceId}-copy`;
          
          // Logic: Animation runs if Processing OR Extended Delay is active
          const isRefreshing = extendedLoadingId === log.attendanceId;

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
              className={cn(
                "min-w-[300px] sm:min-w-[350px] snap-center relative transition-all duration-500 ease-out",
                "bg-white/80 backdrop-blur-xl border rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]",
                highlightedDay === dayNum ? "ring-2 ring-indigo-500/50 border-indigo-200 scale-[1.02]" : "border-white/40",
                isProcessing && "scale-[0.98] opacity-95"
              )}
            >
              <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-colors duration-500 opacity-60", ui.stripe)} />

              {/* ✅ CINEMATIC LOADING OVERLAY */}
              {isRefreshing && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center transition-all duration-700 animate-in fade-in">
                  <div className="relative">
                     {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-20"></div>
                    {/* Spinner */}
                    <div className="bg-white p-4 rounded-full shadow-2xl shadow-indigo-200/50 border border-indigo-50 relative z-10">
                      <Loader className="w-8 h-8 text-indigo-600 animate-[spin_2s_linear_infinite]" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center gap-1">
                    <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent animate-pulse tracking-wide">
                      SYNCING DATA
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                      Updating Records
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-5">
                {/* Photo Section with Depth */}
                <div className="group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative shadow-inner ring-1 ring-slate-900/5">
                  {log.sitePhoto ? (
                    <img src={log.sitePhoto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Verification" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-300">
                      <Camera className="w-6 h-6 opacity-50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="text-lg font-black text-slate-800 tracking-tight leading-none">
                        {dateObj.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{dateObj.toLocaleDateString("en-IN", { weekday: 'long' })}</p>
                    </div>
                    
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-transparent transition-all",
                        ui.badge,
                        "backdrop-blur-sm bg-opacity-80"
                    )}>
                      {ui.icon && <ui.icon className="w-3 h-3" />}
                      {ui.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-slate-600">
                    <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 text-[11px] font-bold shadow-sm">
                      <span className="block text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">In Time</span>
                      {log.checkIn ? formatTimeIST(log.checkIn) : "--:--"}
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 text-[11px] font-bold shadow-sm">
                      <span className="block text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Out Time</span>
                      {log.checkOut ? formatTimeIST(log.checkOut) : "--:--"}
                    </div>
                  </div>
                </div>
              </div>

              {/* EARNINGS & CONTROLS */}
              {!isEmpty && !isFutureDay && (
                <div className="mt-5 space-y-4">
                  
                  {/* Glassy Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1">Net Pay</span>
                    <span className={cn(
                        "text-2xl font-black tracking-tight drop-shadow-sm", 
                        calculated.netPayable < 0 ? "text-rose-500" : "text-emerald-600"
                    )}>
                      <span className="text-lg align-top opacity-60 mr-0.5">₹</span>
                      {calculated.netPayable.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* SUMMARY TILES */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-colors">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">PF</span>
                      <span className="text-xs font-black text-slate-700">₹{mergedPayroll.pfDeduction || 0}</span>
                    </div>
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-colors">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">ESI</span>
                      <span className="text-xs font-black text-slate-700">₹{mergedPayroll.esiDeduction || 0}</span>
                    </div>
                    <div className="bg-rose-50/50 p-2 rounded-xl border border-rose-100/60 flex flex-col items-center justify-center gap-1 hover:bg-rose-50 transition-colors">
                      <span className="text-[9px] font-bold text-rose-400 uppercase">Adv</span>
                      <span className="text-xs font-black text-rose-600">₹{mergedPayroll.advanceDeduction || 0}</span>
                    </div>
                  </div>

                  {(isApproved || isHalfDay) && (
                    <div className="grid grid-cols-3 gap-2">
                      {/* Overtime Control */}
                      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-sm px-1 py-1.5">
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "overtimePay", 50, mergedPayroll)}>
                          <Plus className="w-3 h-3" />
                        </button>
                        <div className="flex flex-col items-center">
                          <Clock className="w-3 h-3 text-slate-300 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600">₹{mergedPayroll.overtimePay || 0}</span>
                        </div>
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "overtimePay", -50, mergedPayroll)}>
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Bata Control */}
                      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-sm px-1 py-1.5">
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "bata", 50, mergedPayroll)}>
                          <Plus className="w-3 h-3" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-black text-slate-300 uppercase leading-none mb-0.5">BATA</span>
                          <span className="text-[9px] font-bold text-slate-600">₹{mergedPayroll.bata || 0}</span>
                        </div>
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "bata", -50, mergedPayroll)}>
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Advance Control */}
                      <div className="flex items-center justify-between bg-white rounded-xl border border-rose-100 shadow-sm px-1 py-1.5">
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "advanceDeduction", 100, mergedPayroll)}>
                          <Plus className="w-3 h-3" />
                        </button>
                        <div className="flex flex-col items-center">
                          <Coins className="w-3 h-3 text-rose-300 mb-0.5" />
                          <span className="text-[9px] font-bold text-rose-600">₹{mergedPayroll.advanceDeduction || 0}</span>
                        </div>
                        <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 active:scale-90 transition-transform" onClick={() => handleLocalUpdate(log.attendanceId, "advanceDeduction", -100, mergedPayroll)}>
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* SUBMIT BUTTON */}
                  {hasUnsavedChanges && (
                    <button
                      onClick={() => submitPayrollChanges(log, mergedPayroll)}
                      disabled={isProcessing || isRefreshing}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:shadow-none active:scale-[0.98] group"
                    >
                      {isProcessing ? (
                        <RotateCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wide">Save Changes</span>
                    </button>
                  )}

                  {/* 🔗 SEND PHOTO LINK */}
                  {(log.status === "NOT_STARTED" || log.status === "PENDING_VERIFICATION") && (
                    <button
                      disabled={isRefreshing || isCopying}
                      onClick={async () => {
                          try {
                            const res = await generateAttendancePhotoLink(log.attendanceId);
                            const { uploadUrl } = res.data;
                            if (navigator.share) {
                              await navigator.share({
                                title: "Attendance Photo Upload",
                                text: "Upload your attendance photo using this link",
                                url: uploadUrl,
                              });
                              toast.success("Share opened");
                              return;
                            }
                            window.open(uploadUrl, "_blank");
                          } catch (err) {
                            toast.error("Failed to generate photo link");
                          }
                      }}
                      className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all duration-300 border",
                        isCopying 
                           ? "bg-slate-50 border-slate-200 text-slate-500" 
                           : "bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50 shadow-sm hover:shadow-indigo-100/50"
                      )}
                    >
                      {isCopying ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin text-indigo-500" />
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
                  <div className="pt-2 flex gap-3">
                    {!isApproved && !isHalfDay && (
                      <button
                        disabled={isProcessing || isRefreshing}
                        onClick={() => runAction(log.attendanceId, "APPROVED", "Marked Present", () => approveAttendance(log.attendanceId, true, ""))}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:bg-slate-200 active:scale-[0.98] transition-all"
                      >
                        Mark Present
                      </button>
                    )}

                    {!isAbsent && (
                      <button
                        disabled={isProcessing || isRefreshing}
                        onClick={() => runAction(log.attendanceId, "REJECTED", "Marked Absent", () => approveAttendance(log.attendanceId, false, "Employer marked absent"))}
                        className="flex-1 py-3 border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold disabled:border-slate-100 active:scale-[0.98] transition-all"
                      >
                        Mark Absent
                      </button>
                    )}

                    <button
                      disabled={isProcessing || isRefreshing}
                      onClick={() => runAction(log.attendanceId, "PENDING_VERIFICATION", "Record Reset", () => resetAttendance(log.attendanceId))}
                      className="px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-600 rounded-xl font-bold disabled:border-slate-100 disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm"
                    >
                      Reupload
                    </button>
                  </div>
                </div>
              )}

              {/* EMPTY LOG OR FUTURE DAY FOOTER */}
              {(isEmpty || isFutureDay) && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
                  {isFutureDay ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                      <CalendarDays className="w-4 h-4" /> Upcoming Shift
                    </div>
                  ) : (
                    <div className="px-6 py-3 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50/50 rounded-2xl">
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