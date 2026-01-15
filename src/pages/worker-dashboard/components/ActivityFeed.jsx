import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { useTranslation } from "react-i18next";

const ActivityFeed = ({ activities = [] }) => {
  const navigate = useNavigate();
const { t } = useTranslation();

  useEffect(() => {
    console.log("📊 [ActivityFeed] Received Activities:", activities);
  }, [activities]);

  const getActivityIcon = (type) => {
    const iconMap = {
      application: 'Send',
      match: 'CheckCircle',
      view: 'Eye',
      message: 'MessageSquare',
      update: 'Bell',
      saved: 'Bookmark',
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      application: 'var(--color-primary)',
      match: 'var(--color-success)',
      view: 'var(--color-accent)',
      message: 'var(--color-secondary)',
      update: 'var(--color-warning)',
      saved: 'var(--color-primary)',
    };
    return colorMap?.[type] || 'var(--color-muted-foreground)';
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return `Just now`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleAction = (activity) => {
    console.log("🖱️ [ActivityFeed] Action Triggered:", activity);
    if (activity.jobId) {
      navigate('/mobile-job-details', { state: { assignmentId: activity.jobId } });
    } else if (activity.route) {
      navigate(activity.route);
    }
  };

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon name="Activity" size={24} className="text-primary" />
          Recent Activity
        </h2>
        <button 
          onClick={() => navigate('/worker-assignments')}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <Icon name="Inbox" size={48} className="mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border cursor-pointer"
              onClick={() => handleAction(activity)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: `${getActivityColor(activity?.type)}20`,
                  border: `1px solid ${getActivityColor(activity?.type)}30`
                }}
              >
                <Icon
                  name={getActivityIcon(activity?.type)}
                  size={18}
                  style={{ color: getActivityColor(activity?.type) }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-sm font-bold text-foreground truncate">{activity?.title}</p>
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {activity?.description}
                </p>
              </div>

              {(activity?.actionable || activity?.jobId) && (
                <div className="self-center ml-2">
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;