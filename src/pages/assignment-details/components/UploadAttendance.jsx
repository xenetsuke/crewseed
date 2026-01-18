import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, Upload } from "lucide-react";

const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const canUpload = status === "NOT_STARTED";

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 📍 Capture GPS (optional but logged)
    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log("GPS:", pos.coords.latitude, pos.coords.longitude);
      },
      err => console.warn("GPS denied")
    );

    // 🕒 Capture Date & Time
    const checkInTime = new Date().toISOString();

    await onUpload(file, checkInTime);
    setUploading(false);
  };

  return (
    <>
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"   // 📷 opens camera on mobile
        hidden
        onChange={handleFileSelect}
      />

      <button
        disabled={!canUpload || uploading}
        onClick={() => fileInputRef.current.click()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition
          ${
            !canUpload
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {!canUpload ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Attendance Submitted
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
