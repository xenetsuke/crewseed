import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { notifications } from "@mantine/notifications";

/**
 * 🔥 Updated with Phone Verification Flow:
 * - Detects changes in Primary Phone
 * - Triggers onVerifyPhone for OTP if number changed
 * - Standard save for other fields
 */

const PersonalInfoTab = ({ profile, onSave, onVerifyPhone }) => {
  const [initialProfile, setInitialProfile] = useState(profile);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    primaryPhone: profile?.primaryPhone || "",
    alternatePhone: profile?.alternatePhone || "",
    whatsappNumber: profile?.whatsappNumber || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    currentState: profile?.currentState || "",
    currentAddress: profile?.currentAddress || "",
    currentCity: profile?.currentCity || "",
    pincode: profile?.pincode || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if primary phone was modified compared to backend
  const isPhoneChanged = formData.primaryPhone !== initialProfile?.primaryPhone;

  useEffect(() => {
    setInitialProfile(profile);
    setFormData({
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      primaryPhone: profile?.primaryPhone || "",
      alternatePhone: profile?.alternatePhone || "",
      whatsappNumber: profile?.whatsappNumber || "",
      age: profile?.age || "",
      gender: profile?.gender || "",
      currentState: profile?.currentState || "",
      currentAddress: profile?.currentAddress || "",
      currentCity: profile?.currentCity || "",
      pincode: profile?.pincode || "",
    });
  }, [profile]);

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const indianStates = [
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Delhi", label: "Delhi" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Telangana", label: "Telangana" },
    { value: "Haryana", label: "Haryana" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isPhoneChanged) {
        // 📱 Trigger OTP flow via parent
        const otpSent = await onVerifyPhone(formData.primaryPhone);
        if (otpSent) {
          setIsEditing(false);
          notifications.show({
            title: "Verification Sent",
            message: "Please enter the OTP sent to your new phone number.",
            color: "blue",
          });
        }
      } else {
        // ✅ Normal save for other fields
        const payload = { ...profile, ...formData };
        await onSave(payload);
        setInitialProfile(payload);
        setIsEditing(false);
        notifications.show({
          title: "Profile Updated",
          message: "Your personal information is saved successfully.",
          color: "green",
        });
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialProfile);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            ✏ Edit
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isPhoneChanged ? "Verify & Save" : "Save"}
            </Button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="User" size={20} />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              disabled={!isEditing}
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              required
              min="18"
              max="65"
            />

            <Select
              disabled={!isEditing}
              label="Gender"
              options={genderOptions}
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Phone" size={20} />
          Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  disabled={!isEditing}
                  label="Primary Phone Number"
                  type="tel"
                  value={formData.primaryPhone}
                  onChange={(e) => handleChange("primaryPhone", e.target.value)}
                  required
                />
              </div>
              {isEditing && isPhoneChanged && (
                <Button 
                  type="submit" 
                  size="sm" 
                  loading={loading}
                  className="mb-[2px]"
                >
                  Update Phone
                </Button>
              )}
            </div>
            {isEditing && isPhoneChanged && (
              <p className="text-[10px] text-blue-600 mt-1 font-medium italic">
                * Requires OTP verification
              </p>
            )}
          </div>

          <Input
            disabled={!isEditing}
            label="Alternative Phone (Optional)"
            type="tel"
            value={formData.alternatePhone}
            onChange={(e) => handleChange("alternatePhone", e.target.value)}
          />

          <Input
            disabled={!isEditing}
            label="WhatsApp Number"
            type="tel"
            value={formData.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
          />

          <Input
            disabled={true} // Email locked for security
            label="Email Address"
            type="email"
            value={formData.email}
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          Address Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <Input
            disabled={!isEditing}
            label="Current Address"
            type="text"
            value={formData.currentAddress}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              disabled={!isEditing}
              label="City"
              type="text"
              value={formData.currentCity}
              onChange={(e) => handleChange("currentCity", e.target.value)}
              required
            />

            <Select
              disabled={!isEditing}
              label="State"
              options={indianStates}
              value={formData.currentState}
              onChange={(value) => handleChange("currentState", value)}
              required
            />

            <Input
              disabled={!isEditing}
              label="PIN Code"
              type="text"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              required
              maxLength="6"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoTab;