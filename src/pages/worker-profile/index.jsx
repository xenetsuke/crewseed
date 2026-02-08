import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import WorkerSidebar from "../../components/navigation/WorkerSidebar";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoTab from "./components/PersonalInfoTab";
import ProfessionalInfoTab from "./components/ProfessionalInfoTab";
import DocumentsVerificationTab from "./components/DocumentsVerificationTab";
import WorkHistoryTab from "./components/WorkHistoryTab";
import { logout } from "../../Services/AuthService";
import { removeJwt } from "../../features/JwtSlice";
import { resetAuth } from "../../features/AuthSlice";
import { persistor } from "../../Store";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile, clearProfile } from "../../features/ProfileSlice";
import { removeUser, setUser } from "../../features/UserSlice";
import { saveVerifiedPhone } from "../../Services/UserService";

import { getRecaptcha, auth } from "../../firebase/firebase";
import { linkWithPhoneNumber, signInAnonymously } from "firebase/auth";

import toast, { Toaster } from "react-hot-toast";

const WorkerProfile = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

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

  /* ---------------- LANGUAGE TOGGLE ---------------- */
  const handleLanguageChange = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("hi");
      toast.success("ऐप हिंदी में बदल गया 🇮🇳");
    } else if (i18n.language === "hi") {
      i18n.changeLanguage("hinglish");
      toast.success("App Hinglish mein aa gaya 😄");
    } else {
      i18n.changeLanguage("en");
      toast.success("App switched to English 🇬🇧");
    }
  };

  /* ---------------- FIREBASE INIT ---------------- */
  useEffect(() => {
    const bootstrapFirebase = async () => {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      setFirebaseReady(true);
    };
    bootstrapFirebase();
  }, []);

  /* ---------------- LOAD PROFILE ---------------- */
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

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSaveToDB = async (updatedData) => {
    try {
      const updatedProfile = await updateProfile(updatedData);
      dispatch(setProfile(updatedProfile));
      toast.success(t("toast.profileUpdated"));
      return updatedProfile;
    } catch {
      toast.error(t("toast.profileUpdateFailed"));
      throw new Error();
    }
  };

  /* ---------------- PHONE OTP ---------------- */
  const handleRequestPhoneOtp = async (phone) => {
    if (!firebaseReady) {
      toast.error(t("otp.securityNotReady"));
      return false;
    }
    try {
      const recaptcha = getRecaptcha();
      window.confirmationResult = await linkWithPhoneNumber(
        auth.currentUser,
        "+91" + phone,
        recaptcha,
      );
      setPendingPhone(phone);
      setIsOtpModalOpen(true);
      toast.success(t("otp.sent", { phone }));
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

      await saveVerifiedPhone(idToken);

      const verifiedNumber = result.user.phoneNumber;
      dispatch(setUser({ ...user, phoneNumber: verifiedNumber }));

      await handleSaveToDB({
        ...backendProfile,
        primaryPhone: verifiedNumber.replace("+91", ""),
      });

      toast.success(t("otp.verified"));
      setIsOtpModalOpen(false);
      setOtpValue("");
    } catch {
      toast.error(t("otp.invalid"));
    } finally {
      setVerifying(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
const handleLogout = async () => {
  try {
    // 🚫 hard block all future refresh attempts
    sessionStorage.setItem("crewseed_logged_out", "true");
    sessionStorage.removeItem("auth_provider");

    await logout(); // backend + firebase
  } catch (err) {
    console.warn("Logout error, continuing anyway");
  } finally {
    dispatch(removeUser());
    dispatch(clearProfile());
    dispatch(removeJwt());
    dispatch(resetAuth()); // 🔥 IMPORTANT

    await persistor.purge();
    localStorage.clear();

    // 🔁 kill history + memory cache
    window.location.replace("/login");
  }
};


  /* ---------------- TABS ---------------- */
  const tabs = [
    { id: "personal", label: t("profile.tabs.personal") },
    { id: "professional", label: t("profile.tabs.professional") },
    { id: "documents", label: t("profile.tabs.documents") },
    { id: "workHistory", label: t("profile.tabs.workHistory") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Toaster position="top-right" />

      <WorkerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} p-4 md:p-6`}
      >
        <ProfileHeader profile={backendProfile} onSave={handleSaveToDB} />

        {/* ACTION BAR */}
        <div className="flex justify-end gap-3 mb-4">
          <Button
            variant="outline"
            onClick={handleLanguageChange}
            iconName="Languages"
            className="flex items-center gap-2 px-4 py-2 font-medium rounded-md
             hover:bg-primary/10 hover:text-primary transition"
          >
            {i18n.language === "en"
              ? "Switch to हिंदी"
              : i18n.language === "hi"
                ? "Switch to Hinglish"
                : "Switch to English"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowLogoutConfirm(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
            iconName="LogOut"
          >
            {t("logout.button")}
          </Button>
        </div>

        {/* CONTENT */}
        <div className="card p-4 md:p-6 border rounded-xl bg-white">
          <div className="border-b mb-6 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "personal" && (
            <PersonalInfoTab
              profile={backendProfile}
              onSave={handleSaveToDB}
              onVerifyPhone={handleRequestPhoneOtp}
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
        </div>{/* PHONE OTP MODAL */}
{isOtpModalOpen && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
      <h3 className="text-lg font-bold mb-2">
        {t("otp.verifyTitle", "Verify Phone")}
      </h3>

      <p className="text-sm text-muted-foreground mb-4">
        Enter OTP sent to +91 {pendingPhone}
      </p>

      <Input
        value={otpValue}
        onChange={(e) => setOtpValue(e.target.value)}
        maxLength={6}
        autoFocus
        className="text-center text-xl tracking-widest mb-4"
      />

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setIsOtpModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirmPhoneOtp}
          loading={verifying}
        >
          Verify
        </Button>
      </div>
    </div>
  </div>
)}


        {/* LOGOUT CONFIRM */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">
                {t("logout.confirmTitle")}
              </h3>
              <p className="mb-6">{t("logout.confirmMessage")}</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  className="bg-red-600 text-white"
                  onClick={handleLogout}
                >
                  {t("logout.button")}
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
