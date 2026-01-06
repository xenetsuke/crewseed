import React, { useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RequirementHeader = ({ requirement, onEdit, onClose }) => {
  if (!requirement) {
    return (
      <div className="card p-6 mb-6 animate-pulse bg-gray-100 h-40">
        Loading header...
      </div>
    );
  }

  const rawStatus = requirement?.jobStatus || "DRAFT";
  const normalizedStatus =
    rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  const getStatusColor = (status) => {
    const s = status.toUpperCase();
    if (s === "ACTIVE" || s === "OPEN")
      return "badge-success text-white bg-green-600";
    if (s === "CLOSED" || s === "FILLED" || s === "EXPIRED")
      return "badge-error text-white bg-red-600";
    return "badge-warning text-black bg-yellow-400";
  };

  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";
    if (dateValue === "Just now") return "Just now";

    let cleanDate = dateValue;
    if (typeof dateValue === "string") {
      cleanDate = dateValue.replace(",", "");
    }

    const now = new Date();
    const posted = new Date(cleanDate);

    if (isNaN(posted.getTime())) return dateValue;

    const diffInMs = now - posted;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 60) {
      return diffInMins <= 1 ? "Just now" : `${diffInMins}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return posted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const wage = requirement?.baseWageAmount || 0;
  const frequency = requirement?.paymentFrequency?.toLowerCase() || "month";
  const compensationText = `₹${wage}/${frequency}`;

  const formatEnum = (val) =>
    val
      ? val
          .replace(/_/g, " ")
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Not Specified";

  const postDate = getRelativeTime(
    requirement?.postedDate || requirement?.createdAt
  );

  return (
    <div className="card p-6 mb-6 bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {requirement?.jobTitle || "Untitled Job"}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                rawStatus
              )}`}
            >
              {normalizedStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              <span>{requirement?.fullWorkAddress || "Remote"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>Posted: {postDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>
                {requirement?.shiftStartTime && requirement?.shiftEndTime
                  ? `${requirement.shiftStartTime.substring(
                      0,
                      5
                    )} - ${requirement.shiftEndTime.substring(0, 5)}`
                  : "Hours Not Set"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCcw"
            iconPosition="left"
            onClick={onEdit}
          >
            Edit/Renew
          </Button>
          {(rawStatus === "ACTIVE" || rawStatus === "OPEN") && (
            <Button
              variant="destructive"
              size="sm"
              iconName="XCircle"
              iconPosition="left"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="IndianRupee" size={18} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase">
              Salary
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">{compensationText}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Users" size={18} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase">
              Openings
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {requirement?.numberOfWorkers || 0} Positions
          </p>
        </div>
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Briefcase" size={18} className="text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 uppercase">
              Experience
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatEnum(requirement?.experienceLevel) || "Freshers"}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Timer" size={18} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase">
              Shift
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatEnum(requirement?.shiftType) || "Day Shift"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequirementHeader;
