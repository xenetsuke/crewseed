import React from "react";

const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] animate-pulse p-6">
      <div className="h-10 w-40 bg-gray-200 rounded mb-6" />
      <div className="h-4 w-full bg-gray-200 rounded mb-3" />
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-4/6 bg-gray-200 rounded mb-3" />
    </div>
  );
};

export default AppSkeleton;
