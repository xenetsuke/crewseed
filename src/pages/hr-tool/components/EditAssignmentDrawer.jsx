import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import toast from "react-hot-toast";
import { updateAssignment } from "Services/AssignmentService";

const EditAssignmentDrawer = ({ open, onClose, assignment, onSaved }) => {
  const [form, setForm] = useState(null);

  /* ===============================
      LOAD & NORMALIZE EXISTING DATA
  =============================== */
  useEffect(() => {
    if (!assignment) return;

    // Helper to ensure initial load is always HH:mm:ss
    const ensureSeconds = (t) => {
      if (!t) return "00:00:00";
      if (t.length === 5) return `${t}:00`;
      return t;
    };

    setForm({
      id: assignment.id,
      remarks: assignment.remarks || "",
      shiftStartTime: ensureSeconds(assignment.shiftStartTime),
      shiftEndTime: ensureSeconds(assignment.shiftEndTime),
      payroll: {
        basePay: assignment.payroll?.basePay ?? 0,
        dailyPay: assignment.payroll?.dailyPay ?? 0,
        overtimePay: assignment.payroll?.overtimePay ?? 0,
        bata: assignment.payroll?.bata ?? 0,
        pfDeduction: assignment.payroll?.pfDeduction ?? 0,
        esiDeduction: assignment.payroll?.esiDeduction ?? 0,
        advanceDeduction: assignment.payroll?.advanceDeduction ?? 0,
        grossPay: assignment.payroll?.grossPay ?? 0,
        totalDeductions: assignment.payroll?.totalDeductions ?? 0,
        netPayable: assignment.payroll?.netPayable ?? 0,
      },
    });
  }, [assignment]);

  if (!open || !form) return null;

  /* ===============================
      TIME FORMATTER (UI ONLY)
  =============================== */
  const format12h = (time) => {
    if (!time) return "--:--";
    try {
      const [h, m] = time.split(":");
      const date = new Date(`1970-01-01T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`);
      if (isNaN(date.getTime())) return time;
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (e) {
      return time;
    }
  };

  /* ===============================
      STRICT NORMALIZATION HANDLER
  =============================== */
  const updateShift = (field, value) => {
    setForm((f) => ({
      ...f,
      /**
       * If value exists (from time input HH:mm), append :00.
       * If user clears input, keep the existing form value to prevent null payload.
       */
      [field]: value ? `${value}:00` : f[field],
    }));
  };

  const handlePayrollChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: value === "" ? 0 : Number(value),
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Form already contains normalized HH:mm:ss values
      await updateAssignment(form);
      toast.success("Assignment updated successfully");
      onSaved?.();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update assignment");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="p-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-indigo-600" />
            <h2 className="font-black text-lg text-slate-900">Edit Assignment</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <Input
            label="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-600 tracking-tight">Shift Timing</h3>
                {/* <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                  HH:mm:ss Format
                </span> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Starts</span>
                  <span className="text-[10px] text-indigo-600 font-black">{format12h(form.shiftStartTime)}</span>
                </div>
                <Input
                  type="time"
                  // input type="time" only accepts HH:mm or HH:mm:ss, but UI displays HH:mm
                  value={form.shiftStartTime?.substring(0, 5) || ""}
                  onChange={(e) => updateShift("shiftStartTime", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Ends</span>
                  <span className="text-[10px] text-indigo-600 font-black">{format12h(form.shiftEndTime)}</span>
                </div>
                <Input
                  type="time"
                  value={form.shiftEndTime?.substring(0, 5) || ""}
                  onChange={(e) => updateShift("shiftEndTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-600 tracking-tight">Payroll Details</h3>
            <div className="space-y-4">
              <Input
                label="Base Pay (₹)"
                type="number"
                value={form.payroll.basePay}
                onChange={(e) => handlePayrollChange("basePay", e.target.value)}
              />
              <Input
                label="Daily Pay (₹)"
                type="number"
                value={form.payroll.dailyPay}
                onChange={(e) => handlePayrollChange("dailyPay", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="PF Deduction (₹)"
                  type="number"
                  value={form.payroll.pfDeduction}
                  onChange={(e) => handlePayrollChange("pfDeduction", e.target.value)}
                />
                <Input
                  label="ESI Deduction (₹)"
                  type="number"
                  value={form.payroll.esiDeduction}
                  onChange={(e) => handlePayrollChange("esiDeduction", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex gap-3 bg-slate-50">
          <Button variant="outline" className="flex-1 font-bold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 font-bold" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditAssignmentDrawer;