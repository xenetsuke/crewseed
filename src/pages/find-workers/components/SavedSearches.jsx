import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedSearches = ({ searches, onLoadSearch, onDeleteSearch }) => {
  if (!searches || searches?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card p-6 rounded-2xl border border-border mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Using the blue color logic for saved/bookmarked states */}
          <Icon name="Bookmark" size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-foreground">Saved Searches</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        {searches?.map((search) => (
          <div
            key={search?.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-all duration-200 group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">{search?.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="truncate">{search?.criteria}</span>
                <span>•</span>
                <span className="font-medium text-primary">
                  {search?.resultCount} {search?.resultCount === 1 ? 'worker' : 'workers'} found
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                onClick={() => onLoadSearch && onLoadSearch(search)}
                className="font-semibold"
              >
                Run Search
              </Button>
              
              <button
                onClick={() => onDeleteSearch && onDeleteSearch(search?.id)}
                className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
                title="Delete saved search"
              >
                <Icon name="Trash2" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;