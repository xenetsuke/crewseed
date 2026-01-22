import { useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const AttendanceUploadPage = () => {
  const { token } = useParams();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    const form = new FormData();
    form.append("photo", file);

    setUploading(true);
    try {
      await fetch(`/attendance/public-upload/${token}`, {
        method: "POST",
        body: form,
      });
      toast.success("Attendance uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="font-black text-lg mb-4">
          Upload Attendance Photo
        </h2>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleUpload(e.target.files[0])}
          disabled={uploading}
          className="w-full"
        />

        {uploading && (
          <p className="mt-3 text-sm text-slate-500">Uploading…</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceUploadPage;
