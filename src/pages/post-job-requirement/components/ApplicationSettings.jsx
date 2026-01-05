import React from "react";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";

const ApplicationSettings = ({ formData, onChange, errors }) => {
  const documentOptions = [
    { id: "aadhar", label: "Aadhar Card" },
    { id: "pan", label: "PAN Card" },
    { id: "police", label: "Police Verification" },
    { id: "medical", label: "Medical Certificate" },
    { id: "driving", label: "Driving Licence" },
    
  ];

  const handleDocToggle = (doc) => {
    const current = formData?.documentRequirements || [];
    const updated = current.includes(doc)
      ? current.filter((d) => d !== doc)
      : [...current, doc];

    onChange("documentRequirements", updated);
  };

  return (
    <div className="card p-6 space-y-6">
      {/* 🔹 Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">5</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Application Settings</h2>
          <p className="text-sm text-muted-foreground">
            Hiring rules & documentation required
          </p>
        </div>
      </div>

      {/* 🔹 Deadline */}
      <Input
        label="Application Deadline"
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={formData?.applicationDeadline?.split("T")[0] || ""}
        error={errors?.applicationDeadline}
        onChange={(e) => {
          const dateVal = e.target.value;
          // ✅ Unanimous Change: Append time to satisfy backend LocalDateTime
          onChange("applicationDeadline", dateVal ? `${dateVal}T00:00:00` : "");
        }}
        description="Last date to accept applications"
      />

      {/* 🔹 Document Requirements */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Required Documents
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Select all documents workers must upload or present
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documentOptions.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocToggle(doc.id)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                (formData?.documentRequirements || []).includes(doc.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-sm font-medium">{doc.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Policy Checkboxes */}
      {/* <div className="p-4 bg-muted rounded-lg space-y-3">
        <Checkbox
          label="Allow Direct Applications"
          checked={formData?.allowDirectApplications}
          onChange={(e) =>
            onChange("allowDirectApplications", e.target.checked)
          }
        />
        <Checkbox
          label="Interview Required"
          checked={formData?.interviewRequired}
          onChange={(e) => onChange("interviewRequired", e.target.checked)}
        />
        <Checkbox
          label="Background Check Required"
          checked={formData?.backgroundCheckRequired}
          onChange={(e) =>
            onChange("backgroundCheckRequired", e.target.checked)
          }
        />
        <Checkbox
          label="Medical Fitness Required"
          checked={formData?.medicalFitnessRequired}
          onChange={(e) => onChange("medicalFitnessRequired", e.target.checked)}
        />
        <Checkbox
          label="Driving Licence"
          checked={formData?.drivingLicence}
          onChange={(e) => onChange("medicalFitnessRequired", e.target.checked)}
        />
      </div> */}

      {/* 🔹 Special instructions */}
      <Input
        label="Additional Instructions (Optional)"
        type="text"
        placeholder="e.g., Bring a hard copy of documents"
        value={formData?.additionalInstructions}
        onChange={(e) => onChange("additionalInstructions", e.target.value)}
      />
    </div>
  );
};

export default ApplicationSettings;
