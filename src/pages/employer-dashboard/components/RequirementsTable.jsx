import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequirementsTable = ({ requirements = [] }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'bg-success/10 text-success border-success/20', label: 'Active' },
      pending: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
      closed: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Closed' },
      draft: { class: 'bg-muted text-muted-foreground border-border', label: 'Draft' }
    };
    return statusConfig?.[status?.toLowerCase()] || statusConfig?.draft;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col w-full">
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Icon name="ClipboardList" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground leading-none mb-1">Active Requirements</h2>
            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-70">Job Management</p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          className="font-black uppercase tracking-widest text-[10px] w-full sm:w-auto px-6 py-4 shadow-lg shadow-primary/20"
          onClick={() => navigate('/post-job-requirement')}
        >
          Post New Job
        </Button>
      </div>

      {/* 🔹 DESKTOP TABLE VIEW (With Horizontal Scroll Prevention) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/30">
              <th className="py-4 px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Position</th>
              <th className="py-4 px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">Applicants</th>
              <th className="py-4 px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">Posted Date</th>
              <th className="py-4 px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
              <th className="py-4 px-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requirements?.map((req) => {
              const badge = getStatusBadge(req?.status);
              return (
                <tr key={req?.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border group-hover:bg-background transition-colors shrink-0">
                        <Icon name={req?.icon || 'Briefcase'} size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{req?.position}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{req?.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-foreground leading-none">{req?.applications || 0}</span>
                      {req?.newApplications > 0 && (
                        <span className="mt-1 text-[9px] font-black text-primary px-2 bg-primary/10 rounded-full uppercase tracking-tighter">
                          +{req.newApplications} New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="text-xs font-bold text-muted-foreground italic">{req?.postedDate}</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${badge.class}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" size="sm" iconName="Eye" onClick={() => navigate(`/requirement-details/${req?.id}`)} />
                      <button 
                        className="px-4 py-2 bg-background border border-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm"
                        onClick={() => navigate(`/requirement-details/${req?.id}`)}
                      >
                        Candidates
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔹 MOBILE CARD VIEW (Optimized Grid) */}
      <div className="lg:hidden p-4 space-y-4 bg-muted/10">
        {requirements?.map((req) => {
          const badge = getStatusBadge(req?.status);
          return (
            <div key={req?.id} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name={req?.icon || 'Briefcase'} size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">{req?.position}</h3>
                    <p className="text-[10px] text-muted-foreground truncate">{req?.location}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${badge.class}`}>
                  {badge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50 mb-4">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Applications</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-foreground">{req?.applications}</span>
                    {req?.newApplications > 0 && (
                      <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">+{req.newApplications}</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Posted On</p>
                  <p className="text-xs font-bold text-foreground">{req?.postedDate}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    fullWidth 
                    size="sm" 
                    iconName="Eye" 
                    className="text-[10px] font-black uppercase"
                    onClick={() => navigate(`/requirement-details/${req?.id}`)} 
                />
                <Button 
                    variant="default" 
                    fullWidth 
                    size="sm" 
                    className="text-[10px] font-black uppercase tracking-widest" 
                    onClick={() => navigate(`/requirement-details/${req?.id}`)}
                >
                  Candidates
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      {requirements.length === 0 && (
        <div className="p-12 text-center bg-muted/5">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
             <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">No Active Postings</p>
        </div>
      )}
    </div>
  );
};

export default RequirementsTable;