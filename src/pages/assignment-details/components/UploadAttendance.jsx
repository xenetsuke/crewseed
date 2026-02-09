import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { normalizeImage } from "utils/imageUtils";
const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const canUpload = status === "NOT_STARTED" || uploadSuccess;
// console.group("⬆️ [UPLOAD CLICK]");
// console.log("Attendance ID:", attendanceId);
// console.log("Raw file from input:", file);
// console.log("File instanceof File:", file instanceof File);
// console.log("File constructor:", file?.constructor?.name);
// console.log("File size:", file?.size);
// console.log("File type:", file?.type);
// console.groupEnd();

  const handleButtonClick = () => {
    if (uploadSuccess) {
      const confirmReplace = window.confirm(
        "A photo is already uploaded. Do you want to replace it?"
      );
      if (!confirmReplace) return;
    }

    fileInputRef.current?.click();
  };

  // const handleFileSelect = async (event) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const confirmUpload = window.confirm(
  //     "Do you want to upload this attendance photo?"
  //   );
  //   if (!confirmUpload) {
  //     event.target.value = "";
  //     return;
  //   }

  //   setUploading(true);

  //   try {
  //     await onUpload(file);
  //     setUploadSuccess(true);
  //   } catch (err) {
  //     console.error("❌ Upload failed", err);
  //     alert("Upload failed. Please retry.");
  //   } finally {
  //     setUploading(false);
  //     event.target.value = "";
  //   }
  // };
const handleFileSelect = async (event) => {
  const rawFile = event.target.files?.[0];
  if (!rawFile) return;

  console.group("⬆️ [UPLOAD CLICK]");
  console.log("Raw file:", rawFile);
  console.log("instanceof File:", rawFile instanceof File);
  console.log("constructor:", rawFile?.constructor?.name);
  console.log("name:", rawFile?.name);
  console.log("size (KB):", rawFile?.size / 1024);
  console.log("type:", rawFile?.type);
  console.groupEnd();

  setUploading(true);

  try {
    const normalized = await normalizeImage(rawFile);

    console.group("🧪 [NORMALIZED IMAGE]");
    console.log("Normalized file:", normalized);
    console.log("instanceof File:", normalized instanceof File);
    console.log("name:", normalized?.name);
    console.log("size (KB):", normalized?.size / 1024);
    console.log("type:", normalized?.type);
    console.groupEnd();

    await onUpload(normalized);
    setUploadSuccess(true);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    alert("Upload failed. Please retry.");
  } finally {
    setUploading(false);
    event.target.value = "";
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
        onClick={handleButtonClick}
        className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 ${
          uploadSuccess
            ? "bg-emerald-600 text-white"
            : uploading
            ? "bg-slate-400 text-white"
            : !canUpload
            ? "bg-slate-200 text-slate-500"
            : "bg-indigo-600 text-white"
        }`}
      >
        <Camera className="w-4 h-4" />
        {uploadSuccess
          ? "Replace Photo"
          : uploading
          ? "Uploading..."
          : "Upload Site Photo"}
      </button>
    </>
  );
};

export default UploadAttendance;
