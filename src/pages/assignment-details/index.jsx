import React, { useEffect, useState } from "react";
import WorkerSidebar from "components/navigation/WorkerSidebar";
import { MapPin, ChevronDown, Briefcase, Wallet, Clock, LayoutGrid } from "lucide-react";
import { cn } from "utils/cn";

import AssignmentHeader from "./components/AssignmentHeader";
import TodayAttendanceCard from "./components/TodayAttendanceCard";
import AttendanceCalendar from "./components/AttendanceCalendar";
import AttendanceHistory from "./components/AttendanceHistory";

import { getMyAttendanceHistory } from "Services/AttendanceService";

const EMPTY_STATE = [];

const AssignmentDetails = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getMyAttendanceHistory()
      .then((res) => {
        const data = res.data || [];
        if (!data.length) {
          setAssignments(EMPTY_STATE);
          return;
        }

        const map = {};
        data.forEach((a) => {
          const snapshot = a.jobSnapshot || {};
          if (!map[a.assignmentId]) {
            map[a.assignmentId] = {
              assignmentId: a.assignmentId,
              jobTitle: snapshot.jobTitle || "Archived Job",
              location: snapshot.location || "Location Unavailable",
              shift: snapshot.shift || "Shift Unavailable",
              companyName: snapshot.companyName || "Company",
              managerName: snapshot.managerName || "Manage",
              role: a.hrSnapshot?.workerRole || "Worker",
              dailyWage: a.hrSnapshot?.dailyWage || 0,
              supervisor: "Site Supervisor",
              attendance: [],
            };
          }

       map[a.assignmentId].attendance.push({
  attendanceId: a.id,
  date: a.attendanceDate,
  status: a.status,
  checkIn: a.checkInTime
    ? new Date(a.checkInTime).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
    : null,
  checkOut: a.checkOutTime
    ? new Date(a.checkOutTime).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
    : null,
  siteVerified: a.sitePhotoUploaded,
});

        });

        setAssignments(Object.values(map));
      })
      .catch(() => {
        setAssignments(EMPTY_STATE);
      });
  }, []);

  const getPayroll = (assignment) => {
    const approvedDays = assignment.attendance.filter(
      (a) => a.status === "APPROVED"
    ).length;

    return {
      verifiedDays: approvedDays,
      gross: approvedDays * assignment.dailyWage,
    };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Fixed Layer */}
      <div className="fixed inset-y-0 left-0 z-50 shadow-2xl shadow-blue-900/10">
        <WorkerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "transition-all duration-500 ease-in-out min-h-screen",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {/* Top Sticky Header for context */}
        {/* <div className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 mb-4">
           <div className="max-w-5xl mx-auto flex items-center gap-2 text-blue-600">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Worker Dashboard</span>
           </div>
        </div> */}

        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          {/* Main Typography Header */}
          <header className="mb-12 relative">
            <div className="absolute -left-4 top-0 w-1 h-12 bg-blue-600 rounded-full hidden md:block" />
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              My <span className="text-blue-600">Assignments</span>
            </h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">
              Manage your active work contracts and verify attendance.
            </p>
          </header>

          {assignments.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-inner">
              <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Briefcase className="text-blue-400 w-10 h-10" />
              </div>
              <h3 className="text-slate-900 font-black text-xl">No active assignments</h3>
              <p className="text-slate-400 mt-2 max-w-xs mx-auto">
                Once you are assigned to a job, your schedule and earnings will appear here.
              </p>
            </div>
          )}

          <div className="space-y-8">
            {assignments.map((assignment) => {
              const isOpen = expandedAssignment === assignment.assignmentId;
              const payroll = getPayroll(assignment);

              return (
                <div
                  key={assignment.assignmentId}
                  className={cn(
                    "bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                    isOpen 
                      ? "shadow-[0_20px_50px_rgba(30,58,138,0.1)] border-blue-200 ring-1 ring-blue-100" 
                      : "shadow-sm hover:shadow-xl hover:-translate-y-1 border-slate-200"
                  )}
                >
                  {/* ================= CARD HEADER ================= */}
                  <div
                    className="p-6 md:p-10 flex items-center justify-between cursor-pointer group"
                    onClick={() =>
                      setExpandedAssignment(isOpen ? null : assignment.assignmentId)
                    }
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-lg",
                        isOpen 
                          ? "bg-blue-600 text-white shadow-blue-200 scale-110" 
                          : "bg-slate-50 text-blue-600 group-hover:bg-blue-50 shadow-transparent"
                      )}>
                        <MapPin className={cn("transition-transform duration-500", isOpen ? "w-9 h-9" : "w-8 h-8")} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md uppercase tracking-wider">Active Job</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                          {assignment.jobTitle}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {assignment.companyName}
                          </span>
                          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold text-slate-600">{assignment.shift}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden lg:block">
                        <div className="flex items-center gap-1.5 justify-end text-slate-400 mb-1">
                          <Wallet className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Earnings</span>
                        </div>
                        <p className="font-black text-3xl text-emerald-600 tracking-tighter">
                          ₹{payroll.gross.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                        isOpen 
                          ? "bg-slate-900 border-slate-900 text-white rotate-180" 
                          : "bg-white border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600"
                      )}>
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* ================= CARD BODY ================= */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/40 p-6 md:p-10 space-y-10 animate-in fade-in zoom-in-95 duration-500">
                      <div className="grid grid-cols-1 gap-10">
                        <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100">
                           <AssignmentHeader assignment={assignment} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                          <div className="lg:col-span-5">
                            <TodayAttendanceCard assignment={assignment} />
                          </div>
                          <div className="lg:col-span-7">
                            <AttendanceCalendar attendance={assignment.attendance} />
                          </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                           <AttendanceHistory attendance={assignment.attendance} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentDetails;