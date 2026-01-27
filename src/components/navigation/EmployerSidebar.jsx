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
  const [jwtUser, setJwtUser] = useState(null);

  /* =========================
      Redux State
  ========================= */
  const user = useSelector((state) => state?.user);
  const profile = useSelector((state) => state?.profile);
  const token = useSelector((state) => state?.jwt);

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
    { label: "Dashboard", path: "/employer-dashboard", icon: "LayoutDashboard" },
    { label: "Post Job", path: "/post-job-requirement/0", icon: "PlusCircle" },
    { label: "My Requirements", path: "/employer-requirements", icon: "ClipboardList" },
    { label: "Find Workers", path: "/find-workers", icon: "Users" },
    { label: "HR Tool", path: "/hr-tool", icon: "Wrench" },
    { label: "My Profile", path: "/employer-profile", icon: "UserCircle" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileOpen]);

  const displayName = profile?.companyName || user?.name || jwtUser?.name || "Employer";
  const rawSubtitle = profile?.phoneNumber || user?.phoneNumber || profile?.officialEmail || user?.email || jwtUser?.sub || "View Profile";
  const displaySubtitle = maskPhoneNumber(rawSubtitle);

  // Subtle Metallic Shiny Style
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

      {/* Mobile Menu Button */}
         {/* --- MOBILE SIDE-MIDDLE TOGGLE --- */}
<button
  onClick={() => setIsMobileOpen(!isMobileOpen)}
  className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex items-center justify-center w-6 h-16 bg-slate-900 text-[#d1ec44] rounded-r-2xl shadow-xl border border-l-0 border-white/10 transition-transform active:scale-90"
>
  <Icon name={isMobileOpen ? "ChevronLeft" : "ChevronRight"} size={18} />
</button>
      {isMobileOpen && (
        <div
          className="sidebar-overlay bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

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

        {/* Employer Profile */}
        {!isCollapsed && (
          <div
            className="px-5 py-4 mb-2 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden"
            onClick={() => handleNavigation("/employer-profile")}
          >
            {/* Subtle Hover Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d1ec44] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-gradient-to-tr from-[#38b6ff]/20 to-[#d1ec44]/20 group-hover:text-slate-600 transition-all duration-300 shadow-sm">
                <Icon name="Building2" size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-bold truncate tracking-tight ${shinyTextStyle}`}>
                  {displayName}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 truncate tracking-widest uppercase opacity-80 group-hover:text-slate-500 transition-colors">
                  {displaySubtitle}
                </p>
              </div>

              <Icon name="ChevronRight" size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
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
                {/* Subtle Sidebar Accent for hover */}
                {!active && (
                   <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#d1ec44] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <Icon
                  name={item.icon}
                  size={19}
                  className={`${active ? "text-[#d1ec44]" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}
                />
                {!isCollapsed && (
                  <span className={`text-[13px] font-bold tracking-wide flex-1 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`}>
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
            className="hidden lg:flex absolute bottom-8 right-[-12px] w-6 h-6 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-300 hover:text-slate-600 hover:shadow-md transition-all"
          >
            <Icon
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={12}
            />
          </button>
        )}
      </aside>
    </>
  );
};

export default EmployerSidebar;