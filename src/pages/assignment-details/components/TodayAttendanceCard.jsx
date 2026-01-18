import React, { useState } from "react";
import UploadAttendance from "./UploadAttendance";
import { uploadSitePhoto } from "Services/AttendanceService";
import { Camera } from "lucide-react";

const TodayAttendanceCard = ({ assignment }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRecord = assignment.attendance.find(a => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const [previewUrl, setPreviewUrl] = useState(
    todayRecord?.sitePhoto || null
  );

  const handleUpload = async (file) => {
    if (!todayRecord?.attendanceId) {
      console.error("❌ Attendance ID missing — attendance not created yet");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", file);

      await uploadSitePhoto(todayRecord.attendanceId, formData);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } catch (error) {
      console.error("❌ Failed to upload photo", error);
    }
  };

  /* ================= EMPTY STATE ================= */
  if (!todayRecord) {
    return (
      <div className="bg-white rounded-2xl border p-5 shadow-sm text-center">
        <p className="text-xs uppercase font-bold text-slate-400">
          Today’s Attendance
        </p>
        <p className="mt-3 text-sm font-bold text-slate-500">
          Attendance not opened for today yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Please wait for shift start or contact supervisor
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase font-bold text-slate-400">
            Today’s Attendance
          </p>
          <p className="text-lg font-black mt-1">
            {todayRecord.status}
          </p>
        </div>

        {previewUrl && (
          <div className="w-12 h-12 rounded-lg border overflow-hidden bg-slate-100">
            <img
              src={previewUrl}
              alt="Site proof"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-4 relative rounded-xl overflow-hidden border aspect-video bg-slate-50">
          <img
            src={previewUrl}
            alt="Uploaded site photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Live Upload
          </div>
        </div>
      )}

      <div className="mt-4">
        <UploadAttendance
          status={todayRecord.status}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
};

export default TodayAttendanceCard;
