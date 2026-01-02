import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const AdvancedFilterPanel = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    roles: [],
    skills: [],
    experience: '',
    availability: '',
    shiftPreference: [],
    wageType: '',
    dailyWageMin: 200,
    dailyWageMax: 2000,
    monthlyWageMin: 6000,
    monthlyWageMax: 50000,
    distance: 10,
    verification: [],
    rating: '',
    gender: 'all',
    ageMin: 18,
    ageMax: 60
  });

  const commonRoles = [
    'Loader',
    'Packer',
    'Security Guard',
    'Cleaner',
    'Cook',
    'Machine Operator',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Welder'
  ];

  const commonSkills = [
    'Physical Strength',
    'Time Management',
    'Safety Compliance',
    'Equipment Operation',
    'Team Collaboration',
    'Quality Control'
  ];

  const shiftOptions = [
    { value: 'morning', label: 'Morning (6AM-2PM)' },
    { value: 'day', label: 'Day (9AM-6PM)' },
    { value: 'evening', label: 'Evening (2PM-10PM)' },
    { value: 'night', label: 'Night (10PM-6AM)' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const handleRoleToggle = (role) => {
    setFilters((prev) => ({
      ...prev,
      roles: prev?.roles?.includes(role)
        ? prev?.roles?.filter((r) => r !== role)
        : [...prev?.roles, role]
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev?.skills?.includes(skill)
        ? prev?.skills?.filter((s) => s !== skill)
        : [...prev?.skills, skill]
    }));
  };

  const handleShiftToggle = (shift) => {
    setFilters((prev) => ({
      ...prev,
      shiftPreference: prev?.shiftPreference?.includes(shift)
        ? prev?.shiftPreference?.filter((s) => s !== shift)
        : [...prev?.shiftPreference, shift]
    }));
  };

  const handleVerificationToggle = (verification) => {
    setFilters((prev) => ({
      ...prev,
      verification: prev?.verification?.includes(verification)
        ? prev?.verification?.filter((v) => v !== verification)
        : [...prev?.verification, verification]
    }));
  };

  const handleSelectAll = (type) => {
    if (type === 'roles') {
      setFilters((prev) => ({
        ...prev,
        roles: prev?.roles?.length === commonRoles?.length ? [] : [...commonRoles]
      }));
    } else if (type === 'skills') {
      setFilters((prev) => ({
        ...prev,
        skills: prev?.skills?.length === commonSkills?.length ? [] : [...commonSkills]
      }));
    }
  };

  const handleClearAll = () => {
    setFilters({
      roles: [],
      skills: [],
      experience: '',
      availability: '',
      shiftPreference: [],
      wageType: '',
      dailyWageMin: 200,
      dailyWageMax: 2000,
      monthlyWageMin: 6000,
      monthlyWageMax: 50000,
      distance: 10,
      verification: [],
      rating: '',
      gender: 'all',
      ageMin: 18,
      ageMax: 60
    });
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Icon name="SlidersHorizontal" size={24} color="var(--color-primary)" />
            <h2 className="text-xl font-bold">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Role & Skills Filter */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Role & Skills</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll('roles')}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, roles: [] }))}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonRoles?.map((role) => (
                  <Checkbox
                    key={role}
                    label={role}
                    checked={filters?.roles?.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                  />
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Skills</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll('skills')}
                  >
                    Select All
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSkills?.map((skill) => (
                    <Checkbox
                      key={skill}
                      label={skill}
                      checked={filters?.skills?.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Distance Radius: {filters?.distance} km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters?.distance}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, distance: parseInt(e?.target?.value) }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <h3 className="font-semibold mb-3">Experience</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'fresher', label: 'Fresher' },
                  { value: '1-3', label: '1-3 years' },
                  { value: '3-5', label: '3-5 years' },
                  { value: '5+', label: '5+ years' }
                ]?.map((exp) => (
                  <button
                    key={exp?.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        experience: prev?.experience === exp?.value ? '' : exp?.value
                      }))
                    }
                    className={`
                      px-4 py-2 rounded-lg border transition-all text-sm font-medium
                      ${filters?.experience === exp?.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:border-primary'
                      }
                    `}
                  >
                    {exp?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="font-semibold mb-3">Availability</h3>
              <div className="space-y-3">
                <Select
                  label="Availability Status"
                  value={filters?.availability}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, availability: e?.target?.value }))
                  }
                  options={[
                    { value: '', label: 'All' },
                    { value: 'available-now', label: 'Available Now' },
                    { value: 'available-week', label: 'Available This Week' },
                    { value: 'available-next', label: 'Available Next Week' }
                  ]}
                />

                <div>
                  <label className="text-sm font-medium mb-2 block">Shift Preference</label>
                  <div className="space-y-2">
                    {shiftOptions?.map((shift) => (
                      <Checkbox
                        key={shift?.value}
                        label={shift?.label}
                        checked={filters?.shiftPreference?.includes(shift?.value)}
                        onChange={() => handleShiftToggle(shift?.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Wage Expectation Filter */}
            <div>
              <h3 className="font-semibold mb-3">Wage Expectation</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Daily Wage: ₹{filters?.dailyWageMin} - ₹{filters?.dailyWageMax}+
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={filters?.dailyWageMin}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, dailyWageMin: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={filters?.dailyWageMax}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, dailyWageMax: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Monthly Wage: ₹{filters?.monthlyWageMin} - ₹{filters?.monthlyWageMax}+
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="6000"
                      max="50000"
                      step="1000"
                      value={filters?.monthlyWageMin}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, monthlyWageMin: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="6000"
                      max="50000"
                      step="1000"
                      value={filters?.monthlyWageMax}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, monthlyWageMax: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <h3 className="font-semibold mb-3">Additional Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Verification Status</label>
                  <div className="space-y-2">
                    <Checkbox
                      label="Verified Only"
                      checked={filters?.verification?.includes('verified')}
                      onChange={() => handleVerificationToggle('verified')}
                    />
                    <Checkbox
                      label="Pending Verification"
                      checked={filters?.verification?.includes('pending')}
                      onChange={() => handleVerificationToggle('pending')}
                    />
                  </div>
                </div>

                <Select
                  label="Minimum Rating"
                  value={filters?.rating}
                  onChange={(e) => setFilters((prev) => ({ ...prev, rating: e?.target?.value }))}
                  options={[
                    { value: '', label: 'All ratings' },
                    { value: '3', label: '3+ stars' },
                    { value: '4', label: '4+ stars' },
                    { value: '5', label: '5 stars only' }
                  ]}
                />

                <Select
                  label="Gender"
                  value={filters?.gender}
                  onChange={(e) => setFilters((prev) => ({ ...prev, gender: e?.target?.value }))}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                />

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Age Range: {filters?.ageMin} - {filters?.ageMax} years
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={filters?.ageMin}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, ageMin: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={filters?.ageMax}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, ageMax: parseInt(e?.target?.value) }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="ghost" onClick={handleClearAll}>
            Clear All Filters
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;