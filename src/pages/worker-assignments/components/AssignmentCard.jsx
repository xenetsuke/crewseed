import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AssignmentCard = ({ assignment, onApply }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/assignment-details', { state: { assignmentId: assignment?.id } });
  };

  const getStatusBadge = () => {
    if (assignment?.applied) {
      return <span className="badge badge-success">Applied</span>;
    }
    if (assignment?.urgent) {
      return <span className="badge badge-error">Urgent</span>;
    }
    return null;
  };

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
            <h3 className="text-lg font-semibold text-foreground truncate">
              {assignment?.position}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {assignment?.companyName}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={16} />
              <span>{assignment?.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={16} />
              <span>{assignment?.duration}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Hourly Rate</p>
          <p className="text-2xl font-bold text-primary">{assignment?.hourlyRate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Pay</p>
          <p className="text-lg font-semibold text-foreground">
            {assignment?.totalPay}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-2">Key Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {assignment?.requirements?.map((req, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              {req}
            </span>
          ))}
        </div>
      </div>
      {assignment?.shiftSchedule && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-1">Shift Schedule:</p>
          <p className="text-sm text-muted-foreground">{assignment?.shiftSchedule}</p>
        </div>
      )}
      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          onClick={handleViewDetails}
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
        {!assignment?.applied && (
          <Button
            variant="default"
            fullWidth
            onClick={() => onApply(assignment?.id)}
            iconName="Send"
            iconPosition="left"
          >
            Apply Now
          </Button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Posted {assignment?.postedDate}</span>
        <span>{assignment?.applicants} applicants</span>
      </div>
    </div>
  );
};

export default AssignmentCard;