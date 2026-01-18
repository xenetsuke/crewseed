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

  // 🔔 Pending attendance / assignment actions (later from API)
  const pendingAssignmentsCount = 1;

  const user = useSelector((state) => state.user);
  const workerProfile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt);

  /* =========================
      Decode JWT
  ========================= */
  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (storedToken) {
      try {
        setJwtUser(jwtDecode(storedToken));
      } catch (err) {
        console.error("Invalid JWT", err);
      }
    }
  }, [token]);

  /* =========================
      Helpers
  ========================= */
  const maskPhoneNumber = (val) => {
    if (!val) return "";
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (typeof val === "string" && phoneRegex.test(val)) {
      const clean = val.replace(/\s/g, "");
      return `**${clean.slice(2)}`;
    }
    return val;
  };

  /* =========================
      Navigation Items
  ========================= */
  const navigationItems = [
    {
      label: t("sidebar.dashboard"),
      path: "/worker-dashboard",
      icon: "LayoutDashboard",
    },
    {
      label: t("sidebar.jobList"),
      path: "/worker-job-list",
      icon: "Briefcase",
    },
    {
      label: t("sidebar.assignments"),
      path: "/worker-assignments",
      icon: "ClipboardList",
    },

    // ✅ NEW — Assignment Details
    {
      label: t("sidebar.assignmentDetails"),
      path: "/assignment-details",
      icon: "ClipboardCheck",
      badge: pendingAssignmentsCount,
    },

    {
      label: t("sidebar.profile"),
      path: "/worker-profile",
      icon: "User",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  /* =========================
      Display Info
  ========================= */
  const displayName =
    workerProfile?.fullName ||
    user?.name ||
    jwtUser?.name ||
    t("sidebar.worker");

  const rawSubtitle =
    workerProfile?.email ||
    user?.phoneNumber ||
    jwtUser?.sub ||
    t("sidebar.viewProfile");

  const displaySubtitle = maskPhoneNumber(rawSubtitle);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="mobile-menu-button"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={24} />
      </button>

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "animate-slide-in" : "max-lg:hidden"
        }`}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo flex items-center gap-2">
            <img
              src="/Crewlogo.svg"
              alt="Company Logo"
              className="w-8 h-8 object-contain"
            />
            {!isCollapsed && (
              <span className="sidebar-logo-text font-bold">
                CrewSeed
              </span>
            )}
          </div>
        </div>

        {/* Profile Card */}
        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation("/worker-profile")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {displaySubtitle}
                </p>
              </div>
              <Icon name="ChevronRight" size={16} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`sidebar-nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="sidebar-nav-item-text">
                {item.label}
              </span>

              {/* 🔔 Badge */}
              {!isCollapsed && item.badge > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default WorkerSidebar;
