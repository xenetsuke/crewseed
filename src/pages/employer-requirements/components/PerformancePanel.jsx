import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformancePanel = ({ analytics }) => {
  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Analytics</h3>
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          View Details
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
      <div className="space-y-4">
        {analytics?.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{metric?.label}</span>
              <span className="font-semibold">{metric?.value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  metric?.trend === 'up' ? 'bg-success' : 
                  metric?.trend === 'down' ? 'bg-error' : 'bg-primary'
                }`}
                style={{ width: `${metric?.percentage}%` }}
              />
            </div>
            {metric?.change && (
              <div className="flex items-center gap-1 text-xs">
                <Icon
                  name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
                  size={12}
                  color={metric?.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
                />
                <span className={metric?.trend === 'up' ? 'text-success' : 'text-error'}>
                  {metric?.change} from last month
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="text-sm font-semibold">Top Performing Posts</h4>
        {analytics?.slice(0, 3)?.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-warning/20 text-warning' :
                index === 1 ? 'bg-muted text-muted-foreground': 'bg-primary/10 text-primary'
              }`}>
                {index + 1}
              </div>
              <span className="text-muted-foreground">{item?.label}</span>
            </div>
            <span className="font-medium">{item?.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformancePanel;