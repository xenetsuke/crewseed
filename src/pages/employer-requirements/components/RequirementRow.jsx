import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RequirementRow = ({ requirement, onEdit, onPause, onDelete }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: "bg-green-100 text-green-700", icon: "CheckCircle" },
      paused: { class: "bg-yellow-100 text-yellow-700", icon: "PauseCircle" },
      expired: { class: "bg-red-100 text-red-700", icon: "XCircle" },
      draft: { class: "bg-gray-100 text-gray-600", icon: "FileText" },
    };

    const config = statusConfig?.[status] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.class}`}
      >
        <Icon name={config.icon} size={12} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const handleViewDetails = () => {
    navigate(`/requirement-details/${requirement.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (requirement?.id) onDelete(requirement.id);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (requirement?.id) onPause(requirement.id);
  };

  return (
    <>
      <tr className="hover:bg-muted/30 transition-colors border-b border-border last:border-0">
        <td className="px-4 py-4 w-10 hidden sm:table-cell">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </td>

        <td className="px-4 py-4 min-w-[150px] max-w-[250px]">
          <div className="flex flex-col min-w-0">
            <button
              onClick={handleViewDetails}
              className="font-bold text-foreground hover:text-primary transition-colors text-left leading-snug truncate"
            >
              {requirement?.title}
            </button>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span className="truncate">{requirement?.location}</span>
            </div>
          </div>
        </td>

        <td className="px-4 py-4 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap">
          {requirement?.postedDate}
        </td>

        <td className="px-4 py-4">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <Icon name="Users" size={16} />
            <span>{requirement?.applications}</span>
          </button>
        </td>

        <td className="px-4 py-4 hidden sm:table-cell">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon name="Eye" size={16} />
            <span>{requirement?.views}</span>
          </div>
        </td>

        <td className="px-4 py-4">{getStatusBadge(requirement?.status)}</td>

        <td className="px-4 py-4 text-sm text-muted-foreground hidden lg:table-cell whitespace-nowrap">
          {requirement?.expiryDate}
        </td>

        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {/* Desktop View Details Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex h-8 px-3 text-xs font-bold"
              onClick={handleViewDetails}
              iconName="Eye"
            >
              View
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            />
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(requirement?.id)}
                iconName="Edit"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                onClick={handleCloseClick}
                iconName="XCircle"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50"
                onClick={handleDeleteClick}
                iconName="Trash2"
              />
            </div>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-muted/20 border-b border-border">
          <td colSpan="8" className="px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Recent Applications
                </h4>
                <div className="space-y-3">
                  {requirement?.recentApplicants?.length > 0 ? (
                    requirement.recentApplicants.map((applicant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon
                            name="User"
                            size={14}
                            className="text-primary"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {applicant?.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {applicant?.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No recent applicants
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Performance
                </h4>
                <div className="bg-white p-3 rounded-lg border border-border space-y-2.5 shadow-sm text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Conv. Rate</span>
                    <span className="font-bold">
                      {requirement?.metrics?.applicationRate}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 gap-2">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span className="font-bold text-primary">
                      {requirement?.metrics?.qualityScore}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Management
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold px-4"
                    iconName="Eye"
                    onClick={handleViewDetails}
                  >
                    View Full Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-semibold"
                    iconName="Download"
                    onClick={handleViewDetails}
                  >
                    Export List
                  </Button>

                  {/* Mobile-only Management Buttons */}
                  <div className="flex sm:hidden gap-2 w-full mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      iconName="Edit"
                      onClick={() => onEdit(requirement?.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-amber-600"
                      iconName="XCircle"
                      onClick={handleCloseClick}
                    >
                      Close
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-500"
                      iconName="Trash2"
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RequirementRow;
