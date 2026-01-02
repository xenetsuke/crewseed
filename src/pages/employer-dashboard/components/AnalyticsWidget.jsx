import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsWidget = () => {
  const timeToFillData = [
    { month: 'Jul', days: 18 },
    { month: 'Aug', days: 22 },
    { month: 'Sep', days: 15 },
    { month: 'Oct', days: 20 },
    { month: 'Nov', days: 14 },
    { month: 'Dec', days: 16 }
  ];

  const conversionData = [
    { stage: 'Applied', count: 245 },
    { stage: 'Screened', count: 180 },
    { stage: 'Interviewed', count: 95 },
    { stage: 'Offered', count: 42 },
    { stage: 'Hired', count: 38 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold">Time to Fill</h3>
          </div>
          <span className="text-sm text-muted-foreground">Last 6 months</span>
        </div>
        <div className="w-full h-64" aria-label="Time to Fill Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeToFillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="days" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Average time to fill: <span className="font-semibold text-foreground">17.5 days</span></p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
            <h3 className="text-lg font-semibold">Application Funnel</h3>
          </div>
          <span className="text-sm text-muted-foreground">This month</span>
        </div>
        <div className="w-full h-64" aria-label="Application Conversion Funnel">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="count" stroke="var(--color-success)" strokeWidth={2} dot={{ fill: 'var(--color-success)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Conversion rate: <span className="font-semibold text-foreground">15.5%</span> (Applied to Hired)</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;