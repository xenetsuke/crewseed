import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedFiltersPanel = ({ savedFilters, onApplyFilter, onDeleteFilter }) => {
  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Saved Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          Save Current
        </Button>
      </div>
      <div className="space-y-2">
        {savedFilters?.map((filter) => (
          <div
            key={filter?.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <button
              onClick={() => onApplyFilter(filter)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <Icon name="Filter" size={16} color="var(--color-primary)" />
              <div>
                <p className="text-sm font-medium">{filter?.name}</p>
                <p className="text-xs text-muted-foreground">{filter?.description}</p>
              </div>
            </button>
            <Button
              variant="ghost"
              size="icon"
              iconName="Trash2"
              onClick={() => onDeleteFilter(filter?.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedFiltersPanel;