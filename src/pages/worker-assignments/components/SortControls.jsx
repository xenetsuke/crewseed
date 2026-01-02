import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const SortControls = ({ sortBy, onSortChange, resultCount }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'pay-high', label: 'Highest Pay' },
    { value: 'pay-low', label: 'Lowest Pay' },
    { value: 'distance', label: 'Nearest Location' },
    { value: 'date-new', label: 'Recently Posted' },
    { value: 'date-old', label: 'Oldest First' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Icon name="Briefcase" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-semibold text-foreground">
          Available Assignments
        </h2>
        <span className="badge badge-primary">{resultCount}</span>
      </div>

      <div className="w-full sm:w-64">
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Sort by..."
        />
      </div>
    </div>
  );
};

export default SortControls;