import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationAction = ({ applicationStatus, onApply }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      if (onApply) onApply();
    }, 1500);
  };

  const getStatusConfig = () => {
    switch (applicationStatus) {
      case 'applied':
        return {
          icon: 'CheckCircle2',
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          text: 'Application Submitted',
          description: 'Your application is under review. We will contact you soon.',
          showButton: false,
        };
      case 'reviewing':
        return {
          icon: 'Clock',
          color: 'var(--color-warning)',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          text: 'Under Review',
          description: 'Employer is reviewing your application.',
          showButton: false,
        };
      case 'shortlisted':
        return {
          icon: 'Star',
          color: 'var(--color-primary)',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          text: 'Shortlisted',
          description: 'Congratulations! You have been shortlisted for this position.',
          showButton: false,
        };
      default:
        return {
          icon: 'Send',
          color: 'var(--color-primary)',
          bgColor: '',
          borderColor: '',
          text: 'Apply Now',
          description: 'Submit your application for this position.',
          showButton: true,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="sticky top-4">
      <div className="card p-6">
        {!statusConfig?.showButton ? (
          <div className={`p-4 rounded-lg ${statusConfig?.bgColor} border ${statusConfig?.borderColor} mb-4`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon name={statusConfig?.icon} size={24} color={statusConfig?.color} />
              <span className="font-semibold" style={{ color: statusConfig?.color }}>
                {statusConfig?.text}
              </span>
            </div>
            <p className="text-sm text-foreground">{statusConfig?.description}</p>
          </div>
        ) : (
          <>
            <Button
              variant="default"
              fullWidth
              size="lg"
              iconName="Send"
              iconPosition="left"
              loading={isApplying}
              onClick={handleApply}
              className="mb-4"
            >
              Apply Now
            </Button>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {statusConfig?.description}
            </p>
          </>
        )}

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Response Time</span>
            <span className="font-medium">Within 48 hours</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Job Type</span>
            <span className="font-medium">Full-time Contract</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Posted</span>
            <span className="font-medium">2 days ago</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Share this job</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Icon name="Facebook" size={18} color="#1877F2" />
            </button>
            <button className="flex-1 py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Icon name="Twitter" size={18} color="#1DA1F2" />
            </button>
            <button className="flex-1 py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Icon name="Linkedin" size={18} color="#0A66C2" />
            </button>
            <button className="flex-1 py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Icon name="Link" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationAction;