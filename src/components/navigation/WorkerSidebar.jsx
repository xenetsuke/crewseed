import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import Icon from "../AppIcon";

const WorkerSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get user from Redux
  const user = useSelector((state) => state.user);
  const workerProfile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt);

  const [jwtUser, setJwtUser] = useState(null);

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
      Formatting Helpers
  ========================= */
  const maskPhoneNumber = (val) => {
    if (!val) return "";
    // Check if the string contains digits and looks like a phone number
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (typeof val === "string" && phoneRegex.test(val)) {
      const clean = val.replace(/\s/g, "");
      // Replaces first two digits with stars (e.g., **91234567)
      return `**${clean.slice(2)}`;
    }
    return val;
  };

  const navigationItems = [
    { label: "Dashboard", path: "/worker-dashboard", icon: "LayoutDashboard" },
    { label: "Job List", path: "/worker-job-list", icon: "Briefcase" },
    {
      label: "My Assignments",
      path: "/worker-assignments",
      icon: "ClipboardList",
    },
    { label: "Profile", path: "/worker-profile", icon: "User" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  /* =========================
      Display Data Priority
  ========================= */
  const displayName =
    workerProfile?.fullName || user?.name || jwtUser?.name || "Worker";

  const rawSubtitle =
    workerProfile?.email || user?.phoneNumber || jwtUser?.sub || "View Profile";

  // Apply masking logic
  const displaySubtitle = maskPhoneNumber(rawSubtitle);

  return (
    <>
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
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo flex items-center gap-2">
            <img 
              src="/Crewlogo.svg" 
              alt="Company Logo" 
              className="w-8 h-8 object-contain"
            />
            {!isCollapsed && (
              <span className="sidebar-logo-text font-bold">CrewSeed</span>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation("/worker-profile")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
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
              <span className="sidebar-nav-item-text">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default WorkerSidebar;