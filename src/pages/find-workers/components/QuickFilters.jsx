import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickFilters = ({ activeFilters = [], onFilterChange }) => {
  const quickFilters = [
    {
      id: 'available-now',
      label: 'Available Now',
      icon: 'Clock',
      description: 'Workers immediately available'
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: 'MapPin',
      description: 'Workers within 10km radius'
    },
    {
      id: 'experienced',
      label: 'Experienced',
      icon: 'Award',
      description: '2+ years experience'
    },
    {
      id: 'high-rated',
      label: 'High Rated',
      icon: 'Star',
      description: '4+ star rating'
    },
    {
      id: 'verified',
      label: 'Verified',
      icon: 'ShieldCheck',
      description: 'Document verified workers'
    }
  ];

  const handleFilterClick = (filterId) => {
    if (onFilterChange) {
      const isActive = activeFilters?.includes(filterId);
      const newFilters = isActive
        ? activeFilters?.filter((f) => f !== filterId)
        : [...activeFilters, filterId];
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Filter" size={18} color="var(--color-muted-foreground)" />
        <h3 className="text-sm font-semibold">Quick Filters</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickFilters?.map((filter) => {
          const isActive = activeFilters?.includes(filter?.id);
          return (
            <button
              key={filter?.id}
              onClick={() => handleFilterClick(filter?.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                ${isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card border-border hover:border-primary hover:bg-primary/5'
                }
              `}
              title={filter?.description}
            >
              <Icon
                name={filter?.icon}
                size={16}
                color={isActive ? 'currentColor' : 'var(--color-muted-foreground)'}
              />
              <span className="text-sm font-medium">{filter?.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickFilters;