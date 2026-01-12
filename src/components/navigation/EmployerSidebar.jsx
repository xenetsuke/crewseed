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
  // ✅ Access the persistent user slice (contains the phone number we injected)
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
      Navigation Items
  ========================= */
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/employer-dashboard",
      icon: "LayoutDashboard",
    },
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
      Profile Data Source Priority
      1️⃣ Redux Profile (Company Data)
      2️⃣ Redux User State (Persistent Login Data)
      3️⃣ JWT Decoded Data (Fallback)
  ========================= */
  const displayName =
    profile?.companyName || user?.name || jwtUser?.name || "Employer";

  // ✅ Prioritize Phone Number from Redux User state or Profile
  const displaySubtitle =
    profile?.phoneNumber ||
    user?.phoneNumber ||
    profile?.officialEmail ||
    user?.email ||
    jwtUser?.sub ||
    "View Profile";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="mobile-menu-button"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="sidebar-overlay animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "animate-slide-in" : "max-lg:hidden"
        }`}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="Building2" size={24} color="var(--color-primary)" />
            <span className="sidebar-logo-text">CrewSeed</span>
          </div>
        </div>

        {/* =========================
            Employer Profile Section
        ========================= */}
        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation("/employer-profile")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Building2" size={20} color="var(--color-primary)" />
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

        {/* =========================
            Navigation
        ========================= */}
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

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute bottom-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
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
