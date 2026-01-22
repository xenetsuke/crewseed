import React, { useState, useEffect, useMemo } from "react";
import { Info, User, ExternalLink } from "lucide-react";
import AttendanceLog from "./AttendanceLog";
import AssignmentStatsOverview from "./AssignmentStatsOverview";
import { cn } from "utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyPayrollForAssignment } from "Services/monthlyPayroll.service";

const WorkerRow = ({
  worker,
  onEditAssignment,
  viewMonth,
  viewYear,
  onAttendanceUpdated, // ✅ ADD THIS
}) => {


  if (!worker) return null;
  const assignmentId = worker.assignment?.id;

  // const [attendanceRecords, setAttendanceRecords] = useState(
  //   worker.attendance || []
  // );
  const [showLogs, setShowLogs] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
const [isDirty, setIsDirty] = useState(false);

  const currentMonth = viewMonth;
  const currentYear = viewYear;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
// useEffect(() => {
//   if (!isDirty) {
//     setAttendanceRecords(worker.attendance || []);
//   }
// }, [worker.attendance, isDirty]);

  // useEffect(() => {
  //   setAttendanceRecords(worker.attendance || []);
  // }, [worker.attendance]);
const attendanceRecords = worker.attendance || [];

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

      if (!basePay && a.payroll.basePay) {
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

const downloadPayrollChit = () => {
    const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(viewYear, viewMonth));
    const slipHtml = `
      <html>
        <head>
          <title>Salary_Slip_${worker.name}_${monthYear}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
            .slip-title { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 6px; }
            .meta-item p { margin: 4px 0; font-size: 13px; }
            .meta-item span { color: #64748b; font-weight: 500; }
            
            .payroll-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .payroll-table th { text-align: left; background: #0f172a; color: #fff; padding: 10px 15px; font-size: 12px; text-transform: uppercase; }
            .payroll-table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .section-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #f1f5f9; }
            .earnings { border-right: 1px solid #f1f5f9; }
            
            .amount { text-align: right; font-family: monospace; font-weight: 600; }
            .total-row { background: #f8fafc; font-weight: 700; }
            .net-payable-box { margin-top: 20px; padding: 20px; background: #0f172a; color: #fff; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
            .net-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
            .net-amount { font-size: 24px; font-weight: 800; }
            
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature { border-top: 1px solid #cbd5e1; width: 200px; text-align: center; padding-top: 10px; font-size: 12px; color: #64748b; }
            @media print { body { padding: 0; } .container { border: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <h1 class="company-name">PAYROLL DISBURSEMENT</h1>
                <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Period: ${monthYear}</p>
              </div>
              <div class="slip-title">Private & Confidential</div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <p><span>Employee Name:</span> ${worker.name}</p>
                <p><span>Designation:</span> ${worker.role}</p>
              </div>
              <div class="meta-item">
                <p><span>Statement Date:</span> ${new Date().toLocaleDateString('en-IN')}</p>
                <p><span>Status:</span> Generated Online</p>
              </div>
            </div>

            <div class="section-split">
              <div class="earnings">
                <table class="payroll-table">
                  <thead><tr><th>Earnings Description</th><th class="amount">Amount</th></tr></thead>
                  <tbody>
                    <tr><td>Basic/Attendance Pay</td><td class="amount">₹${effectivePayroll.dailyPay.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Overtime (OT)</td><td class="amount">₹${effectivePayroll.overtimePay.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Bata / Allowance</td><td class="amount">₹${effectivePayroll.bata.toLocaleString('en-IN')}</td></tr>
                    <tr class="total-row"><td>Gross Earnings</td><td class="amount">₹${effectivePayroll.grossPay.toLocaleString('en-IN')}</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="deductions">
                <table class="payroll-table">
                  <thead><tr><th>Deductions</th><th class="amount">Amount</th></tr></thead>
                  <tbody>
                    <tr><td>Provident Fund (PF)</td><td class="amount">₹${effectivePayroll.pfDeduction.toLocaleString('en-IN')}</td></tr>
                    <tr><td>ESI</td><td class="amount">₹${effectivePayroll.esiDeduction.toLocaleString('en-IN')}</td></tr>
                    <tr><td>Advance Recovery</td><td class="amount">₹${effectivePayroll.advanceDeduction.toLocaleString('en-IN')}</td></tr>
                    <tr class="total-row"><td>Total Deductions</td><td class="amount">₹${effectivePayroll.totalDeductions.toLocaleString('en-IN')}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="net-payable-box">
              <span class="net-label">Net Payable Amount</span>
              <span class="net-amount">₹${effectivePayroll.netPayable.toLocaleString('en-IN')}</span>
            </div>

            <div class="footer">
              <div class="signature">Employer Signature</div>
              <div class="signature">Employee Signature</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const win = window.open("", "_blank");
    win.document.write(slipHtml);
    win.document.close();
  };

  const handleAttendanceStatusChange = (attendanceId, newStatus) => {
    // setAttendanceRecords((prev) =>
    //   prev.map((a) =>
    //     a.attendanceId === attendanceId ? { ...a, status: newStatus } : a
    //   )
    // );
  };

  const getDayInfo = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(currentYear, currentMonth, day);
    if (targetDate > today) return { status: "FUTURE", label: "Upcoming" };

    const record = attendanceRecords.find((a) => {
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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 overflow-hidden transition-all hover:border-slate-300">
      <div className="p-4 lg:p-6">
        {/* WORKER HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {worker.role}
              </p>
            </div>
          </div>

          <button
            onClick={() => onEditAssignment(worker.assignment)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
          >
            <ExternalLink className="w-3.5 h-3.5" />
              {/* worker={worker}   // 👈 add this */}

            Edit Assignment
          </button>
        </div>

        <div className="mb-6">
          <AssignmentStatsOverview payroll={effectivePayroll} />
        </div>

        {/* HEATMAP GRID */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
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
                    "w-9 h-11 rounded-lg border text-[11px] font-black transition-all flex items-center justify-center",
                    status === "APPROVED" && "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200",
                    status === "REJECTED" && "bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200",
                    status === "PENDING" && "bg-amber-400 text-white border-amber-500 shadow-sm shadow-amber-100",
                    status === "NOT_STARTED" && "bg-blue-500 text-white border-blue-600 shadow-sm shadow-blue-100",
                    status === "FUTURE" && "bg-white text-slate-300 border-slate-100",
                    status === "EMPTY" && "bg-slate-50 text-slate-400 border-slate-200",
                    isSelected && "ring-2 ring-slate-900 ring-offset-2 scale-105 z-10"
                  )}
                >
                  {day}
                </button>
                {(hoveredDay === day || isSelected) && (
                  <div className="absolute -top-9 z-20 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap animate-in fade-in zoom-in-95">
                    <Info className="w-3 h-3 text-teal-400" /> {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {[
              { color: "bg-emerald-500", text: "Present" },
              { color: "bg-rose-500", text: "Absent" },
              { color: "bg-amber-400", text: "Pending" },
              { color: "bg-blue-500", text: "No Photo" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <span className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest transition-colors"
            >
              {showLogs ? "Hide Logs" : "View Logs"}
            </button>

            <button
              onClick={downloadPayrollChit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-sm shadow-emerald-200"
            >
              Download PaySlip
            </button>
          </div>
        </div>
      </div>

      {showLogs && (
        <div className="border-t border-slate-100 bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
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