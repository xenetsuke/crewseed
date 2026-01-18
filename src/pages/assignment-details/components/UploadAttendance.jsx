import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import heic2any from "heic2any";

/**
 * UploadAttendance
 * - Converts HEIC → JPEG automatically (iPhone safe)
 * - Allows upload only when status === NOT_STARTED
 * - Shows immediate success UI
 */
const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Allow upload only if attendance not started & not already uploaded
  const canUpload = status === "NOT_STARTED" && !uploadSuccess;

  /* =========================
     HEIC → JPEG CONVERSION
  ========================= */
  const convertIfHeic = async (file) => {
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (!isHeic) return file;

    try {
      const jpegBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      return new File([jpegBlob], "attendance.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (err) {
      console.error("❌ HEIC conversion failed", err);
      throw new Error("HEIC_CONVERSION_FAILED");
    }
  };

  /* =========================
     FILE PICK HANDLER
  ========================= */
  const handleFileSelect = async (event) => {
    let file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 📍 Optional GPS capture (non-blocking)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("📍 GPS:", pos.coords.latitude, pos.coords.longitude);
        },
        () => console.warn("⚠️ GPS denied")
      );
    }

    try {
      // 🔥 Convert HEIC → JPEG if needed
      file = await convertIfHeic(file);

      // 🚀 Upload to backend
      await onUpload(file);

      // ✅ Instant UI feedback
      setUploadSuccess(true);
    } catch (error) {
      console.error("❌ Upload failed", error);
      alert("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Hidden File Input */}
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
