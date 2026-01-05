import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";

/**
 * Compensation & Benefits Step
 * Backend aligned with:
 *  - boolean flags (transportProvided, foodProvided, etc.)
 *  - detail fields (transportDetails, foodDetails, accommodationDetails)
 *  - leavePolicy as text
 */
const CompensationBenefits = ({ formData, onChange, errors }) => {

  /* -------------------- Pay Frequency -------------------- */
  const paymentFrequency = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "BI_WEEKLY", label: "Bi-Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  /* -------------------- Benefits List (Backend Aligned) -------------------- */
  const benefitsList = [
    {
      id: "transportProvided",
      label: "Transportation Provided",
      icon: "Car",
      detailsKey: "transportDetails",
    },
    {
      id: "foodProvided",
      label: "Food / Meal Provided",
      icon: "Utensils",
      detailsKey: "foodDetails",
    },
    {
      id: "accommodationProvided",
      label: "Accommodation Provided",
      icon: "Home",
      detailsKey: "accommodationDetails",
    },
    {
      id: "uniformProvided",
      label: "Uniform Provided",
      icon: "Shirt",
    },
    {
      id: "medicalInsurance",
      label: "Medical Insurance",
      icon: "Heart",
    },
    {
      id: "esiPfBenefits",
      label: "ESI & PF Benefits",
      icon: "PiggyBank",
    },
    {
      id: "festivalBonuses",
      label: "Festival / Annual Bonus",
      icon: "Gift",
    },
    {
      id: "leavePolicy",
      label: "Paid Leave Policy",
      icon: "Calendar",
      isText: true, // Special case: text input instead of toggle
    },
  ];

  /* -------------------- Toggle Boolean Benefits -------------------- */
  const handleBenefitToggle = (benefitId) => {
    onChange(benefitId, !formData?.[benefitId]);
  };

  return (
    <div className="card p-6 space-y-6">

      {/* -------------------- Header -------------------- */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">3</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Compensation & Benefits</h2>
          <p className="text-sm text-muted-foreground">
            Salary structure and additional perks
          </p>
        </div>
      </div>

      {/* -------------------- Pay Section -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Select
          label="Pay Frequency"
          options={paymentFrequency}
          value={formData?.paymentFrequency}
          onChange={(value) => onChange("paymentFrequency", value)}
          error={errors?.paymentFrequency}
          required
          placeholder="Select frequency"
        />

        <Input
          label="Pay Rate"
          type="number"
          placeholder="500"
          value={formData?.minPay}
          onChange={(e) => onChange("minPay", e.target.value)}
          error={errors?.minPay}
          min="0"
          step="50"
          required
          description="₹ (Rupees)"
        />
{/* 
        <Input
          label="Maximum Pay Rate"
          type="number"
          placeholder="800"
          value={formData?.maxPay}
          onChange={(e) => onChange("maxPay", e.target.value)}
          error={errors?.maxPay}
          min="0"
          step="50"
          description="₹ (Rupees)"
        /> */}
      </div>

      {/* -------------------- Benefits Section -------------------- */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Benefits & Perks
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefitsList.map((benefit) => (
            <div key={benefit.id} className="space-y-2">

              {/* Benefit Card */}
              <div
                onClick={() =>
                  !benefit.isText && handleBenefitToggle(benefit.id)
                }
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData?.[benefit.id]
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      formData?.[benefit.id]
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Icon
                      name={benefit.icon}
                      size={16}
                      color={
                        formData?.[benefit.id]
                          ? "var(--color-primary)"
                          : "var(--color-muted-foreground)"
                      }
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {benefit.label}
                  </span>
                </div>
              </div>

              {/* Conditional Details Input */}
              {benefit.detailsKey && formData?.[benefit.id] && (
                <Input
                  type="text"
                  placeholder="Enter details (optional)"
                  value={formData?.[benefit.detailsKey]}
                  onChange={(e) =>
                    onChange(benefit.detailsKey, e.target.value)
                  }
                />
              )}

              {/* Leave Policy Text Input */}
              {benefit.isText && (
                <Input
                  type="text"
                  placeholder="e.g. 12 paid leaves per year"
                  value={formData?.leavePolicy}
                  onChange={(e) =>
                    onChange("leavePolicy", e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompensationBenefits;
