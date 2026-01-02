import React from "react";
import { CheckCircle2 } from "lucide-react";

const ApplyNowButton = ({ hasApplied, onApply }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
      <div className="max-w-md mx-auto">
        {hasApplied ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-900">Application Submitted!</p>
            <p className="text-sm text-green-700 mt-1">
              The employer will review your application and contact you soon.
            </p>
          </div>
        ) : (
          <button
            onClick={onApply}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyNowButton;
