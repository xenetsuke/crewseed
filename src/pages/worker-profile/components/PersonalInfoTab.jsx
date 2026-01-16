import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import toast from "react-hot-toast";

const PersonalInfoTab = ({ profile, onSave, onVerifyPhone }) => {
  const { t } = useTranslation();
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

  useEffect(() => {
    setFormData({
      fullName: profile?.fullName || user?.name || "",
      email: profile?.email || user?.email || "",
      primaryPhone: formatToTenDigits(
        user?.phoneNumber || profile?.primaryPhone || ""
      ),
      alternatePhone: profile?.alternatePhone || "",
      whatsappNumber: profile?.whatsappNumber || "",
      age: profile?.age || "",
      gender: profile?.gender || "",
      currentState: profile?.currentState || "",
      currentAddress: profile?.currentAddress || "",
      currentCity: profile?.currentCity || "",
      pincode: profile?.pincode || "",
    });

    if (user?.phoneNumber && isEditing) {
      setIsEditing(false);
    }
  }, [profile, user]);

  const hasExistingPhone = !!user?.phoneNumber;
  const isPhoneChanged =
    formatToTenDigits(formData.primaryPhone) !==
    formatToTenDigits(user?.phoneNumber);

  const genderOptions = [
    { value: "MALE", label: t("gender.male", "Male") },
    { value: "FEMALE", label: t("gender.female", "Female") },
    { value: "OTHER", label: t("gender.other", "Other") },
  ];

  const indianStates = [
    { value: "Maharashtra", label: t("state.maharashtra", "Maharashtra") },
    { value: "Delhi", label: t("state.delhi", "Delhi") },
    { value: "Karnataka", label: t("state.karnataka", "Karnataka") },
    { value: "Tamil Nadu", label: t("state.tamilNadu", "Tamil Nadu") },
    { value: "Gujarat", label: t("state.gujarat", "Gujarat") },
    { value: "Rajasthan", label: t("state.rajasthan", "Rajasthan") },
    { value: "Uttar Pradesh", label: t("state.uttarPradesh", "Uttar Pradesh") },
    { value: "West Bengal", label: t("state.westBengal", "West Bengal") },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePhone = async () => {
    if (formData.primaryPhone.length !== 10) {
      return toast.error(
        t("validation.phone10Digits", "Please enter a valid 10-digit number")
      );
    }
    setLoading(true);
    await onVerifyPhone(formData.primaryPhone);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPhoneChanged) {
      return toast.error(
        t("validation.verifyPhoneFirst", "Please verify your phone number first")
      );
    }

    setLoading(true);
    try {
      await onSave({ ...profile, ...formData });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            ✏ {t("profile.edit", "Edit Profile")}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={loading} disabled={isPhoneChanged}>
              {t("common.save", "Save")}
            </Button>
          </div>
        )}
      </div>

      {/* PROFILE INFO */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-primary" />
          {t("profile.section.profileInfo", "Profile Information")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label={t("profile.fullName", "Full Name")}
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              disabled={!isEditing}
              label={t("profile.age", "Age")}
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              required
            />
            <Select
              disabled={!isEditing}
              label={t("profile.gender", "Gender")}
              options={genderOptions}
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              required
            />
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Phone" size={20} className="text-primary" />
          {t("profile.section.contactInfo", "Contact Details")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-muted-foreground">
              {t("profile.primaryPhone", "Primary Phone")}
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-0 pl-3 pr-2 border-r bg-gray-50 h-full flex items-center">
                +91
              </div>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.primaryPhone}
                onChange={(e) =>
                  handleChange(
                    "primaryPhone",
                    e.target.value.replace(/\D/g, "").slice(-10)
                  )
                }
                placeholder={t("profile.phonePlaceholder", "Enter 10 digits")}
                className="w-full pl-14 pr-4 py-2 border rounded-md"
              />

              {!isPhoneChanged && hasExistingPhone && (
                <div className="absolute right-3 text-green-600 text-xs font-bold">
                  {t("common.verified", "Verified")}
                </div>
              )}
            </div>

            {isEditing && isPhoneChanged && (
              <Button
                type="button"
                size="sm"
                className="mt-2"
                onClick={handleUpdatePhone}
                loading={loading}
              >
                {hasExistingPhone
                  ? t("profile.change", "Change")
                  : t("common.verify", "Verify")}
              </Button>
            )}
          </div>

          <Input
            disabled={!isEditing}
            label={t("profile.whatsapp", "WhatsApp Number")}
            value={formData.whatsappNumber}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
          />

          <Input
            disabled
            label={t("profile.email", "Email")}
            value={formData.email}
          />
        </div>
      </section>

      {/* ADDRESS INFO */}
      <section className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-primary" />
          {t("profile.section.addressInfo", "Address Information")}
        </h3>

        <div className="space-y-4">
          <Input
            disabled={!isEditing}
            label={t("profile.currentAddress", "Current Address")}
            value={formData.currentAddress}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              disabled={!isEditing}
              label={t("profile.currentCity", "City")}
              value={formData.currentCity}
              onChange={(e) => handleChange("currentCity", e.target.value)}
              required
            />
            <Select
              disabled={!isEditing}
              label={t("profile.currentState", "State")}
              options={indianStates}
              value={formData.currentState}
              onChange={(value) => handleChange("currentState", value)}
              required
            />
            <Input
              disabled={!isEditing}
              label={t("profile.pincode", "Pincode")}
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              required
            />
          </div>
        </div>
      </section>
    </form>
  );
};

export default PersonalInfoTab;