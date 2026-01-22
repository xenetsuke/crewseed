import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const AttendanceUploadPage = () => {
  const { token } = useParams();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("photo", file);

    setUploading(true);
    setStatus("uploading");

    try {
      console.log("🔑 Upload token:", token);

      const res = await fetch(
        `https://bluc-ysbf.onrender.com/attendance/public-upload/${token}`,
        {
          method: "POST",
          body: form,
        },
      );

      const text = await res.text();
      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        throw new Error(text || "Upload failed");
      }

      setStatus("success");
      toast.success("Attendance uploaded successfully");
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      setStatus("error");
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* Aesthetic Background Element */}
      <div className="fixed top-0 left-0 w-full h-1/3 bg-slate-900 -z-10 rounded-b-[3rem]" />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Site Verification
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Take a clear photo to mark attendance
            </p>
          </div>

          {/* Interactive Upload Area */}
          <div className="relative">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="font-bold text-slate-900">Upload Complete</p>
                <p className="text-sm text-slate-500">
                  Your attendance is recorded.
                </p>
              </div>
            ) : (
              <label
                className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                ${status === "error" ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-slate-50 hover:border-slate-400"}`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-10 h-10 animate-spin mb-3" />
                        <span className="text-xs font-black uppercase tracking-widest">
                          Processing...
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-7 h-7 text-slate-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      Open Camera
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Tap to capture site photo
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Status Indicators */}
          {status === "error" && (
            <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-bold uppercase tracking-tight">
                Upload failed. Please try again.
              </p>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-300">
            <ImageIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Secure Verification
            </span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Powered by CrewSeed • {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default AttendanceUploadPage;
