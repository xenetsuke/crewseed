import React, { useEffect } from "react";
import { 
  Clock, 
  Lock, 
  ArrowRight,
  CircleDollarSign,
  Zap,
  Coffee
} from "lucide-react";

const ShiftPayrollForm = ({ data, setData, attendanceLocked = false }) => {
  
  /**
   * ✅ FORMATTER: Converts "09:30" -> "9:30 AM"
   * Business Rule: Data remains "HH:mm", UI shows "12h"
   */
  const format12h = (time) => {
    if (!time) return "--:--";
    try {
      return new Date(`1970-01-01T${time}:00`)
        .toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
    } catch (e) {
      return time;
    }
  };

  const updateShift = (field, value) => {
    setData((d) => ({ ...d, [field]: value }));
  };

  const updatePayroll = (field, value) => {
    setData((d) => ({
      ...d,
      payroll: { ...d.payroll, [field]: value === "" ? null : Number(value) },
    }));
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Shift Schedule</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">IST Business Hours</p>
          </div>
        </div>

        {attendanceLocked && (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl">
            <Lock size={14} className="text-rose-600" />
            <span className="text-xs font-black text-rose-700 uppercase">ReadOnly Mode</span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-10">
        {/* SHIFT SECTION */}
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Start Time */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Shift Starts</label>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md border border-indigo-100">
                  {format12h(data.shiftStartTime)}
                </span>
              </div>
              <input
                type="time"
                disabled={attendanceLocked}
                value={data.shiftStartTime || ""}
                onChange={(e) => updateShift("shiftStartTime", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* End Time */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Shift Ends</label>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md border border-indigo-100">
                  {format12h(data.shiftEndTime)}
                </span>
              </div>
              <input
                type="time"
                disabled={attendanceLocked}
                value={data.shiftEndTime || ""}
                onChange={(e) => updateShift("shiftEndTime", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
              />
            </div>

          </div>
        </section>

        <hr className="border-slate-100" />

        {/* PAYROLL SECTION */}
        {/* <section className="space-y-6">
          <div className="flex items-center gap-2">
            <CircleDollarSign size={18} className="text-slate-400" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Rate Card (Daily)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PayrollInput 
              label="Basic" 
              icon={<CircleDollarSign size={14}/>} 
              color="emerald"
              value={data.payroll?.basePay}
              onChange={(val) => updatePayroll("basePay", val)}
              disabled={attendanceLocked}
            />
            <PayrollInput 
              label="OT / Hour" 
              icon={<Zap size={14}/>} 
              color="blue"
              value={data.payroll?.otPay}
              onChange={(val) => updatePayroll("otPay", val)}
              disabled={attendanceLocked}
            />
            <PayrollInput 
              label="Daily Bata" 
              icon={<Coffee size={14}/>} 
              color="orange"
              value={data.payroll?.bata}
              onChange={(val) => updatePayroll("bata", val)}
              disabled={attendanceLocked}
            />
          </div>
        </section> */}
      </div>
    </div>
  );
};

// Sub-component for clean Payroll fields
const PayrollInput = ({ label, icon, color, value, onChange, disabled }) => {
  const themes = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10",
    blue: "bg-blue-50 text-blue-700 border-blue-100 focus:border-blue-500 focus:ring-blue-500/10",
    orange: "bg-orange-50 text-orange-700 border-orange-100 focus:border-orange-500 focus:ring-orange-500/10"
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 ml-1">
        <span className={themes[color].split(' ')[1]}>{icon}</span>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</label>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-40">₹</span>
        <input
          type="number"
          placeholder="0"
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-8 pr-4 py-3 border-2 rounded-2xl text-sm font-black outline-none transition-all disabled:opacity-50 ${themes[color]}`}
        />
      </div>
    </div>
  );
};

export default ShiftPayrollForm;