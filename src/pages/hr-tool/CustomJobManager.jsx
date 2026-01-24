import React, { useEffect, useState } from "react";
import { Loader2, X, Check, Plus } from "lucide-react"; // Added Icons
import JobBasicForm from "./components/JobBasicForm";
import ShiftPayrollForm from "./components/ShiftPayrollForm";
import WorkerAssignmentPicker from "./components/WorkerAssignmentPicker";
import AssignedWorkersTable from "./components/AssignedWorkersTable";
import {
  createCustomJob,
  editCustomJob,
} from "../../Services/customJob.service";

const CustomJobManager = ({
  mode = "CREATE",      // "CREATE" | "EDIT"
  jobId,
  initialData,
  onSuccess,
  onClose,
}) => {
  // ✅ STEP 3: GUARD RENDER
  if (mode === "EDIT" && !initialData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
      </div>
    );
  }

  useEffect(() => {
    if (mode === "EDIT" && initialData) {
      setJobData({
        jobTitle: initialData.jobTitle || "",
        companyName: initialData.companyName || "",
        managerName: initialData.managerName || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        shiftStartTime: initialData.shiftStartTime || "",
        shiftEndTime: initialData.shiftEndTime || "",
        paymentFrequency: initialData.paymentFrequency || "DAILY",
        baseWageAmount: initialData.baseWageAmount || "",
        payroll: initialData.payroll ?? {
          basePay: initialData.baseWageAmount || 0,
          dailyPay: 0,
          overtimePay: 0,
          bata: 0,
          pfDeduction: 0,
          esiDeduction: 0,
          advanceDeduction: 0,
        },
        workerIds: initialData.workerIds || [],
      });
    }
  }, [mode, initialData]);

  // ✅ STEP 4: INITIALIZE FORM STATE SAFELY
  const [jobData, setJobData] = useState(() => ({
    jobTitle: "",
    companyName: "",
    managerName: "",
    city: "",
    state: "",
    pincode: "",
    startDate: "",
    endDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
    paymentFrequency: "DAILY",
    baseWageAmount: "",
    payroll: {
      basePay: "",
      dailyPay: "",
      overtimePay: "",
      bata: "",
      pfDeduction: "",
      esiDeduction: "",
      advanceDeduction: "",
    },
    workerIds: [],
  }));

  const handleClose = () => {
    // Basic check for unsaved changes
    const hasChanges = JSON.stringify(jobData) !== JSON.stringify(initialData ?? {
      jobTitle: "", companyName: "", managerName: "", city: "", state: "", pincode: "",
      startDate: "", endDate: "", shiftStartTime: "", shiftEndTime: "",
      paymentFrequency: "DAILY", baseWageAmount: "", workerIds: [],
      payroll: { basePay: "", dailyPay: "", overtimePay: "", bata: "", pfDeduction: "", esiDeduction: "", advanceDeduction: "" }
    });

    if (hasChanges) {
      const ok = window.confirm("Discard unsaved changes?");
      if (!ok) return;
    }
    onClose?.();
  };

  const normalizeTime = (t) => {
    if (!t) return null;
    return t.length === 5 ? `${t}:00` : t; 
  };

  const handleCreate = async () => {
    const payload = {
      ...jobData,
      shiftStartTime: normalizeTime(jobData.shiftStartTime),
      shiftEndTime: normalizeTime(jobData.shiftEndTime),
    };
    try {
      await createCustomJob(payload);
      alert("Custom job created & attendance scheduled");
      onSuccess?.();
    } catch (err) {
      console.error("❌ Create job failed", err);
    }
  };

  const handleEdit = async (editPayload) => {
    const payload = {
      ...editPayload,
      shiftStartTime: normalizeTime(editPayload.shiftStartTime),
      shiftEndTime: normalizeTime(editPayload.shiftEndTime),
    };
    try {
      const employerId = JSON.parse(localStorage.getItem("user"))?.id;
      await editCustomJob(employerId, jobId, payload);
      alert("Job updated safely");
      onSuccess?.();
    } catch (err) {
      console.error("❌ Edit job failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50/30 rounded-[3rem]">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {mode === "CREATE" ? "Create Custom Job" : "Edit Job"}
          </h1>
          <p className="text-slate-500 font-medium">Configure project details and work hours</p>
        </div>

        <button
          onClick={handleClose}
          className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all duration-300 shadow-sm"
          aria-label="Close"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Close</span>
          <X size={20} className="transition-transform group-hover:rotate-90" />
        </button>
      </div>

      <JobBasicForm
        data={jobData}
        setData={setJobData}
        disabled={mode === "EDIT"}
      />

      <ShiftPayrollForm data={jobData} setData={setJobData} />

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
        <button
          onClick={handleClose}
          className="px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>

        {mode === "CREATE" ? (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Job & Assign
          </button>
        ) : (
          <button
            onClick={() => handleEdit({ ...jobData })}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 transition-all active:scale-95"
          >
            <Check size={20} />
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomJobManager;