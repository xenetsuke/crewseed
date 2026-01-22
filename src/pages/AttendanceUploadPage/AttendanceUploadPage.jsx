    import React, { useState } from "react";
    import { useParams } from "react-router-dom";
    import { Camera, UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
    import toast from "react-hot-toast";

    const AttendanceUploadPage = () => {
    const { token } = useParams();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | uploading | success

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        uploadPhoto(file);
    };

    const uploadPhoto = async (file) => {
        const form = new FormData();
        form.append("photo", file);

        setUploading(true);
        setStatus("uploading");

        try {
        const response = await fetch(`/api/attendance/public-upload/${token}`, {
            method: "POST",
            body: form,
        });

        if (!response.ok) throw new Error("Failed");

        setStatus("success");
        toast.success("Attendance verified!");
        } catch (error) {
        setStatus("idle");
        toast.error("Upload failed. Please try again.");
        } finally {
        setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        {/* Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-1/3 bg-slate-900 -z-10 rounded-b-[2.5rem]" />

        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden transition-all border border-slate-100">
            <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-slate-900" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Site Verification
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                Take a photo to mark your attendance
                </p>
            </div>

            {/* Upload Area */}
            <div className="relative">
                {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <p className="font-bold text-slate-900">Attendance Marked</p>
                    <p className="text-sm text-slate-500">You can close this window now.</p>
                </div>
                ) : (
                <label className="group relative flex flex-col items-center justify-center w-full aspect-square rounded-3xl border-2 border-dashed border-slate-200 hover:border-slate-900 bg-slate-50 transition-all cursor-pointer overflow-hidden">
                    {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        {uploading && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-xs font-black uppercase tracking-widest">Uploading...</span>
                        </div>
                        )}
                    </>
                    ) : (
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">Open Camera</span>
                        <span className="text-xs text-slate-400 mt-1">Tap here to take photo</span>
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

            {/* Footer Info */}
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                Geo-Tagging Enabled
                </span>
            </div>
            </div>
        </div>
        
        <p className="mt-8 text-xs text-slate-400 font-medium">
            Powered by CrewSeed • {new Date().getFullYear()}
        </p>
        </div>
    );
    };

    export default AttendanceUploadPage;