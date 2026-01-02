import React from "react";
import Icon from "../../../components/AppIcon";

const BenefitsSection = ({ benefits }) => {
  if (!benefits || benefits.length === 0) {
    return (
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Gift" size={24} className="text-primary" />
          Benefits & Facilities
        </h2>
        <p className="text-muted-foreground">No benefits provided by employer</p>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Gift" size={24} className="text-primary" />
        Benefits & Facilities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon
                name={benefit.icon || "CheckCircle"}
                size={22}
                className="text-primary"
              />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold mb-1">{benefit.label}</h4>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional - Only show if wage incentives exist */}
      <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
        <div className="flex items-start gap-3">
          <Icon name="TrendingUp" size={20} className="text-success" />
          <div>
            <p className="font-medium text-success mb-1">Performance Incentives</p>
            <p className="text-sm text-foreground">
              Incentives may be available based on performance and attendance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
