import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationHistoryTab = ({ applications, metrics }) => {
  const getStatusColor = (status) => {
    const colors = {
      accepted: 'badge-success',
      pending: 'badge-warning',
      rejected: 'badge-error',
      withdrawn: 'badge',
    };
    return colors?.[status] || 'badge';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
                <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold">{metric?.value}</p>
                <p className="text-sm text-muted-foreground">{metric?.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        <div className="space-y-4">
          {applications?.map((app) => (
            <div
              key={app?.id}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{app?.jobTitle}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {app?.company} • {app?.location}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>Applied on {app?.appliedDate}</span>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(app?.status)}`}>
                  {app?.status?.charAt(0)?.toUpperCase() + app?.status?.slice(1)}
                </span>
              </div>
              {app?.feedback && (
                <div className="mt-3 p-3 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">{app?.feedback}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                  View Details
                </Button>
                {app?.status === 'pending' && (
                  <Button variant="ghost" size="sm" iconName="X" iconPosition="left">
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {applications?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Briefcase" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="mb-4">No applications yet. Start applying to jobs to see your history here.</p>
          <Button variant="default" iconName="Search" iconPosition="left">
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationHistoryTab;