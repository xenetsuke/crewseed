import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

/* =====================================================
   ASSIGNMENT HEADER (WORKER VIEW + PAYROLL SUMMARY)
===================================================== */

const AssignmentHeader = ({ assignment = {} }) => {
  /* ------------------------------------
     SAFE FALLBACKS
  ------------------------------------ */
  const {
    title,
    companyName,
    companyLogo,
    companyLogoAlt,
    companyRating = 0,
    reviewCount = 0,
    location,
    duration,
    startDate,

    // Worker payroll related
    dailyWage = 0,
    overtimeAmount = 0,
    bata = 50,
    deductions = 0,
  } = assignment;

  const basePay = dailyWage; // 1 day base
  const netPayable = basePay + overtimeAmount + bata - deductions;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* ------------------------------------
          TOP: ASSIGNMENT + COMPANY INFO
      ------------------------------------ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <Image
              src={companyLogo}
              alt={companyLogoAlt || "Company Logo"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-slate-500 text-sm">
                <Icon name="Building2" size={16} />
                <span className="font-semibold">{companyName}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={14} className="text-amber-500" />
                  <span className="font-semibold">{companyRating}</span>
                  <span className="text-xs">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <Icon name="Share2" size={18} />
              </button>
              <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <Icon name="Bookmark" size={18} />
              </button>
            </div>
          </div>

          {/* META INFO */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoItem
              icon="MapPin"
              label="Location"
              value={location}
            />
            <InfoItem
              icon="Clock"
              label="Duration"
              value={duration}
            />
            <InfoItem
              icon="Calendar"
              label="Start Date"
              value={startDate}
            />
            <InfoItem
              icon="IndianRupee"
              label="Daily Wage"
              value={`₹${dailyWage}`}
            />
          </div> */}
        </div>
      </div>

      {/* ------------------------------------
          PAYROLL SUMMARY (WORKER)
      ------------------------------------ */}
      {/* <div className="border-t border-slate-100 pt-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <PayrollItem
            label="Base Pay (1d)"
            value={`₹${basePay}`}
          />

          <PayrollItem
            label="Overtime"
            value={`₹${overtimeAmount}`}
            highlight="amber"
          />

          <PayrollItem
            label="Bata"
            value={`₹${bata}`}
          />

          <PayrollItem
            label="Deductions"
            value={`-₹${deductions}`}
            highlight="rose"
          />

          <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-xs font-black uppercase text-emerald-600 mb-1">
              Net Payable
            </p>
            <p className="text-2xl font-black text-emerald-600">
              ₹{netPayable}
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

/* =====================================================
   SMALL REUSABLE COMPONENTS
===================================================== */

// const InfoItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-3">
//     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
//       <Icon name={icon} size={18} />
//     </div>
//     <div>
//       <p className="text-xs text-slate-400 font-bold uppercase">
//         {label}
//       </p>
//       <p className="text-sm font-black text-slate-800">
//         {value || "--"}
//       </p>
//     </div>
//   </div>
// );

const PayrollItem = ({ label, value, highlight }) => {
  const colorMap = {
    amber: "text-amber-600",
    rose: "text-rose-600",
  };

  return (
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-black ${
          colorMap[highlight] || "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AssignmentHeader;
