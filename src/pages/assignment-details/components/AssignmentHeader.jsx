import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AssignmentHeader = ({ assignment }) => {
  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
            <Image
              src={assignment?.companyLogo}
              alt={assignment?.companyLogoAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{assignment?.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Icon name="Building2" size={18} />
                <span className="font-medium">{assignment?.companyName}</span>
                <span className="text-sm">•</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={16} color="var(--color-warning)" />
                  <span className="font-medium">{assignment?.companyRating}</span>
                  <span className="text-sm">({assignment?.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <Icon name="Share2" size={20} />
              </button>
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <Icon name="Bookmark" size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="DollarSign" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pay Rate</p>
                <p className="font-semibold">{assignment?.payRate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="MapPin" size={20} color="var(--color-secondary)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{assignment?.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name="Clock" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{assignment?.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Icon name="Calendar" size={20} color="var(--color-success)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold">{assignment?.startDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentHeader;