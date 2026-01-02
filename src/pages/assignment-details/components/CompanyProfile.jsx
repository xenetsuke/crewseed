import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const CompanyProfile = ({ company }) => {
  if (!company) return null;

  const mockRatings = [
    { category: "Work Environment", score: 4.3 },
    { category: "Pay & Benefits", score: 4.2 },
    { category: "Safety Standards", score: 4.5 },
    { category: "Management", score: 4.1 }
  ];

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Building2" size={24} className="text-primary" />
        About Company
      </h2>

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
          <Image
            src={company.logo}
            alt="Company Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{company.name}</h3>
          <p className="text-sm text-muted-foreground">
            {company.location || "Multiple Work Locations"}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {company.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Industry</p>
          <p className="font-semibold">{company.industry}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Company Size</p>
          <p className="font-semibold">{company.size}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Founded</p>
          <p className="font-semibold">{company.founded}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Active Jobs</p>
          <p className="font-semibold">{company.activeJobs} openings</p>
        </div>
      </div>

      {/* Ratings */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Worker Ratings</span>

          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="font-semibold">{company.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({company.reviewCount})
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {(company.ratingBreakdown || mockRatings).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28">
                {item.category}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning"
                  style={{ width: `${(item.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">{item.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Profile CTA */}
      <button className="mt-6 btn btn-outline w-full flex items-center justify-center gap-2">
        <Icon name="ExternalLink" size={18} />
        View Full Company Profile
      </button>
    </div>
  );
};

export default CompanyProfile;
