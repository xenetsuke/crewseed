import React, { useEffect } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";

const ScheduleAvailability = ({ formData, onChange, errors }) => {

  /* =========================
     ENUMS MATCH BACKEND EXACTLY
  ========================== */
  const shiftTypes = [
    { value: "DAY", label: "Day Shift" },
    { value: "EVENING", label: "Evening Shift" },
    { value: "NIGHT", label: "Night Shift" },
    { value: "ROTATING", label: "Rotating Shifts" },
    { value: "FLEXIBLE", label: "Flexible Schedule" },
  ];

  const durationTypes = [
    { value: "PERMANENT", label: "Ongoing / Permanent" },
    { value: "DAYS_1_7", label: "1 Week" },
    { value: "WEEK_1_MONTH_1", label: "2 Weeks to 1 Month" },
    { value: "MONTH_1_3", label: "1-3 Months" },
    { value: "MONTH_3_6", label: "3-6 Months" },
    { value: "SIX_PLUS_MONTHS", label: "6+ Months" },
    { value: "ONE_YEAR_PLUS", label: "1+ Year" }, // ✅ FIXED
    { value: "CUSTOM", label: "Custom Duration" },
  ];

  const workingDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  /* =========================
     DEBUG LOG (IMPORTANT)
  ========================== */
  useEffect(() => {
    console.log("📦 Schedule Payload Preview:", {
      startDate: formData?.startDate,
      contractDuration: formData?.contractDuration,
      shiftType: formData?.shiftType,
      shiftStartTime: formData?.shiftStartTime,
      shiftEndTime: formData?.shiftEndTime,
      workingDays: formData?.workingDays,
    });
  }, [formData]);

  const toggleDay = (day) => {
    const updated = formData?.workingDays?.includes(day)
      ? formData.workingDays.filter((d) => d !== day)
      : [...(formData?.workingDays || []), day];

    onChange("workingDays", updated);
  };

  return (
    <div className="card p-6 space-y-6">

      {/* Start Date & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Date"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={formData?.startDate || ""}
          error={errors?.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
        />
{/* <Select
          label="Job Duration"
          required
          value={formData?.contractDuration || ""}
          options={durationTypes}
          error={errors?.contractDuration}
          onChange={(v) => {
            onChange("contractDuration", v);
            onChange("jobType", v === "PERMANENT" ? "PERMANENT" : "CONTRACT");
            
            // ✅ If user selects a standard duration, clear the custom text field
            if (v !== "CUSTOM") {
              onChange("customDuration", "");
            }
          }}
        /> */}
      </div>

      {formData.contractDuration === "CUSTOM" && (
        <Input
          label="Custom Duration"
          placeholder="e.g. 15 Days, 2 Years, etc."
          required
          value={formData?.customDuration || ""}
          error={errors?.customDuration}
          onChange={(e) => {
            // ✅ Keep contractDuration as "CUSTOM" while updating the text
            onChange("customDuration", e.target.value);
          }}
        />
      )}

      {/* Shift Type */}
      <Select
        label="Shift Type"
        required
        value={formData?.shiftType || ""}
        options={shiftTypes}
        error={errors?.shiftType}
        onChange={(v) => onChange("shiftType", v)}
      />

      {/* Shift Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Shift Start Time"
          type="time"
          required
          value={formData?.shiftStartTime?.substring(0, 5) || ""}
          error={errors?.shiftStartTime}
          onChange={(e) =>
            onChange("shiftStartTime", `${e.target.value}:00`)
          }
        />

        <Input
          label="Shift End Time"
          type="time"
          required
          value={formData?.shiftEndTime?.substring(0, 5) || ""}
          error={errors?.shiftEndTime}
          onChange={(e) =>
            onChange("shiftEndTime", `${e.target.value}:00`)
          }
        />
      </div>

      {/* Working Days */}
      <div>
        <label className="text-sm font-medium mb-2 block">Work Days *</label>
        <div className="grid grid-cols-7 gap-2">
          {workingDays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-2 text-sm rounded-lg ${
                formData?.workingDays?.includes(day)
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/70"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <Checkbox
          label="Overtime / Performance Incentives"
          checked={formData?.performanceIncentives || false}
          onChange={(e) =>
            onChange("performanceIncentives", e.target.checked)
          }
        />

        <Checkbox
          label="Immediate Joining Required"
          checked={formData?.immediateJoining || false}
          onChange={(e) =>
            onChange("immediateJoining", e.target.checked)
          }
        />
      </div>
    </div>
  );
};

export default ScheduleAvailability;
