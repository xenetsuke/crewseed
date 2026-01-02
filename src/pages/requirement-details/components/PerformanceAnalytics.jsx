import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceAnalytics = ({ analytics }) => {
  const getGrowthColor = (growth) => {
    if (!growth) return 'text-slate-400';
    return growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600';
  };

  const getGrowthIcon = (growth) => {
    if (!growth) return 'Minus';
    return growth.startsWith('+') ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="card p-5 sm:p-6 mb-6 bg-white border border-slate-200 shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Icon name="BarChart3" size={22} className="text-blue-600" />
        Performance Analytics
      </h2>

      {/* 🚀 FIXED: Always show 1 column for every screen size */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {[
          { label: 'Total Views', value: analytics?.totalViews, growth: analytics?.viewsGrowth, icon: 'Eye', color: 'blue' },
          { label: 'Applications', value: analytics?.totalApplications, growth: analytics?.applicationsGrowth, icon: 'Users', color: 'indigo' },
          { label: 'Conversion', value: analytics?.conversionRate, growth: analytics?.conversionChange, icon: 'Target', color: 'orange' },
          { label: 'Avg. Match', value: analytics?.avgMatchScore, growth: analytics?.matchScoreChange, icon: 'Award', color: 'emerald' }
        ].map((stat, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-slate-600 flex-shrink-0">
                <Icon name={stat.icon} size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  {stat.label}
                </span>
                <p className="text-2xl font-black text-slate-900 leading-tight">
                  {stat.value || '0'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Icon name={getGrowthIcon(stat.growth)} size={14} className={getGrowthColor(stat.growth)} />
                <span className={`text-sm font-bold ${getGrowthColor(stat.growth)}`}>
                  {stat.growth || '0%'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap uppercase tracking-tighter">
                vs last week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stacked Quality & Recommendations Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Candidate Quality Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
            Candidate Quality
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Experience Match', value: analytics?.experienceMatch, color: 'bg-blue-600' },
              { label: 'Skills Alignment', value: analytics?.skillsMatch, color: 'bg-indigo-600' },
              { label: 'Location Fit', value: analytics?.locationMatch, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i} className="min-w-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value || '0%'}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: item.value || '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Recommendations Section */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
              <Icon name="Lightbulb" size={20} />
            </div>
            <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Optimization Tips</h4>
          </div>
          
          <ul className="space-y-4">
            {analytics?.recommendations?.length > 0 ? (
              analytics.recommendations.map((text, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-200/50 flex items-center justify-center">
                    <Icon name="ArrowUpRight" size={12} className="text-amber-700" />
                  </div>
                  <span className="text-sm text-amber-800 font-medium leading-normal">
                    {text}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-amber-700 italic">No specific recommendations yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;