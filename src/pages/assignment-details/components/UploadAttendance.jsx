import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, Upload } from "lucide-react";

const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Allow upload only if not started AND not already uploaded locally
  const canUpload = status === "NOT_STARTED" && !uploadSuccess;

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 📍 Capture GPS (optional)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("GPS:", pos.coords.latitude, pos.coords.longitude);
      },
      () => console.warn("GPS denied")
    );

    // 🕒 Capture Date & Time
    const checkInTime = new Date().toISOString();

    try {
      await onUpload(file, checkInTime);

      // ✅ IMMEDIATE UI SUCCESS
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileSelect}
      />

      <button
        disabled={!canUpload || uploading}
        onClick={() => fileInputRef.current.click()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition
          ${
            uploadSuccess
              ? "bg-emerald-600 text-white"
              : !canUpload
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {uploadSuccess ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Uploaded Successfully
          </>
        ) : uploading ? (
          <>
            <Upload className="w-5 h-5 animate-pulse" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Upload Site Photo
          </>
        )}
      </button>
    </>
  );
};

export default UploadAttendance;
