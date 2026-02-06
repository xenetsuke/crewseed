import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { useTranslation } from "react-i18next";
import Icon from "../AppIcon";

const WorkerSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [jwtUser, setJwtUser] = useState(null);

  const pendingAssignmentsCount = 1;

  const user = useSelector((state) => state.user);
  const workerProfile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt);

const jwtToken = useSelector((state) => state?.jwt?.token);

// const jwtToken = useSelector((state) => state?.jwt?.token);

useEffect(() => {
  if (!jwtToken) return;

  try {
    const decoded = jwtDecode(jwtToken);
    setJwtUser(decoded);

    // console.log("✅ [WorkerSidebar] JWT decoded:", decoded);
  } catch (err) {
    console.error("❌ [WorkerSidebar] Invalid JWT", err);
  }
}, [jwtToken]);


  const maskPhoneNumber = (val) => {
    if (!val) return "";

    const phoneRegex =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

    if (typeof val === "string" && phoneRegex.test(val)) {
      const clean = val.replace(/\s/g, "").replace(/^\+/, "");
      return `+${clean.slice(0, -3)}***`;
    }

    return val;
  };

  const navigationItems = [
    { label: t("sidebar.dashboard"), path: "/worker-dashboard", icon: "LayoutDashboard" },
    { label: t("sidebar.jobList"), path: "/worker-job-list", icon: "Briefcase" },
    { label: t("sidebar.assignments"), path: "/worker-assignments", icon: "ClipboardList" },
    { label: t("sidebar.assignmentDetails"), path: "/assignment-details", icon: "ClipboardCheck", badge: pendingAssignmentsCount },
    { label: t("sidebar.profile"), path: "/worker-profile", icon: "User" },
  ];

  // Modified for smooth closing transition
  const handleNavigation = (path) => {
    setIsMobileOpen(false);
    // Short delay to let the sidebar closing animation start/finish smoothly before route change
    setTimeout(() => {
      navigate(path);
    }, 150); 
  };

  const displayName = workerProfile?.fullName || user?.name || jwtUser?.name || t("sidebar.worker");
  const rawSubtitle = workerProfile?.email || user?.phoneNumber || jwtUser?.sub || t("sidebar.viewProfile");
  const displaySubtitle = maskPhoneNumber(rawSubtitle);

  const shinyTextStyle = "bg-[linear-gradient(110deg,#475569,48%,#94a3b8,52%,#475569)] bg-[length:250%_100%] animate-[shine_5s_linear_infinite] bg-clip-text text-transparent";

  return (
    <>
      <style>
        {`
          @keyframes shine {
            to { background-position: 250% center; }
          }
        `}
      </style>

      {/* --- MOBILE SIDE-MIDDLE TOGGLE --- */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex items-center justify-center w-6 h-16 bg-slate-900 text-[#d1ec44] rounded-r-2xl shadow-xl border border-l-0 border-white/10 transition-transform active:scale-90"
      >
        <Icon name={isMobileOpen ? "ChevronLeft" : "ChevronRight"} size={18} />
      </button>

      {/* Updated Smooth Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden transition-all duration-500 ease-in-out ${
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-white border-r border-slate-100 shadow-xl transition-all duration-500 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="sidebar-header border-b border-slate-50/50">
          <div className="sidebar-logo flex items-center gap-2">
            <img
              src="/Crewlogo.svg"
              alt="Company Logo"
              className="w-12 h-12 object-contain"
            />
            {!isCollapsed && (
              <span className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] bg-[length:200%_auto] animate-[shine_6s_linear_infinite] bg-clip-text text-transparent opacity-95">
                CrewSeed
              </span>
            )}
          </div>
        </div>

        {/* Profile Card */}
        {!isCollapsed && (
          <div
            className="px-5 py-4 mb-2 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden"
            onClick={() => handleNavigation("/worker-profile")}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#23acf6] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#23acf6]/10 group-hover:text-[#23acf6] transition-all duration-300">
                <Icon name="User" size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-bold truncate tracking-tight ${shinyTextStyle}`}>
                  {displayName}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 truncate tracking-widest uppercase">
                  {displaySubtitle}
                </p>
              </div>

              <Icon name="ChevronRight" size={14} className="text-slate-300 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav px-3 pt-3 space-y-1">
          {navigationItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  active
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {!active && (
                   <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#23acf6] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <Icon
                  name={item.icon}
                  size={19}
                  className={`${active ? "text-[#23acf6]" : "text-slate-400 group-hover:text-[#23acf6]"} transition-colors`}
                />

                {!isCollapsed && (
                  <span className={`text-[13px] font-bold tracking-wide flex-1 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute bottom-8 right-[-12px] w-6 h-6 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-300 hover:text-[#23acf6] hover:shadow-md transition-all"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={12} />
          </button>
        )}
      </aside>
    </>
  );
};

export default WorkerSidebar;