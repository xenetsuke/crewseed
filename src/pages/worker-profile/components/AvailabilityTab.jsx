import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AvailabilityTab = ({ availability, onSave }) => {
  const [formData, setFormData] = useState(availability);
  const [loading, setLoading] = useState(false);

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
  ];

  const radiusOptions = [
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
    { value: '100', label: '100 miles' },
    { value: 'any', label: 'Any distance' },
  ];

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  const handleDayToggle = (day, checked) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: checked
        ? [...prev?.availableDays, day]
        : prev?.availableDays?.filter((d) => d !== day),
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Work Schedule Preferences
        </h3>
        <div className="space-y-4">
          <Select
            label="Preferred Job Type"
            options={jobTypeOptions}
            value={formData?.jobType}
            onChange={(value) => setFormData({ ...formData, jobType: value })}
            multiple
          />
          <div>
            <label className="text-sm font-medium mb-3 block">
              Available Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek?.map((day) => (
                <Checkbox
                  key={day?.id}
                  label={day?.label}
                  checked={formData?.availableDays?.includes(day?.id)}
                  onChange={(e) => handleDayToggle(day?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          Location Preferences
        </h3>
        <div className="space-y-4">
          <Select
            label="Maximum Travel Distance"
            options={radiusOptions}
            value={formData?.travelRadius}
            onChange={(value) =>
              setFormData({ ...formData, travelRadius: value })
            }
          />
          <Checkbox
            label="Willing to relocate for the right opportunity"
            checked={formData?.willingToRelocate}
            onChange={(e) =>
              setFormData({ ...formData, willingToRelocate: e?.target?.checked })
            }
          />
          <Checkbox
            label="Open to remote/hybrid work arrangements"
            checked={formData?.remoteWork}
            onChange={(e) =>
              setFormData({ ...formData, remoteWork: e?.target?.checked })
            }
          />
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Immediate Availability
        </h3>
        <div className="space-y-4">
          <Checkbox
            label="Available to start immediately"
            checked={formData?.immediateStart}
            onChange={(e) =>
              setFormData({ ...formData, immediateStart: e?.target?.checked })
            }
          />
          <Checkbox
            label="Available for emergency/urgent assignments"
            checked={formData?.emergencyAvailable}
            onChange={(e) =>
              setFormData({ ...formData, emergencyAvailable: e?.target?.checked })
            }
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" variant="default" loading={loading}>
          Save Preferences
        </Button>
      </div>
    </form>
  );
};

export default AvailabilityTab;