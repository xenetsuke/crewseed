import React from "react";

const AttendanceHistory = ({ attendance }) => (
  <div className="bg-white rounded-2xl border p-5">
    <p className="text-xs font-bold uppercase text-slate-400 mb-3">
      Attendance History
    </p>

    {attendance.map((a, i) => (
      <div key={i} className="flex justify-between text-sm">
        <span>{a.date}</span>
        <span className="font-bold">{a.status}</span>
      </div>
    ))}
  </div>
);

export default AttendanceHistory;
