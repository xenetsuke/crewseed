import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { notifications } from "@mantine/notifications";

const PersonalInfoTab = ({ profile, onSave, onVerifyPhone }) => {
  // Accessing the Redux user state directly as requested
  const user = useSelector((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to ensure we only handle the 10-digit mobile part
  const formatToTenDigits = (phone) => {
    if (!phone) return "";
    const clean = phone.toString().replace(/\D/g, "");
    // If it starts with 91 and is 12 digits, strip the 91
    if (clean.length === 12 && clean.startsWith("91")) {
      return clean.slice(2);
    }
    return clean.length > 10 ? clean.slice(-10) : clean;
  };
  // Inside PersonalInfoTab.js
useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    fullName: profile?.fullName || user?.name || "",
    // Priority: User state (Verified) > Profile state > Empty
    primaryPhone: formatToTenDigits(user?.phoneNumber || profile?.primaryPhone || ""),
    // ... rest of your fields
  }));
}, [profile, user]); // 👈 This triggers when either Redux slice updates

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || user?.name || "",
    email: profile?.email || user?.email || "",
    primaryPhone: formatToTenDigits(user?.phoneNumber || profile?.primaryPhone || ""),
    alternatePhone: profile?.alternatePhone || "",
    whatsappNumber: profile?.whatsappNumber || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    currentState: profile?.currentState || "",
    currentAddress: profile?.currentAddress || "",
    currentCity: profile?.currentCity || "",
    pincode: profile?.pincode || "",
  });

  // Check against Redux User state for the phone linking status
  const hasExistingPhone = !!user?.phoneNumber;
  const isPhoneChanged = formatToTenDigits(formData.primaryPhone) !== formatToTenDigits(user?.phoneNumber);

  useEffect(() => {
    setFormData({
      fullName: profile?.fullName || user?.name || "",
      email: profile?.email || user?.email || "",
      primaryPhone: formatToTenDigits(user?.phoneNumber || profile?.primaryPhone || ""),
      alternatePhone: profile?.alternatePhone || "",
      whatsappNumber: profile?.whatsappNumber || "",
      age: profile?.age || "",
      gender: profile?.gender || "",
      currentState: profile?.currentState || "",
      currentAddress: profile?.currentAddress || "",
      currentCity: profile?.currentCity || "",
      pincode: profile?.pincode || "",
    });
  }, [profile, user]);

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const indianStates = [
    { value: "Maharashtra", label: "Maharashtra" }, { value: "Delhi", label: "Delhi" },
    { value: "Karnataka", label: "Karnataka" }, { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Gujarat", label: "Gujarat" }, { value: "Rajasthan", label: "Rajasthan" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" }, { value: "West Bengal", label: "West Bengal" },
    { value: "Telangana", label: "Telangana" }, { value: "Haryana", label: "Haryana" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePhone = async () => {
    if (formData.primaryPhone.length !== 10) {
      return notifications.show({ message: "Please enter a valid 10-digit number", color: "red" });
    }
    setLoading(true);
    const otpSent = await onVerifyPhone(formData.primaryPhone);
    if (otpSent) {
      notifications.show({
        title: "OTP Sent",
        message: `Verification code sent to +91 ${formData.primaryPhone}`,
        color: "blue",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPhoneChanged) return; 
    
    setLoading(true);
    try {
      const payload = { ...profile, ...formData };
      await onSave(payload);
      setIsEditing(false);
      notifications.show({ title: "Profile Updated", message: "Information saved successfully.", color: "green" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...profile,
      primaryPhone: formatToTenDigits(user?.phoneNumber || profile?.primaryPhone || "")
    });
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>✏ Edit Profile</Button>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={isPhoneChanged}>Save Changes</Button>
          </div>
        )}
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-primary" /> Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input disabled={!isEditing} label="Age" type="number" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} required />
            <Select disabled={!isEditing} label="Gender" options={genderOptions} value={formData.gender} onChange={(value) => handleChange("gender", value)} required />
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Phone" size={20} className="text-primary" /> Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Primary Phone Number</label>
                <div className="relative flex items-center">
                  {/* Fixed +91 Prefix UI */}
                  <div className="absolute left-0 pl-3 flex items-center pointer-events-none h-full border-r border-border pr-2 bg-gray-50 rounded-l-md">
                    <span className="text-gray-500 font-bold text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.primaryPhone}
                    // Ensures only digits are kept and strips any leading 91 user might type
                    onChange={(e) => handleChange("primaryPhone", e.target.value.replace(/\D/g, "").slice(-10))}
                    placeholder="Enter 10 digits"
                    className="w-full pl-16 pr-4 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-70"
                  />
                  {!isEditing && !isPhoneChanged && hasExistingPhone && (
                    <div className="absolute right-3 flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                      <Icon name="CheckCircle" size={14} /> Verified
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && isPhoneChanged && (
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleUpdatePhone}
                  loading={loading}
                  className="mb-[1px] whitespace-nowrap h-[38px]"
                >
                  {hasExistingPhone ? "Change Number" : "Link Number"}
                </Button>
              )}
            </div>
            {isPhoneChanged && (
              <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Icon name="Info" size={12} />
                Click "{hasExistingPhone ? "Change Number" : "Link Number"}" to verify via OTP.
              </p>
            )}
          </div>
          <Input disabled={!isEditing} label="WhatsApp Number" value={formData.whatsappNumber} onChange={(e) => handleChange("whatsappNumber", e.target.value)} />
          <Input disabled={true} label="Email Address" value={formData.email} />
        </div>
      </section>

      <section className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-primary" /> Address Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Input disabled={!isEditing} label="Current Address" value={formData.currentAddress} onChange={(e) => handleChange("currentAddress", e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input disabled={!isEditing} label="City" value={formData.currentCity} onChange={(e) => handleChange("currentCity", e.target.value)} required />
            <Select disabled={!isEditing} label="State" options={indianStates} value={formData.currentState} onChange={(value) => handleChange("currentState", value)} required />
            <Input disabled={!isEditing} label="PIN Code" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} required maxLength="6" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default PersonalInfoTab;