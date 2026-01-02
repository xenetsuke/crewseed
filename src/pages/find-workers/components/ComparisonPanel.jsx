import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * ComparisonPanel
 * Updated to handle backend worker profiles (Base64 images and dynamic titles)
 */
const ComparisonPanel = ({ workers, onRemove, onClear }) => {
  if (!workers || workers?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-40 animate-slide-in">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="GitCompare" size={20} className="text-primary" />
            <h3 className="font-bold text-foreground">
              Compare Workers <span className="text-primary">({workers?.length})</span>
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClear} 
              className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear All
            </button>
            <Button variant="default" size="sm" iconName="ArrowRight" iconPosition="right" className="px-6">
              Compare Now
            </Button>
          </div>
        </div>

        {/* WORKER MINI CARDS */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {workers?.map((worker) => (
            <div 
              key={worker?.id} 
              className="relative bg-background rounded-xl p-3 border border-border min-w-[200px] max-w-[240px] flex-shrink-0 shadow-sm"
            >
              {/* REMOVE BUTTON */}
              <button
                onClick={() => onRemove && onRemove(worker?.id)}
                className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10 shadow-md"
              >
                <Icon name="X" size={12} />
              </button>

              <div className="flex items-center gap-3">
                {/* WORKER IMAGE - Handled Base64 like WorkerCard */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border flex-shrink-0 bg-muted">
                  <Image
                    src={
                      worker?.picture
                        ? `data:image/jpeg;base64,${worker.picture}`
                        : "/Avatar.png"
                    }
                    alt={worker?.fullName || "Worker"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-foreground">
                    {worker?.fullName || worker?.name || "Unnamed"}
                  </p>
                  
                  {/* STAR RATING (Mocked as per your current app state) */}
                  <div className="flex items-center gap-1 text-warning">
                    <Icon name="Star" size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold">
                      {worker?.rating || 4.5}
                    </span>
                  </div>
                  
                  {/* TITLE / ROLE */}
                  <p className="text-[11px] text-primary font-semibold truncate mt-0.5 uppercase tracking-tight">
                    {worker?.primaryJobRole || worker?.title || "Professional"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* EMPTY SLOT (Optional visual hint) */}
          {workers.length < 4 && (
            <div className="hidden md:flex items-center justify-center w-[200px] border-2 border-dashed border-border rounded-xl bg-muted/20 text-muted-foreground text-xs font-medium">
              Add more to compare
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;