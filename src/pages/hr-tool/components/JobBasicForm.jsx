import React, { useEffect } from "react";
import { 
  Briefcase, 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Hash,
  Wallet,
  MinusCircle,
  Clock
} from "lucide-react";

// ✅ Helper component outside to prevent focus loss
const FormField = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange }) => (
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
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
    </div>
  </div>
);

const JobBasicForm = ({ data, setData }) => {
  
  // 🔍 Sync payroll.basePay when baseWageAmount changes
  useEffect(() => {
    if (data.baseWageAmount !== data.payroll?.basePay) {
      setData(prev => ({
        ...prev,
        payroll: {
          ...prev.payroll,
          basePay: prev.baseWageAmount,
        },
      }));
    }
  }, [data.baseWageAmount, setData]);

  // 🛠️ Enhanced handleChange to support nested payroll fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setData((prev) => {
      // Handle nested payroll fields (e.g., name="payroll.dailyPay")
      if (name.startsWith("payroll.")) {
        const key = name.split(".")[1];
        return {
          ...prev,
          payroll: {
            ...(prev.payroll || {}),
            [key]: value,
          },
        };
      }

      // Handle root level fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg text-white">
          <Briefcase size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">Job Basic Details</h2>
      </div>

      <div className="p-8 space-y-8">
        {/* Core Info Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="Job Title" 
              name="jobTitle" 
              placeholder="e.g. Senior Site Engineer" 
              icon={Briefcase} 
              value={data.jobTitle} 
              onChange={handleChange}
            />
            <FormField 
              label="Company Name" 
              name="companyName" 
              placeholder="e.g. Acme Constructions" 
              icon={Building2} 
              value={data.companyName} 
              onChange={handleChange}
            />
            {/* <FormField 
              label="Location" 
              name="fullWorkAddress" 
              placeholder="e.g. Gorakhpur" 
              icon={Building2} 
              value={data.fullWorkAddress} 
              onChange={handleChange}
            /> */}
            <FormField 
              label="Manager Name" 
              name="managerName" 
              placeholder="Who is reporting?" 
              icon={User} 
              value={data.managerName} 
              onChange={handleChange}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Payment Frequency</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Clock size={18}/></div>
                <select
                  name="paymentFrequency"
                  value={data.paymentFrequency || "DAILY"}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                >
                  {/* <option value="DAILY">Daily</option> */}
                  <option value="MONTHLY">Monthly</option>
                  {/* <option value="HOURLY">Hourly</option> */}
                  {/* <option value="YEARLY">Yearly</option> */}
                </select>
              </div>
            </div>
            <FormField 
              label="Base Wage (₹)" 
              name="baseWageAmount" 
              type="number" 
              placeholder="Amount per shift" 
              icon={IndianRupee} 
              value={data.baseWageAmount} 
              onChange={handleChange}
            />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Payroll Snapshot Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Earnings & Allowances(Updated for all Workers)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Daily Pay" name="payroll.dailyPay" type="number" placeholder="0.00" icon={IndianRupee} value={data.payroll?.dailyPay} onChange={handleChange} />
            <FormField label="Overtime Pay" name="payroll.overtimePay" type="number" placeholder="0.00" icon={IndianRupee} value={data.payroll?.overtimePay} onChange={handleChange} />
            <FormField label="Bata / Allowance" name="payroll.bata" type="number" placeholder="0.00" icon={IndianRupee} value={data.payroll?.bata} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 mb-4 mt-8 text-slate-500">
            <MinusCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Standard Deductions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="PF Deduction" name="payroll.pfDeduction" type="number" placeholder="0.00" icon={Hash} value={data.payroll?.pfDeduction} onChange={handleChange} />
            <FormField label="ESI Deduction" name="payroll.esiDeduction" type="number" placeholder="0.00" icon={Hash} value={data.payroll?.esiDeduction} onChange={handleChange} />
            <FormField label="Advance Recovery" name="payroll.advanceDeduction" type="number" placeholder="0.00" icon={Hash} value={data.payroll?.advanceDeduction} onChange={handleChange} />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Location Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Location Details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="City" name="city" placeholder="City" icon={MapPin} value={data.city} onChange={handleChange} />
            <FormField label="State" name="state" placeholder="State" icon={MapPin} value={data.state} onChange={handleChange} />
            <FormField label="Pincode" name="pincode" placeholder="Pincode" icon={Hash} value={data.pincode} onChange={handleChange} />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Schedule Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Timeline</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Start Date" name="startDate" type="date" icon={Calendar} value={data.startDate} onChange={handleChange} />
            <FormField label="End Date" name="endDate" type="date" icon={Calendar} value={data.endDate} onChange={handleChange} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobBasicForm;