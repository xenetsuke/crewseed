import React from "react";
import Icon from "../../../components/AppIcon";

const ApplicationRequirements = ({ requirements, deadline, applicants }) => {
  if (!requirements) return null;

  const {
    experience,
    certifications = [],
    documents = [],
  } = requirements;

  const formatExperience = (text) =>
    text
      ? text.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())
      : "Not specified";

  return (
    <div className="card p-6 mb-6">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="ClipboardList" size={24} className="text-primary" />
        Application Requirements
      </h2>

      <div className="space-y-5">

        {/* Deadline */}
        {deadline && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-3 mb-1">
              <Icon name="Clock" size={20} className="text-warning" />
              <span className="font-semibold text-warning">Application Deadline</span>
            </div>
            <p className="font-medium">{deadline}</p>
          </div>
        )}

        {/* Applicants Count */}
        {typeof applicants === "number" && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-1">
              <Icon name="Users" size={20} className="text-primary" />
              <span className="font-semibold text-primary">Current Applicants</span>
            </div>
            <p className="font-medium">{applicants} workers applied</p>
          </div>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-3">Required Documents</h3>
            <ul className="space-y-2">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <Icon name="FileText" size={16} className="text-primary" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-3">Certifications Needed</h3>
            <ul className="space-y-2">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <Icon name="Award" size={16} className="text-warning" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {experience && (
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-3">Experience Required</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Icon name="Briefcase" size={20} className="text-secondary" />
              <span className="font-medium">
                {formatExperience(experience)}
              </span>
            </div>
          </div>
        )}

        {/* Fallback when all empty */}
        {!experience && !documents.length && !certifications.length && (
          <p className="text-muted-foreground text-sm">
            No application requirements provided by employer.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationRequirements;
