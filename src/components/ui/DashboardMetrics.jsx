import React from 'react';
import Icon from '../AppIcon';

const DashboardMetrics = ({ metrics = [] }) => {
  const getIconColor = (trend) => {
    if (trend === 'up') return 'var(--color-success)';
    if (trend === 'down') return 'var(--color-error)';
    return 'var(--color-muted-foreground)';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics?.map((metric, index) => (
        <div
          key={index}
          className="card p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                metric?.bgColor || 'bg-primary/10'
              }`}
            >
              <Icon
                name={metric?.icon}
                size={24}
                color={metric?.iconColor || 'var(--color-primary)'}
              />
            </div>
            {metric?.trend && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  metric?.trend === 'up' ?'bg-success/10 text-success'
                    : metric?.trend === 'down' ?'bg-error/10 text-error' :'bg-muted text-muted-foreground'
                }`}
              >
                <Icon
                  name={getTrendIcon(metric?.trend)}
                  size={14}
                  color={getIconColor(metric?.trend)}
                />
                <span>{metric?.trendValue}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{metric?.label}</p>
            <p className="text-3xl font-bold">{metric?.value}</p>
            {metric?.description && (
              <p className="text-xs text-muted-foreground mt-2">
                {metric?.description}
              </p>
            )}
          </div>

          {metric?.action && (
            <button
              onClick={metric?.action?.onClick}
              className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
            >
              {metric?.action?.label}
              <Icon name="ArrowRight" size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;