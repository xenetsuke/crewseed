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
} from "lucide-react";

import EmployerSidebar from "../../components/navigation/EmployerSidebar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Icon from "../../components/AppIcon"; // Re-using your Icon component

import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../Services/ProfileService";
import { setProfile } from "../../features/ProfileSlice";
import { removeUser } from "../../features/UserSlice";

const EmployerProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user || {});
  const profile = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("business"); // Options: 'business', 'personal'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

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

  /** 📌 Fetch Profile from DB on mount */
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

  /** 📌 Sync local state whenever Redux profile changes */
  useEffect(() => {
    if (profile) {
      setCompanyInfo({
        companyName: profile.companyName || "",
        gstNumber: profile.gstNumber || "",
        industryType: profile.industryType || "",
        contactPersonName: profile.contactPersonName || "",
        officialEmail: profile.officialEmail || "",
        phone: profile.primaryPhone || "",
        website: profile.Companywebsite || "",
        panNumber: profile.panNumber || "",
      });
      setUserName(user.name || "");
    }
  }, [profile, user.name]);

  const handleSaveCompanyInfo = async () => {
    try {
      const cleanPhone = companyInfo.phone.replace(/\D/g, "").slice(-10);
      const payload = {
        ...profile,
        userId: user.id,
        companyName: companyInfo.companyName,
        gstNumber: companyInfo.gstNumber?.toUpperCase(),
        industryType: companyInfo.industryType,
        contactPersonName: companyInfo.contactPersonName,
        officialEmail: companyInfo.officialEmail,
        primaryPhone: cleanPhone,
        Companywebsite: companyInfo.website,
        panNumber: companyInfo.panNumber?.toUpperCase(),
      };

      const updated = await updateProfile(payload);
      dispatch(setProfile(updated));
      setIsEditingCompany(false);
    } catch (err) {
      console.error("❌ Failed to update employer profile:", err);
      alert("Failed to save company information");
    }
  };

  const handleLogout = () => {
    dispatch(removeUser());
    localStorage.clear();
    window.location.href = "/login";
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
              <p className="text-sm md:text-base text-muted-foreground">
                Manage your Indian business entity details and preferences
              </p>
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

          {/* 📌 Tab Navigation (Matching Worker Profile Style) */}
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

          {/* Tab Content */}
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
                  <h2 className="text-lg md:text-xl font-semibold">Business Details (India)</h2>
                  <Button
                    variant={isEditingCompany ? "default" : "outline"}
                    onClick={() => (isEditingCompany ? handleSaveCompanyInfo() : setIsEditingCompany(true))}
                    className="w-full sm:w-auto"
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
                  <Input
                    label="Mobile Number"
                    placeholder="+91 00000 00000"
                    value={companyInfo.phone.startsWith("+91") ? companyInfo.phone : `+91 ${companyInfo.phone}`}
                    disabled={!isEditingCompany}
                    onChange={(e) => {
                      const val = e.target.value.replace("+91 ", "");
                      setCompanyInfo({ ...companyInfo, phone: val });
                    }}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                  />
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
      </main>
    </div>
  );
};

export default EmployerProfile;