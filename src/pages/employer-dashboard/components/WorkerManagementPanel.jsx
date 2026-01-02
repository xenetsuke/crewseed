import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WorkerManagementPanel = ({ workers = [], onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [expandedWorkerId, setExpandedWorkerId] = useState(null);
  const navigate = useNavigate();

  const filteredWorkers = workers.filter(worker => worker.pipelineStatus === activeTab);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      {/* HEADER SECTION */}
      <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Icon name="Users" size={18} className="text-primary" />
            Talent Pipeline
          </h3>
          <div className="flex w-full sm:w-auto gap-1 p-1 bg-background rounded-xl border border-border overflow-x-auto">
            {['saved', 'interviewing', 'hired'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setExpandedWorkerId(null); }}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-card shadow-sm border border-border text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKER LIST */}
      <div className="flex-1 overflow-y-auto max-h-[500px] sm:max-h-[600px] scrollbar-hide divide-y divide-border">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker) => (
            <div key={worker.id} className="transition-all">
              {/* ROW ITEM */}
              <div 
                className={`p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer ${expandedWorkerId === worker.id ? 'bg-muted/50' : ''}`}
                onClick={() => setExpandedWorkerId(expandedWorkerId === worker.id ? null : worker.id)}
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full overflow-hidden border-2 border-background shadow-sm">
                    <Image src={worker.picture ? `data:image/jpeg;base64,${worker.picture}` : "/Avatar.png"} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-foreground leading-tight truncate">{worker.fullName}</h4>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter truncate">{worker.primaryJobRole}</p>
                  </div>
                </div>
                <Icon name={expandedWorkerId === worker.id ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0 ml-2" />
              </div>

              {/* 🔹 WORKER PROFILE MODEL (Expanded View) */}
              {expandedWorkerId === worker.id && (
                <div className="p-4 sm:p-6 bg-background border-t border-border animate-in slide-in-from-top-2 duration-300">
                  {/* 1. HERO SECTION */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-success/10 text-success text-[9px] font-black uppercase rounded">Verified Profile</span>
                        <div className="flex items-center gap-1 text-warning">
                          <Icon name="Star" size={10} fill="currentColor" />
                          <span className="text-xs font-bold">{worker.rating || '4.8'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="MapPin" size={12} /> {worker.currentCity}, {worker.currentState}
                      </p>
                    </div>
                  </div>

                  {/* 2. QUICK STATS MODEL */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[9px] font-black text-muted-foreground uppercase">Experience</p>
                      <p className="text-xs font-bold">{worker.totalExperience || '5+ Years'}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[9px] font-black text-muted-foreground uppercase">Expected Pay</p>
                      <p className="text-xs font-bold">₹{worker.expectedPay || '800'}/day</p>
                    </div>
                  </div>

                  {/* 3. SKILLS MODEL */}
                  <div className="mb-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Core Competencies</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.skills?.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. ACTION FOOTER */}
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile?.(worker);
                      }}
                      className="flex-1 py-3 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No workers in this stage</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerManagementPanel;