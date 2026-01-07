import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoTab from "./components/PersonalInfoTab";
import ProfessionalInfoTab from "./components/ProfessionalInfoTab";
import DocumentsVerificationTab from "./components/DocumentsVerificationTab";
import WorkHistoryTab from "./components/WorkHistoryTab";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile } from "../../features/ProfileSlice";
import { removeUser } from "../../features/UserSlice";

const WorkerProfile = () => {
  const dispatch = useDispatch();
  const backendProfile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("personal");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
useEffect(() => {
  document.querySelectorAll("path").forEach(p => {
    if (p.getAttribute("d")?.includes("714")) {
      console.error("❌ FOUND BAD SVG PATH:", p.getAttribute("d"));
    }
  });
}, []);

  /** 📌 Fetch Profile from DB on mount */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.id) return console.warn("User not loaded yet");

        const res = await getProfile(user.id);
        dispatch(setProfile(res));
      } catch (err) {
        console.error("Profile Fetch Failed:", err);
      }
    };

    loadProfile();
  }, [user, dispatch]);

  /** 📌 Update Backend + Redux when saving */
  const handleSaveToDB = async (updatedData) => {
    try {
      const updatedProfile = await updateProfile(updatedData);
      dispatch(setProfile(updatedProfile));
    } catch (err) {
      console.error("Profile Update Failed:", err);
      alert("Failed to update profile");
    }
  };

  /** 📌 Logout handlers */
  const handleLogoutClick = () => setShowLogoutConfirm(true);

const handleLogout = () => {
  dispatch(removeUser()); // clear user from redux
  localStorage.clear();    // clear any persisted data in localStorage (optional)
  window.location.href = "/login";  // Redirect to login page after logging out
};

  /** 📌 Tabs configuration */
  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "professional", label: "Professional Info" },
    { id: "documents", label: "Documents & Verification" },
    { id: "workHistory", label: "Work History" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`main-content ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        } p-4 md:p-6 max-w-full overflow-x-hidden`}
      >
        {/* Profile Header */}
        <ProfileHeader profile={backendProfile} onSave={handleSaveToDB} />

        {/* Logout Button (always visible at top right) */}
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogoutClick}
            className="justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            iconName="LogOut"
            iconPosition="left"
          >
            Logout
          </Button>
        </div>

        {/* Scrollable tabs */}
        <div className="card p-4 md:p-6">
          <div className="border-b border-border mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap text-sm transition-all ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active tab content */}
          <div className="animate-fade-in">
            {activeTab === "personal" && (
              <PersonalInfoTab
                profile={backendProfile}
                onSave={handleSaveToDB}
              />
            )}

            {activeTab === "professional" && (
              <ProfessionalInfoTab
                data={backendProfile}
                onSave={handleSaveToDB}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsVerificationTab
                documents={backendProfile}
                onSave={handleSaveToDB}
              />
            )}

            {activeTab === "workHistory" && (
              <WorkHistoryTab data={backendProfile} onSave={handleSaveToDB} />
            )}
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Icon
                    name="AlertCircle"
                    size={24}
                    className="text-yellow-600"
                  />
                </div>
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerProfile;
