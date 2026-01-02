import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onRenew, onPause, onDelete, onExport, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
      <div className="card px-6 py-4 shadow-lg border-2 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
            <span className="font-medium">{selectedCount} selected</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={onRenew}
            >
              Renew
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Pause"
              iconPosition="left"
              onClick={onPause}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onExport}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;