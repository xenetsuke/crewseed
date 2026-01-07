import React, { useState } from "react";
import { useQueries } from "@tanstack/react-query"; // ✅ For efficient parallel fetching
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

// Backend
import { getProfile } from "../../../Services/ProfileService";

const ApplicationsList = ({
  applications = [],
  onApprove,
  onReject,
  onSelect,
  onChangeStatus,
  onScheduleInterview,
  onViewProfile,
}) => {
  const [expandedStatus, setExpandedStatus] = useState({});

  /* =========================================================
      REACT QUERY: PARALLEL PROFILE FETCHING
  ========================================================= */
  const userQueries = useQueries({
    queries: applications.map((app) => ({
      queryKey: ["workerProfile", app.applicantId],
      queryFn: () => getProfile(app.applicantId),
      staleTime: 1000 * 60 * 10, // Cache profiles for 10 minutes
      enabled: !!app.applicantId,
    })),
  });

  // Determine if we are still loading any profiles
  const loading = userQueries.some((query) => query.isLoading);

  // Map the results back into a usable object
  const profiles = applications.reduce((acc, app, index) => {
    const queryResult = userQueries[index];
    if (queryResult?.data) {
      acc[app.applicantId] = queryResult.data;
    }
    return acc;
  }, {});

  if (loading && applications.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading applications...
        </p>
      </div>
    );
  }

  const STATUS_UI = {
    APPLIED: {
      label: "Applied",
      badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: "Clock",
    },
    UNDER_REVIEW: {
      label: "Reviewing",
      badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: "Eye",
    },
    INTERVIEWING: {
      label: "Interview",
      badge: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      icon: "Calendar",
    },
    SELECTED: {
      label: "Selected",
      badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: "CheckCircle",
    },
    REJECTED: {
      label: "Rejected",
      badge: "bg-destructive/10 text-destructive border-destructive/20",
      icon: "XCircle",
    },
    JOINED: {
      label: "Joined",
      badge: "bg-emerald-600 text-white border-emerald-700",
      icon: "UserCheck",
    },
  };

  const getStatusUI = (status) =>
    STATUS_UI[status] || {
      label: status,
      badge: "bg-muted text-muted-foreground border-border",
      icon: "HelpCircle",
    };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border flex items-center justify-between bg-card">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2.5">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Icon name="Users" size={18} className="text-primary" />
          </div>
          Applications
          <span className="text-muted-foreground font-medium text-xs sm:text-sm bg-muted px-2 py-0.5 rounded-full">
            {applications.length}
          </span>
        </h2>
      </div>

      <div className="divide-y divide-border">
        {applications.length === 0 ? (
          <div className="text-center py-16 bg-muted/10">
            <Icon
              name="Inbox"
              size={32}
              className="text-muted-foreground/40 mx-auto mb-4"
            />
            <p className="text-muted-foreground font-semibold">
              No applications yet
            </p>
          </div>
        ) : (
          applications.map((app) => {
            const profile = profiles[app.applicantId];
            if (!profile) return null;

            const statusUI = getStatusUI(app.applicationStatus);
            const worker = { ...app, profile };
            const isExpanded = expandedStatus[app.applicantId] || false;

            return (
              <div
                key={app.applicantId}
                className="group p-4 sm:p-5 hover:bg-muted/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
                  {/* LEFT: PROFILE INFO SECTION */}
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-border shadow-sm">
                        <Image
                          src={
                            profile.picture
                              ? `data:image/jpeg;base64,${profile.picture}`
                              : "/Avatar.png"
                          }
                          alt={profile.fullName || app.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col mb-1">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {profile.fullName || app.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-primary truncate">
                          {profile.primaryJobRole || "General Worker"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground mb-2">
                        <span className="text-[11px] sm:text-xs flex items-center gap-1 font-medium">
                          <Icon name="MapPin" size={12} />{" "}
                          {profile.currentCity || "N/A"}
                        </span>
                        <span className="text-[11px] sm:text-xs flex items-center gap-1 font-medium border-l border-border pl-3">
                          <Icon name="Award" size={12} />{" "}
                          {profile.totalExperience || 0}y Exp
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills?.slice(0, 2).map((skill, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-muted text-muted-foreground border border-border uppercase"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: ACTION & STATUS SECTION */}
                  <div className="flex flex-col gap-3 lg:w-48 lg:pl-6 lg:border-l border-border">
                    <div className="flex items-center lg:justify-center">
                      <span
                        className={`w-full text-center inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${statusUI.badge}`}
                      >
                        <Icon name={statusUI.icon} size={12} /> {statusUI.label}
                      </span>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 lg:w-full h-9 sm:h-10 font-bold text-xs"
                        iconName="Eye"
                        onClick={() => onViewProfile(worker)}
                      >
                        Profile
                      </Button>

                      <Button
                        size="sm"
                        variant={isExpanded ? "default" : "secondary"}
                        className="flex-1 lg:w-full h-9 sm:h-10 font-bold text-xs"
                        iconName={isExpanded ? "ChevronUp" : "Settings2"}
                        onClick={() =>
                          setExpandedStatus((prev) => ({
                            ...prev,
                            [app.applicantId]: !prev[app.applicantId],
                          }))
                        }
                      >
                        {isExpanded ? "Hide" : "Manage"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE WORKFLOW ACTIONS */}
                {(isExpanded || app.applicationStatus === "APPLIED") && (
                  <div className="mt-4 pt-4 border-t border-dashed border-border overflow-x-auto">
                    <div className="flex flex-row items-center gap-2 pb-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 font-bold text-[10px] shrink-0"
                        iconName="CheckCircle"
                        onClick={() => onApprove(app)}
                      >
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 font-bold text-[10px] shrink-0"
                        iconName="UserCheck"
                        onClick={() => onSelect(app)}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100 font-bold text-[10px] shrink-0"
                        iconName="Calendar"
                        onClick={() => onScheduleInterview(worker)}
                      >
                        Interview
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="ml-auto font-bold text-[10px] shrink-0"
                        iconName="Trash2"
                        onClick={() => onReject(app)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
