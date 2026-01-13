import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import toast from "react-hot-toast"; // 🔹 Switched to toast

const PersonalInfoTab = ({ profile, onSave, onVerifyPhone }) => {
  const user = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatToTenDigits = (phone) => {
    if (!phone) return "";
    const clean = phone.toString().replace(/\D/g, "");
    if (clean.length === 12 && clean.startsWith("91")) return clean.slice(2);
    return clean.length > 10 ? clean.slice(-10) : clean;
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    primaryPhone: "",
    alternatePhone: "",
    whatsappNumber: "",
    age: "",
    gender: "",
    currentState: "",
    currentAddress: "",
    currentCity: "",
    pincode: "",
  });

  // Sync with Profile and Redux User
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
    
    // If phone matches user state after verification, turn off editing mode
    if (user?.phoneNumber && isEditing) {
        setIsEditing(false);
    }
  }, [profile, user]);

  const hasExistingPhone = !!user?.phoneNumber;
  const isPhoneChanged = formatToTenDigits(formData.primaryPhone) !== formatToTenDigits(user?.phoneNumber);

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
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePhone = async () => {
    if (formData.primaryPhone.length !== 10) {
      return toast.error("Please enter a valid 10-digit number");
    }
    setLoading(true);
    await onVerifyPhone(formData.primaryPhone);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPhoneChanged) {
        return toast.error("Please verify your new phone number first");
    }
    
    setLoading(true);
    try {
      await onSave({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      // Error handled by parent toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>✏ Edit Profile</Button>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={isPhoneChanged}>Save Changes</Button>
          </div>
        )}
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-primary" /> Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input disabled={!isEditing} label="Full Name" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required />
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
                  <div className="absolute left-0 pl-3 flex items-center pointer-events-none h-full border-r border-border pr-2 bg-gray-50 rounded-l-md">
                    <span className="text-gray-500 font-bold text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.primaryPhone}
                    onChange={(e) => handleChange("primaryPhone", e.target.value.replace(/\D/g, "").slice(-10))}
                    placeholder="Enter 10 digits"
                    className="w-full pl-16 pr-4 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-70"
                  />
                  {!isPhoneChanged && hasExistingPhone && (
                    <div className="absolute right-3 flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                      <Icon name="CheckCircle" size={14} /> Verified
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && isPhoneChanged && (
                <Button type="button" size="sm" onClick={handleUpdatePhone} loading={loading} className="mb-[1px] whitespace-nowrap h-[38px]">
                  {hasExistingPhone ? "Change" : "Verify"}
                </Button>
              )}
            </div>
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