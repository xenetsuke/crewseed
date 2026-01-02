import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from "jwt-decode"; // ✅ default import
 // ✅ SAME as Header
import Icon from '../AppIcon';

const EmployerSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* =========================
     Redux State
  ========================= */
  // ✅ Accessing the profile state from the profile slice (matches your reference)
  const profile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt); // ✅ same pattern as Header

  /* =========================
     JWT Decoded User (fallback)
     WHY?
     - On refresh, Redux may be empty
     - JWT is still in localStorage
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
     Navigation Items
  ========================= */
  const navigationItems = [
    { label: 'Dashboard', path: '/employer-dashboard', icon: 'LayoutDashboard' },
    { label: 'Post Job', path: '/post-job-requirement/0', icon: 'PlusCircle' },
    { label: 'My Requirements', path: '/employer-requirements', icon: 'ClipboardList', badge: 5 },
    { label: 'Find Workers', path: '/find-workers', icon: 'Users' },
    { label: 'My Profile', path: '/employer-profile', icon: 'UserCircle' },
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
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isMobileOpen]);

  /* =========================
     Profile Data Source Priority
     1️⃣ Redux Profile (companyName)
     2️⃣ JWT decoded data
  ========================= */
  // ✅ UPDATED: prioritizing profile.companyName
  const displayName =
    profile?.companyName ||
    jwtUser?.name ||
    "Employer";

  const displayEmail =
    profile?.officialEmail ||
    profile?.email ||
    jwtUser?.sub || // email comes from JWT `sub`
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
            <Icon name="Building2" size={24} color="var(--color-primary)" />
            <span className="sidebar-logo-text">CrewSeed</span>
          </div>
        </div>

        {/* =========================
           Employer Profile Section
        ========================= */}
        {!isCollapsed && (
          <div
            className="px-4 py-3 mb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation('/employer-profile')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Building2" size={20} color="var(--color-primary)" />
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
              {/* {item.badge && <span className="sidebar-nav-badge">{item.badge}</span>} */}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute bottom-4 right-4 p-2 rounded-lg hover:bg-muted"
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

export default EmployerSidebar;