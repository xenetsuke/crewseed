import React from 'react';
import Icon from '../../../components/AppIcon';

const LocationMap = ({ location, address, coordinates }) => {
  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="MapPin" size={24} color="var(--color-primary)" />
        Job Location
      </h2>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-start gap-3">
            <Icon name="Navigation" size={20} color="var(--color-primary)" />
            <div>
              <p className="font-semibold mb-1">{location}</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
        </div>

        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={location}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=14&output=embed`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 px-4 rounded-lg border border-border hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2">
            <Icon name="Navigation" size={18} />
            Directions
          </button>
          <button className="py-2.5 px-4 rounded-lg border border-border hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2">
            <Icon name="Phone" size={18} />
            Contact
          </button>
        </div>

        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} color="var(--color-secondary)" />
            <div>
              <p className="font-medium text-secondary mb-1">Transportation</p>
              <p className="text-sm text-foreground">
                Free shuttle service available from downtown transit center. Parking available on-site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;