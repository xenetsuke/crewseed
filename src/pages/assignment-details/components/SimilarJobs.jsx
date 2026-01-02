import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SimilarJobs = ({ jobs }) => {
  const navigate = useNavigate();

  const handleJobClick = (jobId) => {
    navigate('/assignment-details', { state: { jobId } });
    window.scrollTo(0, 0);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Briefcase" size={24} color="var(--color-primary)" />
        Similar Opportunities
      </h2>
      <div className="space-y-4">
        {jobs?.map((job) => (
          <div
            key={job?.id}
            onClick={() => handleJobClick(job?.id)}
            className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={job?.companyLogo}
                  alt={job?.companyLogoAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 truncate">{job?.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{job?.companyName}</p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Icon name="DollarSign" size={14} color="var(--color-primary)" />
                    <span className="font-medium">{job?.payRate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} color="var(--color-secondary)" />
                    <span>{job?.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={14} color="var(--color-accent)" />
                    <span>{job?.duration}</span>
                  </div>
                </div>
              </div>

              <Icon name="ChevronRight" size={20} color="var(--color-muted-foreground)" />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/worker-assignments')}
        className="w-full mt-4 py-2.5 px-4 rounded-lg border border-border hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2"
      >
        View All Jobs
        <Icon name="ArrowRight" size={18} />
      </button>
    </div>
  );
};

export default SimilarJobs;