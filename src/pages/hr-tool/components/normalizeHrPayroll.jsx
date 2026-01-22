export const normalizeHrPayroll = (attendance = []) => {
  let basePay = 0;          // fixed monthly
  let dailyEarnedPay = 0;  // changes daily
  let overtimePay = 0;
  let pf = 0;
  let esi = 0;
  let advance = 0;

  attendance.forEach((a) => {
    const p = a.payroll;
    if (!p) return;

    basePay = p.basePay || basePay;

    if (a.status === "APPROVED" || a.status === "VERIFIED") {
      dailyEarnedPay += p.dailyPay ?? p.basePay ?? 0;
    }

    overtimePay += p.overtimePay ?? 0;
    pf += p.pfDeduction ?? 0;
    esi += p.esiDeduction ?? 0;
    advance += p.advanceDeduction ?? 0;
  });

  const totalDeductions = pf + esi + advance;
  const grossPay = dailyEarnedPay + overtimePay;
  const netPayable = grossPay - totalDeductions;

  return {
    // 🔒 FIXED (monthly contract value)
    basePay,

    // 🔄 DYNAMIC (attendance driven)
    dailyEarnedPay,
    overtimePay,

    // ➖ DEDUCTIONS
    totalDeductions,

    // 📊 TOTALS
    grossPay,
    netPayable,

    source: "HR_SNAPSHOT",
  };
};
