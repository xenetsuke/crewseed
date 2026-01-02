import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/**
 * RequirementCard
 * -------------------------------------------------
 * Used in EmployerRequirements grid view.
 */
const RequirementCard = ({ requirement, onEdit, onPause, onDelete, onRenew }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        class: "bg-green-100 text-green-700",
        icon: "CheckCircle",
        color: "#15803d",
      },
      paused: {
        class: "bg-yellow-100 text-yellow-700",
        icon: "PauseCircle",
        color: "#a16207",
      },
      expired: {
        class: "bg-red-100 text-red-700",
        icon: "XCircle",
        color: "#b91c1c",
      },
      draft: {
        class: "bg-gray-100 text-gray-600",
        icon: "FileText",
        color: "#4b5563",
      },
    };

    return configs?.[status] || configs.draft;
  };

  const statusConfig = getStatusConfig(requirement?.status);

  const handleViewApplications = () => {
    navigate(`/requirement-details/${requirement.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      {/* HEADER: TITLE + STATUS */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <button
            onClick={handleViewApplications}
            className="text-lg font-bold text-foreground hover:text-primary transition-colors text-left leading-tight block truncate"
          >
            {requirement?.title || "Job Title Not Provided"}
          </button>

          <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span className="truncate">{requirement?.location || "Location not specified"}</span>
          </div>
        </div>

        <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.class}`}>
          <Icon name={statusConfig.icon} size={12} />
          {requirement?.status ? requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1) : "Draft"}
        </span>
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4 py-1">
        <div className="space-y-0.5">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Posted Date</p>
          <p className="text-sm font-medium">{requirement?.postedDate || "Recently"}</p>
        </div>

        <div className="space-y-0.5">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Expiry Date</p>
          <p className="text-sm font-medium">{requirement?.expiryDate || "Not set"}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={handleViewApplications}
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80"
          >
            <Icon name="Users" size={16} />
            <span>{requirement?.applications ?? 0} <span className="font-normal text-muted-foreground">Apps</span></span>
          </button>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon name="Eye" size={16} />
            <span>{requirement?.views ?? 0} <span className="font-normal">Views</span></span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          iconName="Edit"
          onClick={() => onEdit(requirement?.id)}
        >
          Edit
        </Button>

        {requirement?.status === "active" && (
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            iconName="Pause"
            onClick={() => onPause(requirement?.id)}
          >
            Pause
          </Button>
        )}

        {requirement?.status === "expired" && (
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            iconName="RefreshCw"
            onClick={() => onRenew(requirement?.id)}
          >
            Renew
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
          iconName="Trash2"
          onClick={() => onDelete(requirement?.id)}
        />
      </div>
    </div>
  );
};

export default RequirementCard;