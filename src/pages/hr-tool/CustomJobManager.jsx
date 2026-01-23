import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import JobBasicForm from "./components/JobBasicForm";
import ShiftPayrollForm from "./components/ShiftPayrollForm";
// import { getJobsPostedBy, getJobById, getJob } from "../../Services/JobService"; // Ensure getJobById is imported

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
    onClose,          // ✅ ADD THIS

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

      // 🔥 IMPORTANT: payroll may NOT exist on Job
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

  paymentFrequency: "DAILY", // ⭐ REQUIRED
  baseWageAmount: "",        // ⭐ JOB TEMPLATE

  payroll: {                 // ⭐ ASSIGNMENT PAY
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


  /* 🔍 LOG EVERY STATE CHANGE */
  useEffect(() => {
    console.group("📦 Job Data Updated");
    console.table(jobData);
    console.groupEnd();
  }, [jobData]);
const handleClose = () => {
  if (JSON.stringify(jobData) !== JSON.stringify(initialData ?? {})) {
    const ok = window.confirm("Discard unsaved changes?");
    if (!ok) return;
  }
  onClose?.();
};

  /* ===============================
     CREATE
  =============================== */
  const normalizeTime = (t) => {
    if (!t) return null;
    return t.length === 5 ? `${t}:00` : t; // HH:mm → HH:mm:00
  };

  const handleCreate = async () => {
    const payload = {
      ...jobData,
      shiftStartTime: normalizeTime(jobData.shiftStartTime),
      shiftEndTime: normalizeTime(jobData.shiftEndTime),
    };

    console.group("🚀 CREATE JOB");
    console.log("Payload sent to backend:", payload);
    console.groupEnd();

    try {
      await createCustomJob(payload);
      alert("Custom job created & attendance scheduled");
      onSuccess?.();
    } catch (err) {
      console.error("❌ Create job failed", err);
    }
  };

  /* ===============================
     EDIT
  =============================== */
const handleEdit = async (editPayload) => {
  const payload = {
    ...editPayload,
    shiftStartTime: normalizeTime(editPayload.shiftStartTime),
    shiftEndTime: normalizeTime(editPayload.shiftEndTime),
  };

  console.group("✏️ EDIT JOB (NORMALIZED)");
  console.log(payload);
  console.groupEnd();

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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-black">
    {mode === "CREATE" ? "Create Custom Job" : "Edit Job"}
  </h1>

<button
  onClick={handleClose}
  className="rounded-xl p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
  aria-label="Close"
>
  ✕
</button>

</div>

      {/* 🔍 CHILD PROPS LOG */}
      {console.log("➡️ Passing jobData to JobBasicForm", jobData)}
      <JobBasicForm
        data={jobData}
        setData={setJobData}
        disabled={mode === "EDIT"}
      />

      {console.log("➡️ Passing jobData to ShiftPayrollForm", jobData)}
      <ShiftPayrollForm data={jobData} setData={setJobData} />

      {console.log("➡️ Passing jobData to WorkerAssignmentPicker", jobData)}
      <WorkerAssignmentPicker data={jobData} setData={setJobData} />

      <AssignedWorkersTable
        workers={jobData.workerIds}
        mode={mode}
        onRemove={(id) => {
          console.group("🗑️ REMOVE WORKER");
          console.log("Removing worker ID:", id);
          setJobData((d) => {
            const updated = {
              ...d,
              workerIds: d.workerIds.filter((w) => w !== id),
            };
            console.log("Updated workerIds:", updated.workerIds);
            return updated;
          });
          console.groupEnd();
        }}
      />

      {mode === "CREATE" ? (
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Create Job & Assign Workers
        </button>
      ) : (
        <button
          onClick={() => handleEdit({ ...jobData })}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default CustomJobManager;