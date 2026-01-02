import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketInsights = () => {
  const insights = [
    {
      icon: 'TrendingUp',
      iconColor: 'var(--color-success)',
      title: 'Average Wage Trends',
      description: 'Wages up 8% this month',
      detail: '₹850/day avg for skilled workers'
    },
    {
      icon: 'Users',
      iconColor: 'var(--color-primary)',
      title: 'Availability Stats',
      description: '85% of workers available this week',
      detail: 'High availability in your area'
    },
    {
      icon: 'Clock',
      iconColor: 'var(--color-warning)',
      title: 'Response Rates',
      description: 'Workers respond within 2 hours',
      detail: '90% response rate for jobs in this wage range'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="BarChart3" size={18} color="var(--color-primary)" />
        <h3 className="text-sm font-semibold">Market Insights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights?.map((insight, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Icon name={insight?.icon} size={20} color={insight?.iconColor} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">{insight?.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">{insight?.description}</p>
                <p className="text-xs text-muted-foreground">{insight?.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketInsights;