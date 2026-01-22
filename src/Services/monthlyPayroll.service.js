import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =====================================================
   MONTHLY PAYROLL SERVICE
   ===================================================== */

/**
 * 🔹 Generate monthly payroll
 * HR-triggered (assignment + job aware)
 */
export const generateMonthlyPayroll = async ({
  jobId,
  assignmentId,
  workerId,
  year,
  month,
}) => {
  const res = await axiosInstance.post(
    "/payroll/monthly/generate",
    {
      jobId,
      assignmentId, // ✅ REQUIRED
      workerId,
      year,
      month,
    }
  );

  console.log("✅ Monthly payroll generated:", res.data);
  return res.data;
};

/**
 * 🔹 Get monthly payroll for a SINGLE assignment
 * ✅ Used in WorkerRow / Assignment view
 */
export const getMonthlyPayrollForAssignment = async ({
  assignmentId,
  year,
  month,
}) => {
  const res = await axiosInstance.get(
    `/payroll/monthly/assignment/${assignmentId}`,
    {
      params: { year, month },
    }
  );

  console.log("📊 Assignment payroll:", res.data);
  return res.data;
};

/**
 * 🔹 (OPTIONAL) Get all payrolls for a job (HR summary / register)
 * Keep commented unless needed
 */
// export const getMonthlyPayrollForJob = async ({
//   jobId,
//   year,
//   month,
// }) => {
//   const res = await axiosInstance.get(
//     `/payroll/monthly/job/${jobId}`,
//     { params: { year, month } }
//   );
//   return res.data;
// };

/**
 * 🔹 Edit monthly payroll (HR override)
 */
export const editMonthlyPayroll = async (payrollId, payload) => {
  await axiosInstance.put(
    `/payroll/monthly/${payrollId}/edit`,
    payload
  );

  console.log("✏️ Monthly payroll updated:", payrollId);
};

/**
 * 🔹 Lock monthly payroll (finalize)
 */
export const lockMonthlyPayroll = async (payrollId) => {
  await axiosInstance.put(
    `/payroll/monthly/${payrollId}/lock`
  );

  console.log("🔒 Monthly payroll locked:", payrollId);
};
