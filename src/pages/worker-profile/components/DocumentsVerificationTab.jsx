import React, { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

/* =========================================================
   Helper: Convert file → Base64 (for backend)
========================================================= */
const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* =========================================================
   Normalize backend → UI-safe structure
========================================================= */
const buildInitialData = (documents = {}) => ({
  aadhaar: documents.aadhaar || {
    number: "",
    status: "NOT_UPLOADED",
    picture: null,
    uploadDate: null,
  },
  pan: documents.pan || {
    number: "",
    status: "NOT_UPLOADED",
    picture: null,
    uploadDate: null,
  },
  bankDetails: documents.bankDetails || {
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    verified: false,
  },
  additionalDocs: Array.isArray(documents.additionalDocs)
    ? documents.additionalDocs
    : [],
});

const DocumentsVerificationTab = ({ documents, onSave }) => {
  /* 🧠 Last saved backend state */
  const [initialData, setInitialData] = useState(() =>
    buildInitialData(documents)
  );

  /* ✏ Editable form state */
  const [formData, setFormData] = useState(() =>
    buildInitialData(documents)
  );

  /* 🔒 Edit toggle */
  const [isEditing, setIsEditing] = useState(false);

  /* ⏳ Save loading */
  const [loading, setLoading] = useState(false);

  /* =========================================================
     Sync when backend updates
  ========================================================= */
  useEffect(() => {
    const parsed = buildInitialData(documents);
    setInitialData(parsed);
    setFormData(parsed);
  }, [documents]);

  /* =========================================================
     Status Badge
  ========================================================= */
  const getStatusBadge = (status) => {
    const statusConfig = {
      VERIFIED: { color: "bg-green-500", text: "Verified", icon: "CheckCircle" },
      PENDING: { color: "bg-yellow-500", text: "Pending", icon: "Clock" },
      REJECTED: { color: "bg-red-500", text: "Rejected", icon: "XCircle" },
      NOT_UPLOADED: { color: "bg-gray-500", text: "Not Uploaded", icon: "Upload" },
    };

    const config = statusConfig[status] || statusConfig.NOT_UPLOADED;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.color} text-white text-xs`}>
        <Icon name={config.icon} size={12} />
        {config.text}
      </div>
    );
  };

  /* =========================================================
     File Upload (only in edit mode)
  ========================================================= */
  const handleFileUpload = async (docType, file) => {
    if (!file || !isEditing) return;

    const base64 = await convertFileToBase64(file);

    setFormData((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        picture: base64,
        status: "PENDING",
        uploadDate: new Date().toISOString().split("T")[0],
      },
    }));
  };

  /* =========================================================
     Nested input handler
  ========================================================= */
  const handleInputChange = (section, field, value) => {
    if (!isEditing) return;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* =========================================================
     Cancel → restore backend data
  ========================================================= */
  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  /* =========================================================
     Save → backend
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);

    const payload = {
      ...documents, // IMPORTANT: keeps profile.id
      aadhaar: formData.aadhaar,
      pan: formData.pan,
      bankDetails: formData.bankDetails,
      additionalDocs: formData.additionalDocs,
      kycStatus: "IN_PROGRESS",
    };

    await onSave(payload);

    setInitialData(formData);
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= EDIT CONTROLS ================= */}
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

      {/* ================= AADHAAR ================= */}
      <div className="card p-4 md:p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Aadhaar Card</h3>
          {getStatusBadge(formData.aadhaar.status)}
        </div>

        <Input
          disabled={!isEditing}
          label="Aadhaar Number"
          value={formData.aadhaar.number}
          onChange={(e) =>
            handleInputChange("aadhaar", "number", e.target.value)
          }
        />

        <input
          disabled={!isEditing}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload("aadhaar", e.target.files[0])}
        />
      </div>

      {/* ================= PAN ================= */}
      <div className="card p-4 md:p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">PAN Card</h3>
          {getStatusBadge(formData.pan.status)}
        </div>

        <Input
          disabled={!isEditing}
          label="PAN Number"
          value={formData.pan.number}
          onChange={(e) =>
            handleInputChange("pan", "number", e.target.value.toUpperCase())
          }
        />

        <input
          disabled={!isEditing}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload("pan", e.target.files[0])}
        />
      </div>

      {/* ================= BANK ================= */}
      <div className="card p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Bank Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label="Account Holder Name"
            value={formData.bankDetails.accountHolderName}
            onChange={(e) =>
              handleInputChange("bankDetails", "accountHolderName", e.target.value)
            }
          />
          <Input
            disabled={!isEditing}
            label="Account Number"
            value={formData.bankDetails.accountNumber}
            onChange={(e) =>
              handleInputChange("bankDetails", "accountNumber", e.target.value)
            }
          />
          <Input
            disabled={!isEditing}
            label="IFSC Code"
            value={formData.bankDetails.ifscCode}
            onChange={(e) =>
              handleInputChange("bankDetails", "ifscCode", e.target.value.toUpperCase())
            }
          />
          <Input
            disabled={!isEditing}
            label="Bank Name"
            value={formData.bankDetails.bankName}
            onChange={(e) =>
              handleInputChange("bankDetails", "bankName", e.target.value)
            }
          />
        </div>
      </div>
    </form>
  );
};

export default DocumentsVerificationTab;
