import React, { useState } from "react";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import WorkerRow from "./WorkerRow";
import { cn } from "../../../utils/cn";

const JobCard = ({ job }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <MapPin className="text-indigo-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{job.jobTitle}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
              {job.location} • <Calendar className="w-3.5 h-3.5" /> {job.month}
            </p>
          </div>
        </div>
        <ChevronDown className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 p-6 space-y-4 bg-slate-50/30">
          {job.workers.length > 0 ? (
            job.workers.map(worker => <WorkerRow key={worker.workerId} worker={worker} />)
          ) : (
            <p className="text-center text-slate-400 py-4 italic text-sm">No workers registered at this site.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;