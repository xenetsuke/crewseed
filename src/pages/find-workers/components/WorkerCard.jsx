import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkerCard = ({ worker, onBookmark, onViewProfile }) => {

  // Derived bookmark state from applicationStatus
  const isBookmarked = worker?.applicationStatus === "AVAILABLE";

  const availabilityData = Array.isArray(worker?.availability) 
    ? worker.availability 
    : (worker?.availability ? [worker.availability] : ["Available"]);

    
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-success/10 text-success border-success/20';
      case 'Busy': return 'bg-warning/10 text-warning border-warning/20';
      case 'Unavailable': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Available': return 'bg-success';
      case 'Busy': return 'bg-warning';
      case 'Unavailable': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="bg-card p-6 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 relative group">

      {/* ONLINE STATUS + BOOKMARK LOGIC */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {worker?.isOnline && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 border border-success/20 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-success font-medium">Online</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBookmark?.(worker.id); 
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isBookmarked
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          <Icon
            name="Bookmark"
            size={16}
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted">
            <Image
              src={worker?.picture ? `data:image/jpeg;base64,${worker.picture}` : "/Avatar.png"}
              alt={worker?.fullName || "Worker"}
              className="w-full h-full object-cover"
            />
          </div>

          {worker?.verified !== false && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center border-2 border-card shadow-sm">
              <Icon name="CheckCircle" size={14} color="white" />
            </div>
          )}

          <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-card ${getStatusDot(availabilityData[0])}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold truncate text-foreground">
              {worker?.fullName || "Unnamed Worker"}
            </h3>
            <div className="flex items-center gap-1 text-warning shrink-0">
              <Icon name="Star" size={14} fill="currentColor" />
              <span className="text-sm font-bold">{worker?.rating || 4.5}</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-primary mb-2 truncate">
            {worker?.primaryJobRole || "Professional Worker"}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Icon name="MapPin" size={14} className="text-muted-foreground/70" />
            <span className="truncate">{worker?.currentCity || "Location N/A"}</span>
          </div>
        </div>
      </div>

      {/* AVAILABILITY SECTION */}
      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Availability</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availabilityData.map((slot, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-md transition-colors ${getAvailabilityColor(slot)}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(slot)}`} />
              {slot}
            </span>
          ))}
        </div>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Icon name="Briefcase" size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Experience</span>
        </div>
        <p className="text-sm text-foreground/80 font-medium">
          {worker?.totalExperience ? `${worker.totalExperience} years` : "Entry Level"}
        </p>
      </div>

      {/* SKILLS SECTION */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Icon name="Award" size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Top Skills</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {worker?.skills?.slice(0, 3)?.map((skill, index) => (
            <span key={index} className="px-2 py-0.5 text-[11px] font-bold bg-secondary text-secondary-foreground rounded uppercase">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-2">
        <Button
          variant="default"
          fullWidth
          iconName="Eye"
          onClick={() => onViewProfile?.(worker)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default WorkerCard;