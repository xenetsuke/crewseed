import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { notifications } from "@mantine/notifications"; // ⭐ For success toast

/**
 * 🔥 Enhancements:
 * - Mantine-like Edit → Save/Cancel workflow
 * - Fields locked by default
 * - Cancel restores backend values
 */

const PersonalInfoTab = ({ profile, onSave }) => {
  // 🟢 Store original backend profile separately
  const [initialProfile, setInitialProfile] = useState(profile);

  // 📝 Form Data (editable copy)
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",

    primaryPhone: profile?.primaryPhone || "",
    alternatePhone: profile?.alternatePhone || "",
    whatsappNumber: profile?.whatsappNumber || "",

    age: profile?.age || "",
    gender: profile?.gender || "",
    currentState: profile?.currentAddress || "",

    currentAddress: profile?.currentAddress || "",
    currentCity: profile?.currentCity || "",
    pincode: profile?.pincode || "",
  });

  // 🛑 Fields disabled initially → Only Edit enables them
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update form if profile reloads from Redux/backend
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

  // Update Form state
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ⭐ SAVE → Update backend + disable fields again
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...profile,
      ...formData,
    };

    await onSave(payload);

    setInitialProfile(payload);
    setIsEditing(false);

    notifications.show({
      title: "Profile Updated",
      message: "Your personal information is saved successfully.",
      color: "green",
    });

    setLoading(false);
  };

  // ❌ Cancel → revert changes + disable edit mode
  const handleCancel = () => {
    setFormData(initialProfile);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 🔵 EDIT BUTTON */}
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
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="User" size={20} />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing} // 🔒 Controls toggle
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

      {/* Contact Details */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Phone" size={20} />
          Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label="Primary Phone Number"
            type="tel"
            value={formData.primaryPhone}
            onChange={(e) => handleChange("primaryPhone", e.target.value)}
            required
          />

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
            disabled={!isEditing}
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Address Section */}
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
