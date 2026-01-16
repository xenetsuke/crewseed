import React from "react";
import { CheckCircle2 } from "lucide-react";

const ApplyNowButton = ({ hasApplied, onApply }) => {
  return (
    <div className="w-full">
      {hasApplied ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-green-900">
            Application Submitted!
          </p>
          <p className="text-sm text-green-700 mt-1">
            The employer will review your application and contact you soon.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={onApply}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg
                     hover:bg-blue-700 transition-colors shadow-md
                     flex items-center justify-center gap-2
                     active:scale-[0.99]"
        >
          <CheckCircle2 className="w-6 h-6" />
          Apply Now
        </button>
      )}
    </div>
  );
};

export default ApplyNowButton;
