import {
  IndianRupee,
  Zap,
  Scissors,
  Wallet,
  Coins,
  Stethoscope,
  PiggyBank,
  Banknote
} from "lucide-react";
import { cn } from "utils/cn";

/* 🔹 Compact Slidable Stat Card */
const Stat = ({ label, value, icon: Icon, color, bg, isHero }) => (
  <div className={cn(
    "flex-shrink-0 w-[140px] p-3 rounded-xl border transition-all duration-300",
    isHero 
      ? "bg-emerald-600 border-emerald-500 shadow-sm" 
      : "bg-white border-slate-100 shadow-sm"
  )}>
    <div className="flex items-center gap-2 mb-1.5">
      <div className={cn("p-1.5 rounded-lg shrink-0", isHero ? "bg-white/20" : bg)}>
        <Icon className={cn("w-3.5 h-3.5", isHero ? "text-white" : color)} />
      </div>
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-wider truncate",
        isHero ? "text-emerald-100" : "text-slate-400"
      )}>
        {label}
      </span>
    </div>
    <p className={cn(
      "font-black tracking-tight truncate",
      isHero ? "text-base text-white" : "text-sm text-slate-800"
    )}>
      {value}
    </p>
  </div>
);

const AssignmentStatsOverview = ({ payroll }) => {
  if (!payroll) return null;

  const format = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  return (
    <div className="w-full mb-6">
      {/* ↔️ Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar scroll-smooth">
        {/* Earnings Group */}
<Stat
  label={
    <>
      Base Pay
      <span className="block text-[10px] font-medium text-slate-400">
        (Monthly)
      </span>
    </>
  }
  value={format(payroll.basePay)}
  icon={Coins}
  color="text-slate-500"
  bg="bg-slate-50"
/>
        <Stat label="Daily" value={format(payroll.dailyPay)} icon={Banknote} color="text-blue-500" bg="bg-blue-50" />
        <Stat label="Bata" value={format(payroll.bata)} icon={Wallet} color="text-purple-500" bg="bg-purple-50" />
        <Stat label="OT Pay" value={format(payroll.overtimePay)} icon={Zap} color="text-amber-500" bg="bg-amber-50" />
        <Stat label="Gross" value={format(payroll.grossPay)} icon={IndianRupee} color="text-indigo-500" bg="bg-indigo-50" />

        {/* Deductions Group */}
        <Stat label="PF" value={format(payroll.pfDeduction)} icon={PiggyBank} color="text-orange-500" bg="bg-orange-50" />
        <Stat label="ESI" value={format(payroll.esiDeduction)} icon={Stethoscope} color="text-pink-500" bg="bg-pink-50" />
        <Stat label="Total Ded." value={format(payroll.totalDeductions)} icon={Scissors} color="text-rose-500" bg="bg-rose-50" />

        {/* Hero Stat */}
        <Stat label="Net Payable" value={format(payroll.netPayable)} icon={Wallet} isHero />
      </div>

      {/* Optional: Add custom CSS to global styles for .no-scrollbar if needed */}
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AssignmentStatsOverview;