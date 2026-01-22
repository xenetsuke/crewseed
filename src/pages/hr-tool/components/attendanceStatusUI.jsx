// src/pages/hr-tool/constants/attendanceStatusUI.js
import { CheckCircle2, XCircle } from "lucide-react";

export const STATUS_UI = {
  NOT_STARTED: {
    stripe: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    label: "No Photo",
  },
  CHECKED_IN: {
    stripe: "bg-blue-400",
    badge: "bg-blue-100 text-blue-700",
    label: "Checked In",
  },
  CHECKED_OUT: {
    stripe: "bg-indigo-400",
    badge: "bg-indigo-100 text-indigo-700",
    label: "Checked Out",
  },
  PENDING_VERIFICATION: {
    stripe: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    label: "Pending",
  },
  APPROVED: {
    stripe: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Present",
    icon: CheckCircle2,
  },
  REJECTED: {
    stripe: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700",
    label: "Rejected",
    icon: XCircle,
  },
  AUTO_MARKED_ABSENT: {
    stripe: "bg-rose-600",
    badge: "bg-rose-100 text-rose-700",
    label: "Absent",
    icon: XCircle,
  },
  HALF_DAY: {
    stripe: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-700",
    label: "Half Day",
  },
  EMPTY: {
    stripe: "bg-slate-50",
    badge: "bg-slate-100 text-slate-400",
    label: "No Record",
  },
  FUTURE: {
    stripe: "bg-white",
    badge: "bg-white text-slate-200",
    label: "Upcoming",
  },
};
