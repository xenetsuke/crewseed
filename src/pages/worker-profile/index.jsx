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
import { removeUser, setUser } from "../../features/UserSlice";
import { saveVerifiedPhone } from "../../Services/UserService";
import { getRecaptcha, auth } from "../../firebase/firebase";
import { linkWithPhoneNumber, signInAnonymously } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast"; // 🔹 Switched to toast

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

  useEffect(() => {
    const bootstrapFirebase = async () => {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      setFirebaseReady(true);
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
      toast.success("Profile updated successfully"); // 🔹 Added toast
      return updatedProfile;
    } catch (err) {
      toast.error("Failed to update profile");
      throw err;
    }
  };

  const handleRequestPhoneOtp = async (phone) => {
    if (!firebaseReady) {
      toast.error("Security module not ready. Please refresh.");
      return false;
    }
    try {
      const recaptcha = getRecaptcha();
      window.confirmationResult = await linkWithPhoneNumber(
        auth.currentUser,
        "+91" + phone,
        recaptcha
      );
      setPendingPhone(phone);
      setIsOtpModalOpen(true);
      toast.success("OTP sent to +91 " + phone);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const handleConfirmPhoneOtp = async () => {
    setVerifying(true);
    toast.dismiss();
    try {
      const result = await window.confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken(true);
      
      // 1. Save to Backend
      await saveVerifiedPhone(idToken);

      // 2. Update Redux User
      const verifiedNumber = result.user.phoneNumber;
      dispatch(setUser({ ...user, phoneNumber: verifiedNumber }));

      // 3. AUTO-TRIGGER PROFILE UPDATE
      // This merges the new phone number into the existing profile data and saves
      const updatedProfilePayload = {
        ...backendProfile,
        primaryPhone: verifiedNumber.replace("+91", "") 
      };
      await handleSaveToDB(updatedProfilePayload);

      toast.success("Phone Verified & Profile Updated! 🎉");
      setIsOtpModalOpen(false);
      setOtpValue("");
    } catch (e) {
      toast.error("Invalid OTP code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    dispatch(removeUser());
    dispatch(clearProfile());
    localStorage.clear();
    window.location.replace("/login");
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "professional", label: "Professional Info" },
    { id: "documents", label: "Documents & Verification" },
    { id: "workHistory", label: "Work History" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden text-foreground">
      <Toaster position="top-right" /> {/* 🔹 Added Toaster */}
      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 md:p-6 max-w-full overflow-x-hidden`}>
        <ProfileHeader profile={backendProfile} onSave={handleSaveToDB} />

        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setShowLogoutConfirm(true)} className="text-red-600 border-red-200 hover:bg-red-50" iconName="LogOut" iconPosition="left">
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
                  className={`tab-button px-4 py-2 border-b-2 whitespace-nowrap text-sm transition-all ${
                    activeTab === tab.id ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground"
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
            {activeTab === "professional" && <ProfessionalInfoTab data={backendProfile} onSave={handleSaveToDB} />}
            {activeTab === "documents" && <DocumentsVerificationTab documents={backendProfile} onSave={handleSaveToDB} />}
            {activeTab === "workHistory" && <WorkHistoryTab data={backendProfile} onSave={handleSaveToDB} />}
          </div>
        </div>

        {isOtpModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold mb-2">Verify Phone Number</h3>
              <p className="text-sm text-muted-foreground mb-6">Enter code sent to <strong>+91 {pendingPhone}</strong></p>
              <Input placeholder="· · · · · ·" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="text-center text-2xl tracking-[0.3em] font-mono mb-6" maxLength={6} autoFocus />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsOtpModalOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleConfirmPhoneOtp} loading={verifying}>Verify</Button>
              </div>
            </div>
          </div>
        )}

        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
              <p className="text-muted-foreground mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1">Cancel</Button>
                <Button variant="default" onClick={handleLogout} className="flex-1 bg-red-600 text-white">Logout</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerProfile;