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
import toast, { Toaster } from "react-hot-toast"; 
import { saveVerifiedPhone } from "../../Services/UserService";
import { getRecaptcha, auth } from "../../firebase/firebase";
import { linkWithPhoneNumber, signInAnonymously } from "firebase/auth";
import { resetAuth } from "features/AuthSlice";
import { logout } from "Services/AuthService";
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

  // Sync internal state with Redux profile
  const syncFields = () => {
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
  };

  useEffect(() => {
    syncFields();
  }, [profile, user.name, user.phoneNumber]);

  /** 📌 Phone Verification Handlers */
  const handleUpdatePhone = async () => {
    if (companyInfo.phone.length !== 10) {
      return toast.error("Please enter a valid 10-digit number");
    }
    if (!firebaseReady) return toast.error("System initializing, please wait...");

    setLoading(true);
    try {
      const recaptcha = getRecaptcha();
      window.confirmationResult = await linkWithPhoneNumber(
        auth.currentUser,
        "+91" + companyInfo.phone,
        recaptcha
      );
      setIsOtpModalOpen(true);
      toast.success(`OTP sent to +91 ${companyInfo.phone}`);
    } catch (error) {
      console.error("❌ OTP Request Failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPhoneOtp = async () => {
    setVerifying(true);
    try {
      const result = await window.confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken(true);
      
      await saveVerifiedPhone(idToken);

      const verifiedNumber = result.user.phoneNumber;
      dispatch(setUser({ 
        ...user, 
        phoneNumber: verifiedNumber 
      }));

      const res = await getProfile(user.id);
      dispatch(setProfile(res));

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-green-500`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Phone Verified Successfully!
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Account linked to <span className="font-semibold text-gray-700">{verifiedNumber}</span>. 
                  You can now use this number to login next time without changing anything.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 6000 });

      setIsEditingCompany(false);
      setIsOtpModalOpen(false);
      setOtpValue("");
    } catch (e) {
      toast.error("Invalid verification code. Please try again.");
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
      toast.success("Company details saved successfully!");
    } catch (err) {
      console.error("❌ Failed to update employer profile:", err);
      toast.error("Failed to save company information");
    }
  };

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
        toast.success("Logo updated successfully");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error("Failed to upload company logo");
    }
  };

  const tabs = [
    { id: "business", label: "Business Details" },
    { id: "personal", label: "Personal Information" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" reverseOrder={false} />

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">Personal Information</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {isEditingUser && (
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setIsEditingUser(false);
                          syncFields();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant={isEditingUser ? "default" : "outline"}
                      onClick={() => (isEditingUser ? setIsEditingUser(false) : setIsEditingUser(true))}
                      className="flex-1 sm:flex-none"
                    >
                      {isEditingUser ? "Save Changes" : "Edit Details"}
                    </Button>
                  </div>
                </div>
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
                  <div className="flex gap-2 w-full sm:w-auto">
                    {isEditingCompany && (
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setIsEditingCompany(false);
                          syncFields();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant={isEditingCompany ? "default" : "outline"}
                      onClick={() => (isEditingCompany ? handleSaveCompanyInfo() : setIsEditingCompany(true))}
                      className="flex-1 sm:flex-none"
                      disabled={isEditingCompany && isPhoneChanged}
                    >
                      {isEditingCompany ? "Save Changes" : "Edit Details"}
                    </Button>
                  </div>
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
                        <span className="flex items-center justify-center w-3 h-3 bg-blue-100 text-blue-600 rounded-full text-[8px]"><Info size={10} /></span> 
                        Click "{hasExistingPhone ? "Change Number" : "Link Number"}" to verify via OTP.
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
