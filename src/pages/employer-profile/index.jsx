import React, { useEffect, useState } from "react";
import {
  Building2,
  User,
  Edit2,
  Mail,
  Phone,
  CreditCard,
  LogOut,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from "lucide-react";

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Icon from "../../components/AppIcon"; 

import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile, clearProfile } from "../../features/ProfileSlice";
import { removeUser, setUser } from "../../features/UserSlice"; 
import { removeJwt } from "../../features/JwtSlice";
import { persistor } from "../../Store";
import { notifications } from "@mantine/notifications";
import { saveVerifiedPhone } from "../../Services/UserService";
import { getRecaptcha, auth } from "../../firebase/firebase";
import { linkWithPhoneNumber, signInAnonymously } from "firebase/auth";

const EmployerProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user || {});
  const profile = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("business"); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  const [userName, setUserName] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    gstNumber: "",
    industryType: "",
    contactPersonName: "",
    officialEmail: "",
    phone: "",
    website: "",
    panNumber: "",
  });

  const formatToTenDigits = (phone) => {
    if (!phone) return "";
    const clean = phone.toString().replace(/\D/g, "");
    if (clean.length === 12 && clean.startsWith("91")) return clean.slice(2);
    return clean.length > 10 ? clean.slice(-10) : clean;
  };

  const hasExistingPhone = !!user?.phoneNumber;
  const isPhoneChanged = formatToTenDigits(companyInfo.phone) !== formatToTenDigits(user?.phoneNumber);

  const industryOptions = [
    { value: "it_services", label: "IT & Software Services" },
    { value: "manufacturing", label: "Manufacturing (MSME/Heavy)" },
    { value: "logistics", label: "Logistics & Supply Chain" },
    { value: "construction", label: "Real Estate & Construction" },
    { value: "healthcare", label: "Healthcare & Pharma" },
    { value: "hospitality", label: "Hospitality & Tourism" },
    { value: "retail", label: "Retail & E-commerce" },
    { value: "bfsi", label: "Banking & Finance (BFSI)" },
    { value: "textiles", label: "Textiles & Garments" },
    { value: "agriculture", label: "Agro-based Industries" },
  ];

  // Bootstrap Firebase for reCAPTCHA
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
        console.error("❌ Failed to load employer profile:", err);
      }
    };
    loadProfile();
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (profile) {
      setCompanyInfo({
        companyName: profile.companyName || "",
        gstNumber: profile.gstNumber || "",
        industryType: profile.industryType || "",
        contactPersonName: profile.contactPersonName || "",
        officialEmail: profile.officialEmail || "",
        phone: formatToTenDigits(user.phoneNumber || user.primaryPhone || ""),
        website: profile.Companywebsite || "",
        panNumber: profile.panNumber || "",
      });
      setUserName(user.name || "");
    }
  }, [profile, user.name, user.phoneNumber]);

  /** 📌 Phone Verification Handlers */
  const handleUpdatePhone = async () => {
    if (companyInfo.phone.length !== 10) {
      return notifications.show({ 
        message: "Please enter a valid 10-digit number", 
        color: "red",
        styles: { root: { width: 'fit-content', minWidth: '280px', maxWidth: '90vw' } }
      });
    }
    if (!firebaseReady) return alert("Firebase not ready");

    setLoading(true);
    try {
      const recaptcha = getRecaptcha();
      window.confirmationResult = await linkWithPhoneNumber(
        auth.currentUser,
        "+91" + companyInfo.phone,
        recaptcha
      );
      setIsOtpModalOpen(true);
      notifications.show({
        title: "OTP Sent",
        message: `Verification code sent to +91 ${companyInfo.phone}`,
        color: "blue",
        styles: { root: { width: 'fit-content', minWidth: '280px', maxWidth: '90vw' } }
      });
    } catch (error) {
      console.error("❌ OTP Request Failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPhoneOtp = async () => {
    setVerifying(true);
    try {
      const result = await window.confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken(true);
      
      // 1. Save to Backend
      await saveVerifiedPhone(idToken);

      // 2. Update Redux User Instantly for UI state sync
      const verifiedNumber = result.user.phoneNumber;
      dispatch(setUser({ 
        ...user, 
        phoneNumber: verifiedNumber 
      }));

      // 3. Refresh profile data
      const res = await getProfile(user.id);
      dispatch(setProfile(res));

      // 4. Modern Pop Notification with Login Info
      notifications.show({ 
        title: "Phone Verified! 🎉", 
        message: `Verification successful. You can now use ${verifiedNumber} to login to your account.`, 
        color: "teal",
        icon: <CheckCircle className="w-5 h-5" />,
        autoClose: 8000,
        radius: "md",
        style: { border: '1px solid #0ca678' },
        styles: { 
          root: { width: 'fit-content', minWidth: '320px', maxWidth: '90vw' },
          title: { fontWeight: 700 },
          description: { fontSize: '13px', lineHeight: '1.4' } 
        }
      });

      setIsEditingCompany(false); // Close edit mode to show the 'Verified' badge
      setIsOtpModalOpen(false);
      setOtpValue("");
    } catch (e) {
      notifications.show({
        title: "Verification Failed",
        message: "Invalid verification code. Please try again.",
        color: "red",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveCompanyInfo = async () => {
    if (isPhoneChanged) return; 
    try {
      const payload = {
        ...profile,
        userId: user.id,
        companyName: companyInfo.companyName,
        gstNumber: companyInfo.gstNumber?.toUpperCase(),
        industryType: companyInfo.industryType,
        contactPersonName: companyInfo.contactPersonName,
        officialEmail: companyInfo.officialEmail,
        primaryPhone: companyInfo.phone,
        Companywebsite: companyInfo.website,
        panNumber: companyInfo.panNumber?.toUpperCase(),
      };

      const updated = await updateProfile(payload);
      dispatch(setProfile(updated));
      setIsEditingCompany(false);
      notifications.show({ 
        title: "Profile Updated", 
        message: "Company details saved successfully.", 
        color: "green",
        styles: { root: { width: 'fit-content', minWidth: '280px', maxWidth: '90vw' } }
      });
    } catch (err) {
      console.error("❌ Failed to update employer profile:", err);
      alert("Failed to save company information");
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(removeUser());
      dispatch(clearProfile());
      dispatch(removeJwt());
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/login";
    }
  };

  const handleCompanyLogoUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        const updatedProfile = { ...profile, picture: base64Image };
        const saved = await updateProfile(updatedProfile);
        dispatch(setProfile(saved));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Failed to upload company logo");
    }
  };

  const tabs = [
    { id: "business", label: "Business Details" },
    { id: "personal", label: "Personal Information" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`main-content ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        } p-4 md:p-6 transition-all duration-300`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile & Settings</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Company Header Card */}
          <div className="bg-white rounded-lg border p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow">
                  <img
                    src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : "/Avatar.png"}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 md:w-9 md:h-9 bg-primary rounded-full cursor-pointer flex items-center justify-center shadow">
                  <Edit2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} />
                </label>
              </div>

              <div className="flex-1 w-full">
                <h1 className="text-xl md:text-2xl font-bold">{profile?.companyName || "Company Name"}</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {profile?.industryType || "Industry"} · {profile?.city || "Location"}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  {profile?.gstNumber && (
                    <span className="text-[10px] md:text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                      GST: {profile.gstNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-border mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 border-b-2 whitespace-nowrap text-sm transition-all ${
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
              <div className="bg-white rounded-lg border p-4 md:p-6 mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Personal Information</h2>
                <div className="w-full md:max-w-md">
                  <Input
                    label="Account Holder Name"
                    value={userName}
                    disabled={!isEditingUser}
                    onChange={(e) => setUserName(e.target.value)}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                  />
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="bg-white rounded-lg border p-4 md:p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">Account Details</h2>
                  <Button
                    variant={isEditingCompany ? "default" : "outline"}
                    onClick={() => (isEditingCompany ? handleSaveCompanyInfo() : setIsEditingCompany(true))}
                    className="w-full sm:w-auto"
                    disabled={isEditingCompany && isPhoneChanged}
                  >
                    {isEditingCompany ? "Save Changes" : "Edit Details"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Input
                    label="Company Name"
                    value={companyInfo.companyName}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                  />
                  <Input
                    label="GSTIN"
                    placeholder="22AAAAA0000A1Z5"
                    value={companyInfo.gstNumber}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, gstNumber: e.target.value })}
                  />
                  <Input
                    label="Company PAN"
                    placeholder="ABCDE1234F"
                    value={companyInfo.panNumber}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, panNumber: e.target.value })}
                    icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                  />
                  <Select
                    label="Industry Type"
                    options={industryOptions}
                    value={companyInfo.industryType}
                    disabled={!isEditingCompany}
                    onChange={(value) => setCompanyInfo({ ...companyInfo, industryType: value })}
                  />
                  <Input
                    label="Primary Contact Person"
                    value={companyInfo.contactPersonName}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, contactPersonName: e.target.value })}
                  />
                  <Input
                    label="Official Email Address"
                    value={companyInfo.officialEmail}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, officialEmail: e.target.value })}
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                  />
                  
                  {/* Phone Section with OTP Integration */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Mobile Number</label>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 relative">
                        <div className="relative flex items-center">
                          <div className="absolute left-0 pl-3 flex items-center pointer-events-none h-full border-r border-border pr-2 bg-gray-50 rounded-l-md">
                            <span className="text-gray-500 font-bold text-sm">+91</span>
                          </div>
                          <input
                            type="tel"
                            disabled={!isEditingCompany}
                            value={companyInfo.phone}
                            onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value.replace(/\D/g, "").slice(-10) })}
                            placeholder="Enter 10 digits"
                            className="w-full pl-16 pr-4 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-70"
                          />
                          {!isEditingCompany && !isPhoneChanged && hasExistingPhone && (
                            <div className="absolute right-3 flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                              <CheckCircle size={14} /> Verified
                            </div>
                          )}
                        </div>
                      </div>
                      {isEditingCompany && isPhoneChanged && (
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={handleUpdatePhone}
                          loading={loading}
                          className="h-[38px]"
                        >
                          {hasExistingPhone ? "Change Number" : "Link Number"}
                        </Button>
                      )}
                    </div>
                    {isEditingCompany && isPhoneChanged && (
                      <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                        <Info size={12} /> Click "{hasExistingPhone ? "Change Number" : "Link Number"}" to verify via OTP.
                      </p>
                    )}
                  </div>

                  <Input
                    label="Company Website"
                    placeholder="https://www.example.in"
                    value={companyInfo.website}
                    disabled={!isEditingCompany}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phone OTP Modal */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Verify Business Phone</h3>
                <button onClick={() => setIsOtpModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the verification code sent to <strong>+91 {companyInfo.phone}</strong>
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
      </main>
    </div>
  );
};

export default EmployerProfile;
