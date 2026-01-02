import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="card p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon name="Search" size={40} color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Assignments Found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any assignments matching your current filters. Try adjusting your search criteria or clearing filters to see more results.
      </p>
      <Button
        variant="outline"
        onClick={onClearFilters}
        iconName="RotateCcw"
        iconPosition="left"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyState;