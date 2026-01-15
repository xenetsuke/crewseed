import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [initialData, setInitialData] = useState(() =>
    buildInitialData(documents)
  );
  const [formData, setFormData] = useState(() =>
    buildInitialData(documents)
  );

  const [isEditing, setIsEditing] = useState(false);
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
     Status Badge (i18n)
  ========================================================= */
  const getStatusBadge = (status) => {
    const statusConfig = {
      VERIFIED: {
        color: "bg-green-500",
        text: t("documents.status.verified"),
        icon: "CheckCircle",
      },
      PENDING: {
        color: "bg-yellow-500",
        text: t("documents.status.pending"),
        icon: "Clock",
      },
      REJECTED: {
        color: "bg-red-500",
        text: t("documents.status.rejected"),
        icon: "XCircle",
      },
      NOT_UPLOADED: {
        color: "bg-gray-500",
        text: t("documents.status.notUploaded"),
        icon: "Upload",
      },
    };

    const config = statusConfig[status] || statusConfig.NOT_UPLOADED;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.color} text-white text-xs`}
      >
        <Icon name={config.icon} size={12} />
        {config.text}
      </div>
    );
  };

  /* =========================================================
     File Upload
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
     Cancel
  ========================================================= */
  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  /* =========================================================
     Save
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);

    const payload = {
      ...documents,
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
            ✏ {t("common.edit")}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {t("common.save")}
            </Button>
          </div>
        )}
      </div>

      {/* ================= AADHAAR ================= */}
      <div className="card p-4 md:p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {t("documents.aadhaar.title")}
          </h3>
          {getStatusBadge(formData.aadhaar.status)}
        </div>

        <Input
          disabled={!isEditing}
          label={t("documents.aadhaar.number")}
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
          <h3 className="text-lg font-semibold">
            {t("documents.pan.title")}
          </h3>
          {getStatusBadge(formData.pan.status)}
        </div>

        <Input
          disabled={!isEditing}
          label={t("documents.pan.number")}
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
        <h3 className="text-lg font-semibold mb-4">
          {t("documents.bank.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            disabled={!isEditing}
            label={t("documents.bank.accountHolderName")}
            value={formData.bankDetails.accountHolderName}
            onChange={(e) =>
              handleInputChange(
                "bankDetails",
                "accountHolderName",
                e.target.value
              )
            }
          />
          <Input
            disabled={!isEditing}
            label={t("documents.bank.accountNumber")}
            value={formData.bankDetails.accountNumber}
            onChange={(e) =>
              handleInputChange(
                "bankDetails",
                "accountNumber",
                e.target.value
              )
            }
          />
          <Input
            disabled={!isEditing}
            label={t("documents.bank.ifsc")}
            value={formData.bankDetails.ifscCode}
            onChange={(e) =>
              handleInputChange(
                "bankDetails",
                "ifscCode",
                e.target.value.toUpperCase()
              )
            }
          />
          <Input
            disabled={!isEditing}
            label={t("documents.bank.bankName")}
            value={formData.bankDetails.bankName}
            onChange={(e) =>
              handleInputChange(
                "bankDetails",
                "bankName",
                e.target.value
              )
            }
          />
        </div>
      </div>
    </form>
  );
};

export default DocumentsVerificationTab;
