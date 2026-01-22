import React, { useEffect } from "react";
import {
  Briefcase,
  Building2,
  User,
  MapPin,
  Calendar,
  IndianRupee,
  Hash,
} from "lucide-react";

const JobBasicForm = ({ data, setData, disabled = false }) => {

  /* ===============================
     DEBUG LOGGING
  =============================== */
  useEffect(() => {
    console.log("🔄 JobBasicForm rendered");
    console.log("📦 Current data state:", data);
  }, [data]);

  /* ===============================
     HANDLE CHANGE (NESTED SAFE)
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      // 🔹 Payroll nested fields
      if (name.startsWith("payroll.")) {
        const field = name.replace("payroll.", "");

        return {
          ...prev,
          payroll: {
            ...(prev.payroll || {}),
            [field]: value === "" ? "" : Number(value),
          },
        };
      }

      // 🔹 Normal job fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /* ===============================
     REUSABLE INPUT FIELD
  =============================== */
  const FormField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    value,
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={18} />
        </div>
        <input
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">

      {/* ===============================
         HEADER
      =============================== */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg text-white">
          <Briefcase size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">
          Job Basic Details
        </h2>
      </div>

      <div className="p-8 space-y-10">

        {/* ===============================
           CORE DETAILS
        =============================== */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Job Title"
              name="jobTitle"
              placeholder="e.g. Site Supervisor"
              icon={Briefcase}
              value={data.jobTitle}
            />
            <FormField
              label="Company Name"
              name="companyName"
              placeholder="Company"
              icon={Building2}
              value={data.companyName}
            />
            <FormField
              label="Manager Name"
              name="managerName"
              placeholder="Reporting Manager"
              icon={User}
              value={data.managerName}
            />
            <FormField
              label="Base Wage (₹)"
              name="baseWageAmount"
              type="number"
              placeholder="Monthly Base Pay"
              icon={IndianRupee}
              value={data.baseWageAmount}
            />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ===============================
           LOCATION
        =============================== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Location Details
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="City" name="city" icon={MapPin} value={data.city} />
            <FormField label="State" name="state" icon={MapPin} value={data.state} />
            <FormField label="Pincode" name="pincode" icon={Hash} value={data.pincode} />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ===============================
           TIMELINE
        =============================== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Timeline
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              icon={Calendar}
              value={data.startDate}
            />
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              icon={Calendar}
              value={data.endDate}
            />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ===============================
           PAYROLL
        =============================== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <IndianRupee size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Payroll Snapshot
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Base Pay (₹)" name="payroll.basePay" type="number" icon={IndianRupee} value={data.payroll?.basePay} />
            <FormField label="Daily Pay (₹)" name="payroll.dailyPay" type="number" icon={IndianRupee} value={data.payroll?.dailyPay} />
            <FormField label="Overtime Pay (₹)" name="payroll.overtimePay" type="number" icon={IndianRupee} value={data.payroll?.overtimePay} />
            <FormField label="Bata (₹)" name="payroll.bata" type="number" icon={IndianRupee} value={data.payroll?.bata} />
            <FormField label="PF Deduction (₹)" name="payroll.pfDeduction" type="number" icon={IndianRupee} value={data.payroll?.pfDeduction} />
            <FormField label="ESI Deduction (₹)" name="payroll.esiDeduction" type="number" icon={IndianRupee} value={data.payroll?.esiDeduction} />
            <FormField label="Advance Deduction (₹)" name="payroll.advanceDeduction" type="number" icon={IndianRupee} value={data.payroll?.advanceDeduction} />
            <FormField label="Gross Pay (₹)" name="payroll.grossPay" type="number" icon={IndianRupee} value={data.payroll?.grossPay} />
            <FormField label="Total Deductions (₹)" name="payroll.totalDeductions" type="number" icon={IndianRupee} value={data.payroll?.totalDeductions} />
            <FormField label="Net Payable (₹)" name="payroll.netPayable" type="number" icon={IndianRupee} value={data.payroll?.netPayable} />
          </div>
        </section>
      </div>

      {disabled && (
        <div className="px-8 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-xs font-medium text-amber-700">
            This form is currently in read-only mode.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobBasicForm;
