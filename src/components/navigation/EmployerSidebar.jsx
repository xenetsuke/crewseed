import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import Icon from "../AppIcon";

const EmployerSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* =========================
      Redux State
  ========================= */
  const user = useSelector((state) => state?.user);
  const profile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt);

  /* =========================
      JWT Decoded User (Fallback)
  ========================= */
  const [jwtUser, setJwtUser] = useState(null);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setJwtUser(decoded);
      } catch (err) {
        console.error("Invalid JWT token", err);
      }
    }
  }, [token]);

  /* =========================
      Formatting Helpers
  ========================= */
  const maskPhoneNumber = (val) => {
    if (!val) return "";
    const phoneRegex =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
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
    { label: "Dashboard", path: "/employer-dashboard", icon: "LayoutDashboard" },
    { label: "Post Job", path: "/post-job-requirement/0", icon: "PlusCircle" },
    {
      label: "My Requirements",
      path: "/employer-requirements",
      icon: "ClipboardList",
    },
    { label: "Find Workers", path: "/find-workers", icon: "Users" },
    { label: "HR Tool", path: "/hr-tool", icon: "Wrench" },
    { label: "My Profile", path: "/employer-profile", icon: "UserCircle" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  /* =========================
      Prevent background scroll
  ========================= */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileOpen]);

  /* =========================
      Profile Data
  ========================= */
  const displayName =
    profile?.companyName || user?.name || jwtUser?.name || "Employer";

  const rawSubtitle =
    profile?.phoneNumber ||
    user?.phoneNumber ||
    profile?.officialEmail ||
    user?.email ||
    jwtUser?.sub ||
    "View Profile";

  const displaySubtitle = maskPhoneNumber(rawSubtitle);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="mobile-menu-button bg-gradient-to-br from-teal-300 to-sky-300 text-white shadow-lg rounded-xl"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="sidebar-overlay bg-sky-900/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "animate-slide-in" : "max-lg:hidden"
        } bg-gradient-to-b from-sky-10 to-teal-10 border-r border-sky-100 shadow-xl`}
      >
        {/* Logo Section */}
        <div className="sidebar-header border-b border-sky-200">
          <div className="sidebar-logo flex items-center gap-2">
            <img
              src="/Crewlogo.svg"
              alt="Company Logo"
              className="w-8 h-8 object-contain"
            />
            {!isCollapsed && (
              <span className="sidebar-logo-text font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                CrewSeed
              </span>
            )}
          </div>
        </div>

        {/* Employer Profile */}
        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-sky-100 cursor-pointer hover:bg-sky-50/60 transition-colors"
            onClick={() => handleNavigation("/employer-profile")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white shadow">
                <Icon name="Building2" size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {displaySubtitle}
                </p>
              </div>

              <Icon name="ChevronRight" size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`sidebar-nav-item transition-all ${
                  active
                    ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md"
                    : "hover:bg-sky-100"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={active ? "#fff" : undefined}
                />
                <span className="sidebar-nav-item-text">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute bottom-4 right-4 p-2 rounded-lg bg-white border border-sky-200 shadow hover:bg-sky-50 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={20}
            />
          </button>
        )}
      </aside>
    </>
  );
};

export default EmployerSidebar;
