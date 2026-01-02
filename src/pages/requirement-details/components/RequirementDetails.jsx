import React from 'react';
import Icon from '../../../components/AppIcon';

const RequirementDetails = ({ requirement }) => {
  // 🧠 Helper to render markdown-like bold text and line breaks safely
  const formatDescription = (text) => {
    if (!text) return "No description provided.";
    return text
      .split('\n')
      .map((line, i) => (
        <span key={i}>
          {line.split('**').map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
          )}
          <br />
        </span>
      ));
  };

  return (
    <div className="card p-6 mb-6 bg-white border border-slate-200">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Icon name="FileText" size={24} className="text-blue-600" />
        Detailed Job Information
      </h2>

      <div className="space-y-8">
        {/* OVERVIEW / DESCRIPTION */}
        <div>
          <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3">Overview</h3>
          <div className="text-slate-600 leading-relaxed text-base">
            {formatDescription(requirement?.jobDescription || requirement?.description)}
          </div>
        </div>

        {/* RESPONSIBILITIES - Mapped from primarySkills or specific field */}
        {requirement?.responsibilities?.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3">Key Responsibilities</h3>
            <ul className="space-y-3">
              {requirement.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SKILLS - Styled as Tags */}
        <div>
          <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {requirement?.skills?.length > 0 ? (
              requirement.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-sm italic">No specific skills listed</span>
            )}
          </div>
        </div>

        {/* DOCUMENT REQUIREMENTS */}
        {requirement?.requirements?.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3">Document Requirements</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {requirement.requirements.map((item, index) => (
                <li key={index} className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-slate-200">
                  <Icon name="FileCheck" size={16} className="text-blue-500" />
                  <span className="text-slate-600 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* BENEFITS - Matching the Mobile View Icons Logic */}
        {requirement?.benefits?.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3">Benefits & Perks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requirement.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <Icon name="Gift" size={18} className="text-green-600" />
                  <span className="text-green-800 text-sm font-bold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementDetails;