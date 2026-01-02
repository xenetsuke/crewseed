import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const iconConfig = {
      application: { name: 'FileText', color: 'var(--color-primary)' },
      profile_view: { name: 'Eye', color: 'var(--color-secondary)' },
      interview: { name: 'Calendar', color: 'var(--color-success)' },
      hired: { name: 'CheckCircle', color: 'var(--color-success)' },
      rejected: { name: 'XCircle', color: 'var(--color-destructive)' },
      compare: { name: 'GitCompare', color: 'var(--color-primary)' }
    };
    return iconConfig?.[type] || iconConfig?.application;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: 'High Priority' },
      medium: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Medium' },
      low: { class: 'bg-primary/10 text-primary border-primary/20', label: 'Low' }
    };
    return priorityConfig?.[priority] || null;
  };

  return (
    /* 🔹 Added h-full and flex column to prevent content being pushed out */
    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-full max-h-[850px]">
      
      {/* HEADER: Sticky or Fixed padding */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="Activity" size={22} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          </div>
          <span className="text-[10px] font-black bg-muted px-2 py-1 rounded text-muted-foreground uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      {/* 🔹 SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide space-y-0">
        {activities?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground italic">No recent activity to show.</p>
          </div>
        ) : (
          activities?.map((activity, index) => {
            const activityIcon = getActivityIcon(activity?.type);
            const priorityBadge = getPriorityBadge(activity?.priority);
            const isLast = index === activities.length - 1;

            return (
              <div key={activity?.id} className="group flex items-start gap-4 relative pb-8">
                
                {/* TIMELINE VISUAL */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border group-hover:scale-105 transition-transform z-10 relative">
                    <Icon name={activityIcon?.name} size={18} style={{ color: activityIcon?.color }} />
                  </div>
                  
                  {/* 🔹 Vertical Line: Only show if not last item */}
                  {!isLast && (
                    <div className="absolute top-10 w-[2px] h-full bg-border/60" />
                  )}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-foreground leading-tight truncate">
                      {activity?.title}
                    </p>
                    {priorityBadge && (
                      <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${priorityBadge?.class}`}>
                        {priorityBadge?.label}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {activity?.description}
                  </p>

                  {/* CANDIDATE INFO */}
                  {activity?.candidate && (
                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-border bg-background flex-shrink-0">
                        <Image
                          src={
                            activity?.candidate?.avatar?.startsWith('data:') 
                              ? activity.candidate.avatar 
                              : activity?.candidate?.picture 
                              ? `data:image/jpeg;base64,${activity.candidate.picture}`
                              : "/Avatar.png"
                          }
                          alt={activity?.candidate?.name || "Worker"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-foreground truncate">
                          {activity?.candidate?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-[9px] font-black text-primary uppercase truncate tracking-tighter">
                          {activity?.candidate?.position || activity?.candidate?.primaryJobRole}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Icon name="Clock" size={12} />
                    <span>{activity?.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-6 pt-2 border-t border-border/50 bg-card">
        <button className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white rounded-xl border border-primary/20 transition-all flex items-center justify-center gap-2 group shadow-sm">
          <span>View All Log</span>
          <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;