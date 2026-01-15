import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { Checkbox } from "../../../components/ui/Checkbox";

/* ======================================================
   Helper: normalize backend data → form-friendly shape
====================================================== */
const buildInitialData = (data = {}) => ({
  primaryJobRole: data.primaryJobRole || "",
  skillLevel: data.skillLevel || "",
  secondarySkills: Array.isArray(data.skills) ? data.skills : [],
  yearsExperience:
    typeof data.totalExperience === "number" ? data.totalExperience : 0,
  shiftPreference: data.shiftPreference || "",
  workType: data.workType || "",
  availability: Array.isArray(data.availability) ? data.availability : [],
  wageType: data.wageType || "daily",
  wageAmount: typeof data.wageAmount === "number" ? data.wageAmount : 0,
  wageNegotiable: !!data.wageNegotiable,
});

const ProfessionalInfoTab = ({ data, onSave }) => {
  const { t } = useTranslation();

  const [initialData, setInitialData] = useState(() =>
    buildInitialData(data || {})
  );
  const [formData, setFormData] = useState(() =>
    buildInitialData(data || {})
  );

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  /* ======================================================
     Sync when backend data changes
  ====================================================== */
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    const parsed = buildInitialData(data);
    setInitialData(parsed);
    setFormData(parsed);
  }, [data]);

  /* ======================================================
     OPTIONS (i18n safe)
  ====================================================== */
  const jobRoleOptions = [
    "Construction Worker",
    "Mason",
    "Helper",
    "Carpenter",
    "Painter",
    "Plumber",
    "Electrician",
    "Welder",
    "Loader",
    "Packer",
    "Warehouse Helper",
    "Forklift Operator",
    "Driver",
    "Truck Driver",
    "Delivery Executive",
    "Factory Worker",
    "Machine Operator",
    "Security Guard",
    "Housekeeping",
    "Cook",
    "Waiter",
    "Shop Helper",
    "Farm Worker",
    "Sanitation Worker",
  ];

  const skillLevelOptions = [
    { value: "beginner", label: t("professional.skillLevel.beginner", "Beginner") },
    { value: "intermediate", label: t("professional.skillLevel.intermediate", "Intermediate") },
    { value: "expert", label: t("professional.skillLevel.expert", "Expert") },
  ];

  const shiftOptions = [
    { value: "morning", label: t("professional.shift.morning", "Morning (6 AM - 2 PM)") },
    { value: "day", label: t("professional.shift.day", "Day (9 AM - 6 PM)") },
    { value: "evening", label: t("professional.shift.evening", "Evening (2 PM - 10 PM)") },
    { value: "night", label: t("professional.shift.night", "Night (10 PM - 6 AM)") },
  ];

  const workTypeOptions = [
    { value: "full-time", label: t("professional.workType.fullTime", "Full-Time") },
    { value: "part-time", label: t("professional.workType.partTime", "Part-Time") },
    { value: "contract", label: t("professional.workType.contract", "Contract") },
    { value: "temporary", label: t("professional.workType.temporary", "Temporary") },
  ];

  const daysOfWeek = [
    { value: "monday", label: t("days.mon", "Mon") },
    { value: "tuesday", label: t("days.tue", "Tue") },
    { value: "wednesday", label: t("days.wed", "Wed") },
    { value: "thursday", label: t("days.thu", "Thu") },
    { value: "friday", label: t("days.fri", "Fri") },
    { value: "saturday", label: t("days.sat", "Sat") },
    { value: "sunday", label: t("days.sun", "Sun") },
  ];

  /* ======================================================
     Generic change handler
  ====================================================== */
  const handleChange = (field, value) => {
    if (!isEditing) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ======================================================
     Skills handling
  ====================================================== */
  const handleAddSkill = () => {
    if (!isEditing || !newSkill.trim()) return;
    if (!formData.secondarySkills.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        secondarySkills: [...prev.secondarySkills, newSkill],
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill) => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter((s) => s !== skill),
    }));
  };

  /* ======================================================
     Availability toggle
  ====================================================== */
  const handleDayToggle = (day) => {
    if (!isEditing) return;
    const current = formData.availability;
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    handleChange("availability", updated);
  };

  /* ======================================================
     SAVE → backend
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);

    const payload = {
      ...data,
      primaryJobRole: formData.primaryJobRole,
      skillLevel: formData.skillLevel,
      skills: formData.secondarySkills,
      totalExperience: formData.yearsExperience,
      shiftPreference: formData.shiftPreference,
      workType: formData.workType,
      availability: formData.availability,
      wageType: formData.wageType,
      wageAmount: formData.wageAmount,
      wageNegotiable: formData.wageNegotiable,
    };

    await onSave(payload);

    setInitialData(formData);
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setNewSkill("");
  };

  if (!formData) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {t("common.loading", "Loading professional details...")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= EDIT CONTROLS ================= */}
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            ✏ {t("common.edit", "Edit")}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {t("common.save", "Save")}
            </Button>
          </div>
        )}
      </div>

      {/* ================= ROLE & SKILLS ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Briefcase" size={20} />
          {t("professional.section.roleSkills", "Current Role & Skills")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label={t("professional.primaryJobRole", "Primary Job Role")}
            placeholder={t(
              "professional.jobRolePlaceholder",
              "Type or select your job role"
            )}
            value={formData.primaryJobRole}
            onChange={(e) =>
              handleChange("primaryJobRole", e.target.value)
            }
            list="job-role-suggestions"
            required
          />

          <datalist id="job-role-suggestions">
            {jobRoleOptions.map((role) => (
              <option key={role} value={role} />
            ))}
          </datalist>

          <Select
            disabled={!isEditing}
            label={t("professional.skillLevel.label", "Skill Level")}
            options={skillLevelOptions}
            value={formData.skillLevel}
            onChange={(value) => handleChange("skillLevel", value)}
            required
          />
        </div>

        {/* Secondary Skills */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            {t("professional.otherSkills", "Other Skills")}
          </label>

          <div className="flex gap-2 mb-3">
            <Input
              disabled={!isEditing}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={t("professional.addSkill", "Add a skill")}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              {t("common.add", "Add")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.secondarySkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Award" size={20} />
          {t("professional.experienceDetails", "Experience Details")}
        </h3>

        <label className="block text-sm mb-2">
          {t("professional.yearsExperience", "Years of Experience")}:
          {" "}{formData.yearsExperience}
        </label>

        <input
          type="range"
          min="0"
          max="20"
          value={formData.yearsExperience}
          onChange={(e) =>
            handleChange("yearsExperience", Number(e.target.value))
          }
          disabled={!isEditing}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Select
            disabled={!isEditing}
            label={t("professional.shiftPreference", "Shift Preference")}
            options={shiftOptions}
            value={formData.shiftPreference}
            onChange={(v) => handleChange("shiftPreference", v)}
          />
          <Select
            disabled={!isEditing}
            label={t("professional.workType.label", "Work Type")}
            options={workTypeOptions}
            value={formData.workType}
            onChange={(v) => handleChange("workType", v)}
          />
        </div>
      </div>

      {/* ================= AVAILABILITY ================= */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">
          {t("professional.availability", "Availability")}
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.value}
              type="button"
              disabled={!isEditing}
              onClick={() => handleDayToggle(day.value)}
              className={`px-3 py-2 rounded ${
                formData.availability.includes(day.value)
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= WAGE ================= */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="IndianRupee" size={20} />
          {t("professional.wageInfo", "Wage Information")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Select
            disabled={!isEditing}
            label={t("professional.wageType", "Wage Type")}
            options={[
              { value: "daily", label: t("wage.daily", "Daily") },
              { value: "hourly", label: t("wage.hourly", "Hourly") },
              { value: "monthly", label: t("wage.monthly", "Monthly") },
            ]}
            value={formData.wageType}
            onChange={(v) => handleChange("wageType", v)}
          />

          <Input
            disabled={!isEditing}
            label={t("professional.wageAmount", "Wage Amount")}
            type="number"
            value={formData.wageAmount}
            onChange={(e) =>
              handleChange("wageAmount", Number(e.target.value))
            }
          />
        </div>

        <div className="mt-3">
          <Checkbox
            disabled={!isEditing}
            label={t("professional.wageNegotiable", "Wage is negotiable")}
            checked={formData.wageNegotiable}
            onChange={(e) =>
              handleChange("wageNegotiable", e.target.checked)
            }
          />
        </div>
      </div>
    </form>
  );
};

export default ProfessionalInfoTab;
