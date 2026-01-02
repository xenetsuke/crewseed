import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { className: 'badge-primary', icon: 'Sparkles' },
      applied: { className: 'badge-warning', icon: 'Clock' },
      matched: { className: 'badge-success', icon: 'CheckCircle' },
    };
    return statusConfig?.[status] || statusConfig?.new;
  };

  const statusInfo = getStatusBadge(assignment?.status);

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={assignment?.companyLogo}
            alt={assignment?.companyLogoAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-semibold truncate">{assignment?.title}</h3>
            {assignment?.status && (
              <span className={`badge ${statusInfo?.className} flex-shrink-0`}>
                <Icon name={statusInfo?.icon} size={12} className="mr-1" />
                {assignment?.status}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{assignment?.company}</p>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" />
          <span className="text-muted-foreground">{assignment?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Icon name="DollarSign" size={16} color="var(--color-success)" />
          <span className="font-semibold text-success">{assignment?.payRate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
          <span className="text-muted-foreground">
            Deadline: {assignment?.deadline}
          </span>
        </div>
        {assignment?.jobType && (
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Briefcase" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">{assignment?.jobType}</span>
          </div>
        )}
      </div>
      {assignment?.skills && assignment?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {assignment?.skills?.slice(0, 3)?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
            >
              {skill}
            </span>
          ))}
          {assignment?.skills?.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
              +{assignment?.skills?.length - 3} more
            </span>
          )}
        </div>
      )}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={() => navigate('/assignment-details', { state: { assignment } })}
        >
          View Details
        </Button>
        {assignment?.status !== 'applied' && (
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Send"
            iconPosition="left"
            onClick={() => navigate('/assignment-details', { state: { assignment, applyMode: true } })}
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;