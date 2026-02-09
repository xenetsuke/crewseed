import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { normalizeImage } from "utils/imageUtils";
const UploadAttendance = ({ status, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const canUpload = status === "NOT_STARTED" || uploadSuccess;

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

  setUploading(true);

  try {
    const normalized = await normalizeImage(rawFile);
    await onUpload(normalized); // 🔥 upload compressed jpeg
    setUploadSuccess(true);
  } catch (err) {
    console.error(err);
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
