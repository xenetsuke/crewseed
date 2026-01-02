import React from "react";
import Icon from "../../../components/AppIcon";

const JobDescription = ({ jobData }) => {
  if (!jobData) return null;

  const {
    description = "Job details coming soon...",
    responsibilities = [],
    requirements = {}
  } = jobData;

  const {
    experience,
    physical = [],
    skills = [],
    education,
    certifications = []
  } = requirements;

  // Helper to capitalize formatted experience string
  const formatExperience = (text) =>
    text ? text.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase()) : "Not specified";

  return (
    <div className="card p-6 mb-6">
      
      {/* ⭐ JOB DESCRIPTION */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="FileText" size={24} className="text-primary" />
        Job Description
      </h2>
      <p className="text-muted-foreground mb-6 whitespace-pre-line">
        {description}
      </p>

      {/* 📝 RESPONSIBILITIES */}
      {responsibilities.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="ListChecks" size={20} className="text-success" />
            Key Responsibilities
          </h3>

          <ul className="space-y-2 mb-6">
            {responsibilities.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon
                  name="CheckCircle"
                  size={18}
                  className="text-success mt-0.5 flex-shrink-0"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 📌 REQUIREMENTS SECTION */}
      {(experience || physical.length > 0 || skills.length > 0 || education || certifications.length > 0) && (
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="ClipboardList" size={20} className="text-primary" />
          Requirements & Qualifications
        </h3>
      )}

      <div className="space-y-5">
        
        {/* EXPERIENCE */}
        {experience && (
          <div>
            <h4 className="font-medium mb-1">Experience</h4>
            <p className="text-muted-foreground">
              {formatExperience(experience)}
            </p>
          </div>
        )}

        {/* PHYSICAL REQUIREMENTS */}
        {physical.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Physical Requirements</h4>
            <ul className="space-y-2">
              {physical.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <Icon
                    name="Activity"
                    size={18}
                    className="text-secondary mt-0.5"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Skills Required</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {education && (
          <div>
            <h4 className="font-medium mb-1">Education</h4>
            <p className="text-muted-foreground">{education}</p>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Certifications</h4>
            <ul className="space-y-2">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex gap-2">
                  <Icon
                    name="Award"
                    size={18}
                    className="text-warning mt-0.5"
                  />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FALLBACK IF EMPTY */}
        {!experience && !physical.length && !skills.length && !education && !certifications.length && (
          <p className="text-muted-foreground text-sm">
            Details will be provided soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDescription;
