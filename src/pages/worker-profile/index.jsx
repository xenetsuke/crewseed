import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoTab from "./components/PersonalInfoTab";
import ProfessionalInfoTab from "./components/ProfessionalInfoTab";
import DocumentsVerificationTab from "./components/DocumentsVerificationTab";
import WorkHistoryTab from "./components/WorkHistoryTab";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile, clearProfile } from "../../features/ProfileSlice";
import { removeUser, setUser } from "../../features/UserSlice"; // Added setUser
import { saveVerifiedPhone } from "../../Services/UserService";
import { getRecaptcha, auth } from "../../firebase/firebase";
import { linkWithPhoneNumber, signInAnonymously } from "firebase/auth";
import { notifications } from "@mantine/notifications"; // Added notifications

const WorkerProfile = () => {
  const dispatch = useDispatch();
  
  const backendProfile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("personal");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const token = useSelector((state) => state?.jwt);
  
  const [jwtUser, setJwtUser] = useState(null);
  
  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (storedToken) {
      try {
        // Note: ensure jwtDecode is imported if used
        // setJwtUser(jwtDecode(storedToken));
      } catch (err) {
        console.error("Invalid JWT", err);
      }
    }
  }, [token]);

  useEffect(() => {
    document.querySelectorAll("path").forEach((p) => {
      if (p.getAttribute("d")?.includes("714")) {
        console.error("❌ FOUND BAD SVG PATH:", p.getAttribute("d"));
      }
    });
  }, []);

  useEffect(() => {
    const bootstrapFirebase = async () => {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
        setFirebaseReady(true);
      } else {
        setFirebaseReady(true);
      }
    };
    bootstrapFirebase();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.id) return;
        const res = await getProfile(user.id);
        dispatch(setProfile(res));
      } catch (err) {
        console.error("Profile Fetch Failed:", err);
      }
    };
    loadProfile();
  }, [user?.id, dispatch]);

  const handleSaveToDB = async (updatedData) => {
    try {
      const updatedProfile = await updateProfile(updatedData);
      dispatch(setProfile(updatedProfile));
      return updatedProfile;
    } catch (err) {
      console.error("Profile Update Failed:", err);
      alert("Failed to update profile");
    }
  };

  const handleRequestPhoneOtp = async (phone) => {
    if (!firebaseReady) return alert("Firebase not ready");
    try {
      const recaptcha = getRecaptcha();
      window.confirmationResult = await linkWithPhoneNumber(
        auth.currentUser,
        "+91" + phone,
        recaptcha
      );
      setPendingPhone(phone);
      setIsOtpModalOpen(true);
      return true;
    } catch (error) {
      console.error("❌ OTP Request Failed:", error);
      alert(error.message);
      return false;
    }
  };

  const handleConfirmPhoneOtp = async () => {
    setVerifying(true);
    try {
      const result = await window.confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken(true);
      
      // 1. Save to Backend Database
      await saveVerifiedPhone(idToken);

      // 2. Update the User state in Redux immediately for the UI
      const verifiedNumber = result.user.phoneNumber;
      dispatch(setUser({ 
        ...user, 
        phoneNumber: verifiedNumber 
      }));

      // 3. Fetch the fresh profile and update Redux
      const res = await getProfile(user.id);
      dispatch(setProfile(res)); 

      // 4. Modern Pop Notification
      notifications.show({
        title: "Phone Verified! 🎉",
        message: `Success! You can now use ${verifiedNumber} to login next time.`,
        color: "teal",
        icon: <Icon name="Check" size={18} />,
        autoClose: 5000,
        radius: "md",
        style: { border: '1px solid #0ca678' }
      });

      setIsOtpModalOpen(false);
      setOtpValue("");
    } catch (e) {
      console.error("❌ OTP FAILED:", e);
      notifications.show({
        title: "Verification Failed",
        message: "Invalid code. Please try again.",
        color: "red",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleLogout = async () => {
    try {
      dispatch(removeUser());
      dispatch(clearProfile());
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      window.location.href = "/login";
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "professional", label: "Professional Info" },
    { id: "documents", label: "Documents & Verification" },
    { id: "workHistory", label: "Work History" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden text-foreground">
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 md:p-6 max-w-full overflow-x-hidden`}>
        <ProfileHeader profile={backendProfile} onSave={handleSaveToDB} />

        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogoutClick}
            className="justify-center text-red-600 border-red-200 hover:bg-red-50"
            iconName="LogOut"
            iconPosition="left"
          >
            Logout
          </Button>
        </div>

        <div className="card p-4 md:p-6 shadow-sm border border-border rounded-xl bg-white">
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

          <div className="animate-fade-in">
            {activeTab === "personal" && (
              <PersonalInfoTab
                profile={backendProfile}
                onSave={handleSaveToDB}
                onVerifyPhone={handleRequestPhoneOtp}
              />
            )}
            {activeTab === "professional" && (
              <ProfessionalInfoTab data={backendProfile} onSave={handleSaveToDB} />
            )}
            {activeTab === "documents" && (
              <DocumentsVerificationTab documents={backendProfile} onSave={handleSaveToDB} />
            )}
            {activeTab === "workHistory" && (
              <WorkHistoryTab data={backendProfile} onSave={handleSaveToDB} />
            )}
          </div>
        </div>

        {/* OTP Modal */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Verify Phone Number</h3>
                <button onClick={() => setIsOtpModalOpen(false)}>
                  <Icon name="X" size={20} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Enter code sent to <strong>+91 {pendingPhone}</strong>
              </p>
              <Input
                placeholder="· · · · · ·"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="text-center text-2xl tracking-[0.3em] font-mono mb-6"
                maxLength={6}
                autoFocus
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsOtpModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleConfirmPhoneOtp} loading={verifying}>
                  Verify
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Icon name="AlertCircle" size={24} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold">Confirm Logout</h3>
              </div>
              <p className="text-muted-foreground mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="default" onClick={handleLogout} className="flex-1 bg-red-600 text-white">
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