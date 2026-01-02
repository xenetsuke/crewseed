import React, { useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/**
 * RequirementHeader
 * Logic updated to match JobDTO field names from backend
 */
const RequirementHeader = ({ requirement, onEdit, onRenew, onClose }) => {

  // --------------------------------------------------
  // 🧠 Log to see exactly what the backend returned
  // --------------------------------------------------
  useEffect(() => {
    if (requirement) {
      console.log("✅ Requirement Data Received:", requirement);
    } else {
      console.warn("⚠️ RequirementHeader received null/undefined requirement prop");
    }
  }, [requirement]);

  // If requirement is null, show a loading state instead of crashing
  if (!requirement) {
    return <div className="card p-6 mb-6 animate-pulse bg-gray-100 h-40">Loading header...</div>;
  }

  // --------------------------------------------------
  // 🧠 Logic: Normalize Status
  // --------------------------------------------------
  const rawStatus = requirement?.jobStatus || "DRAFT";
  const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  const getStatusColor = (status) => {
    const s = status.toUpperCase();
    if (s === "ACTIVE" || s === "OPEN") return "badge-success text-white bg-green-600";
    if (s === "CLOSED" || s === "FILLED") return "badge-error text-white bg-red-600";
    return "badge-warning text-black bg-yellow-400";
  };

  // --------------------------------------------------
  // 🧠 Logic: Formatting Values
  // --------------------------------------------------
  // 1. Wage (Matches baseWageAmount & paymentFrequency)
  const wage = requirement?.baseWageAmount || 0;
  const frequency = requirement?.paymentFrequency?.toLowerCase() || "month";
  const compensationText = `₹${wage}/${frequency}`;

  // 2. Helper to clean up ENUMS like "SIX_MONTHS" to "Six Months"
  const formatEnum = (val) => 
    val ? val.replace(/_/g, " ").toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not Specified";

  // 3. Date Formatting
  const postDate = requirement?.createdAt ? new Date(requirement.createdAt).toLocaleDateString('en-IN') : "Recently";

  return (
    <div className="card p-6 mb-6 bg-white border border-slate-200 shadow-sm">

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {requirement?.jobTitle || "Untitled Job"}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(rawStatus)}`}>
              {normalizedStatus}
            </span>
          </div>

          {/* META INFO */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              <span>{requirement?.fullWorkAddress ? `${requirement.fullWorkAddress}` : "Remote/No Location"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>Posted: {postDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>
                {requirement?.shiftStartTime && requirement?.shiftEndTime 
                  ? `${requirement.shiftStartTime.substring(0, 5)} - ${requirement.shiftEndTime.substring(0, 5)}` 
                  : "Hours Not Set"}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCcw"
            iconPosition="left"
            onClick={onRenew}
          >
            Renew
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

      {/* METRICS GRID - 4 PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Compensation */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="IndianRupee" size={18} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Salary</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{compensationText}</p>
        </div>

        {/* 2. Vacancies (Matches numberOfWorkers) */}
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Users" size={18} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Openings</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {requirement?.numberOfWorkers || 0} Positions
          </p>
        </div>

        {/* 3. Experience (Matches experienceLevel) */}
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Briefcase" size={18} className="text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Experience</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatEnum(requirement?.experienceLevel) || "Freshers"}
          </p>
        </div>

        {/* 4. Shift Type (Matches shiftType) */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Timer" size={18} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Shift</span>
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