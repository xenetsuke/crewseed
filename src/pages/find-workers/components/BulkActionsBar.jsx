import React from 'react';

import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onClearSelection, onBulkAction }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-card border border-border rounded-xl shadow-2xl p-4 min-w-[500px]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">
                {selectedCount} worker{selectedCount > 1 ? 's' : ''} selected
              </p>
              <button
                onClick={onClearSelection}
                className="text-xs text-primary hover:underline"
              >
                Clear selection
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              onClick={() => onBulkAction?.('invite')}
            >
              Send Invitation
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onBulkAction?.('export')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Star"
              iconPosition="left"
              onClick={() => onBulkAction?.('shortlist')}
            >
              Add to Shortlist
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="GitCompare"
              iconPosition="left"
              onClick={() => onBulkAction?.('compare')}
            >
              Compare
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;