import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import heic2any from "heic2any";

const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const canUpload = status === "NOT_STARTED" && !uploadSuccess;

  const convertIfHeic = async (file) => {
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic");

    if (!isHeic) return file;

    const jpegBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    return new File([jpegBlob], "attendance.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const handleFileSelect = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      file = await convertIfHeic(file);

      console.log("📸 Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!file.size) throw new Error("EMPTY_FILE_FROM_IOS");

      await onUpload(file);
      setUploadSuccess(true);
    } catch (err) {
      console.error("❌ Upload failed", err);
      alert("Photo upload failed. Please retry.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileSelect}
      />

      <button
        disabled={!canUpload || uploading}
        onClick={() => fileInputRef.current.click()}
        className={`w-full py-3 rounded-xl font-black flex gap-2 justify-center
          ${
            uploadSuccess
              ? "bg-emerald-600 text-white"
              : !canUpload
              ? "bg-slate-200 text-slate-500"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {uploadSuccess ? (
          <>
            <CheckCircle2 /> Uploaded
          </>
        ) : uploading ? (
          <>
            <Upload className="animate-pulse" /> Uploading...
          </>
        ) : (
          <>
            <Camera /> Upload Site Photo
          </>
        )}
      </button>
    </>
  );
};

export default UploadAttendance;
