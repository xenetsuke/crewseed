import React from "react";
import {
  IndianRupee,
  AlertCircle,
  ArrowUpRight,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "utils/cn";

/**
 * INDUSTRY STATS OVERVIEW
 * Safe + Production-ready
 */

const StatsOverview = ({ stats = {} }) => {
  // ✅ SAFE FALLBACKS (CRITICAL)
  const {
    totalGross = 0,
    totalOTHours = 0,
    pendingApprovals = 0,
    complianceEnabled = true,
  } = stats;

  const statConfig = [
    {
      label: "Gross Payroll",
      value: `₹${Number(totalGross).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "OT Hours (Month)",
      value: `${totalOTHours}h`,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Pending Verifications",
      value: pendingApprovals,
      icon: AlertCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "PF / ESI Compliance",
      value: complianceEnabled ? "Enabled" : "Disabled",
      icon: ShieldCheck,
      color: complianceEnabled
        ? "text-emerald-600"
        : "text-slate-400",
      bg: complianceEnabled
        ? "bg-emerald-50"
        : "bg-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {statConfig.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>

            {/* KPI Indicator */}
            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Stable
            </span>
          </div>

          <p className="text-2xl font-black text-slate-900">
            {stat.value}
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
 