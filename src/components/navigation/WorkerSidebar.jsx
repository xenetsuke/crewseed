import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwtDecode from "jwt-decode"; // ✅ default import
 // ✅ same JWT lib as Header
import Icon from '../AppIcon';

const WorkerSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* =========================
     Redux State
     - worker profile may load later
     - token already stored globally
  ========================= */
  const workerProfile = useSelector((state) => state?.profile); // adjust if you use worker slice
  const token = useSelector((state) => state?.jwt);

  /* =========================
     JWT Decoded User (fallback)
     WHY?
     - On refresh Redux resets
     - JWT still contains user info
  ========================= */
  const [jwtUser, setJwtUser] = useState(null);

  useEffect(() => {
    if (token && localStorage.getItem("token")) {
      try {
        const decoded = jwtDecode(localStorage.getItem("token"));
        setJwtUser(decoded);
      } catch (err) {
        console.error("Invalid JWT token", err);
      }
    }
  }, [token]);

  /* =========================
     Sidebar Navigation
  ========================= */
  const navigationItems = [
    { label: 'Dashboard', path: '/worker-dashboard', icon: 'LayoutDashboard' },
    { label: 'Job List', path: '/worker-job-list', icon: 'Briefcase' },
    { label: 'My Assignments', path: '/worker-assignments', icon: 'ClipboardList' },
    { label: 'Profile', path: '/worker-profile', icon: 'User' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  /* =========================
     Lock body scroll on mobile
  ========================= */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isMobileOpen]);

  /* =========================
     Display Data Priority
     1️⃣ Worker profile from API
     2️⃣ JWT decoded data
  ========================= */
  const displayName =
    workerProfile?.fullName ||
    jwtUser?.name ||
    "Worker";

  const displayEmail =
    workerProfile?.email ||
    jwtUser?.sub || // email stored in JWT subject
    "View Profile";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="mobile-menu-button"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="sidebar-overlay animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'animate-slide-in' : 'max-lg:hidden'
        }`}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="Hammer" size={24} color="var(--color-primary)" />
            <span className="sidebar-logo-text">CrewSeed</span>
          </div>
        </div>

        {/* =========================
           Worker Info Section
        ========================= */}
        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation('/worker-profile')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={20} color="var(--color-primary)" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {displayEmail}
                </p>
              </div>

              <Icon name="ChevronRight" size={16} />
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
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="sidebar-nav-item-text">{item.label}</span>
              {item.badge && <span className="sidebar-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute bottom-4 right-4 p-2 rounded-lg hover:bg-muted"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              size={20}
            />
          </button>
        )}
      </aside>
    </>
  );
};

export default WorkerSidebar;
