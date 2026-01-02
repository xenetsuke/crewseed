import React from 'react';

const AssignmentSkeleton = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-muted"></div>
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="flex gap-3">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="h-8 bg-muted rounded w-24"></div>
        <div className="h-8 bg-muted rounded w-24"></div>
      </div>

      <div className="mb-4">
        <div className="h-4 bg-muted rounded w-32 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="h-6 bg-muted rounded w-20"></div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="h-10 bg-muted rounded flex-1"></div>
        <div className="h-10 bg-muted rounded flex-1"></div>
      </div>
    </div>
  );
};

export default AssignmentSkeleton;