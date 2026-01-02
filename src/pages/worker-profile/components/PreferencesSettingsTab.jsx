import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PreferencesSettingsTab = ({ preferences, privacySettings, onSave, onPrivacySave }) => {
  const [workPrefs, setWorkPrefs] = useState(preferences?.workPreferences);
  const [notifications, setNotifications] = useState(preferences?.notifications);
  const [language, setLanguage] = useState(preferences?.language);
  const [privacy, setPrivacy] = useState(privacySettings);
  const [loading, setLoading] = useState(false);

  const shiftOptions = [
    { value: 'morning', label: 'Morning (6 AM - 2 PM)' },
    { value: 'day', label: 'Day (9 AM - 6 PM)' },
    { value: 'evening', label: 'Evening (2 PM - 10 PM)' },
    { value: 'night', label: 'Night (10 PM - 6 AM)' }
  ];

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const languageOptions = [
    { value: 'hindi', label: 'हिन्दी (Hindi)' },
    { value: 'english', label: 'English' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'bengali', label: 'বাংলা (Bengali)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'weekly', label: 'Weekly Summary' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public (Visible to all employers)' },
    { value: 'verified-only', label: 'Verified Employers Only' },
    { value: 'private', label: 'Private (Not searchable)' }
  ];

  const handleShiftToggle = (shift) => {
    const currentShifts = workPrefs?.shiftTimings || [];
    const newShifts = currentShifts?.includes(shift)
      ? currentShifts?.filter((s) => s !== shift)
      : [...currentShifts, shift];
    setWorkPrefs({ ...workPrefs, shiftTimings: newShifts });
  };

  const handleJobTypeToggle = (type) => {
    const currentTypes = workPrefs?.jobTypes || [];
    const newTypes = currentTypes?.includes(type)
      ? currentTypes?.filter((t) => t !== type)
      : [...currentTypes, type];
    setWorkPrefs({ ...workPrefs, jobTypes: newTypes });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ workPreferences: workPrefs, notifications, language });
      onPrivacySave(privacy);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Work Preferences */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Briefcase" size={20} />
          Work Preferences
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Preferred Shift Timings</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shiftOptions?.map((shift) => (
                <button
                  key={shift?.value}
                  type="button"
                  onClick={() => handleShiftToggle(shift?.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    workPrefs?.shiftTimings?.includes(shift?.value)
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                  }`}
                >
                  {shift?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Maximum Travel Distance (km)"
              type="number"
              value={workPrefs?.maxTravelDistance}
              onChange={(e) => setWorkPrefs({ ...workPrefs, maxTravelDistance: parseInt(e?.target?.value) })}
              min="1"
              max="100"
            />
            <Input
              label="Preferred Work Location"
              type="text"
              value={workPrefs?.workLocation}
              onChange={(e) => setWorkPrefs({ ...workPrefs, workLocation: e?.target?.value })}
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Job Type Preferences</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {jobTypeOptions?.map((type) => (
                <button
                  key={type?.value}
                  type="button"
                  onClick={() => handleJobTypeToggle(type?.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    workPrefs?.jobTypes?.includes(type?.value)
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                  }`}
                >
                  {type?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Notification Settings
        </h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Job Alert Notifications"
            checked={notifications?.jobAlerts}
            onChange={(checked) => setNotifications({ ...notifications, jobAlerts: checked })}
          />
          <Checkbox
            label="SMS Notifications"
            checked={notifications?.smsNotifications}
            onChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
          />
          <Checkbox
            label="WhatsApp Notifications"
            checked={notifications?.whatsappNotifications}
            onChange={(checked) => setNotifications({ ...notifications, whatsappNotifications: checked })}
          />
          <Checkbox
            label="Email Notifications"
            checked={notifications?.emailNotifications}
            onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
          />
          
          <Select
            label="Notification Frequency"
            options={frequencyOptions}
            value={notifications?.frequency}
            onChange={(value) => setNotifications({ ...notifications, frequency: value })}
          />
        </div>
      </div>

      {/* Language & Accessibility */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Globe" size={20} />
          Language & Accessibility
        </h3>
        
        <div className="space-y-4">
          <Select
            label="App Language"
            options={languageOptions}
            value={language}
            onChange={(value) => setLanguage(value)}
          />
          <p className="text-xs text-muted-foreground">
            Choose your preferred language for the app interface
          </p>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Privacy Settings
        </h3>
        
        <div className="space-y-4">
          <Select
            label="Profile Visibility"
            options={visibilityOptions}
            value={privacy?.profileVisibility}
            onChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
          />
          
          <Checkbox
            label="Show in Employer Search Results"
            checked={privacy?.searchAppearance}
            onChange={(checked) => setPrivacy({ ...privacy, searchAppearance: checked })}
          />

          <Select
            label="Contact Information Privacy"
            options={visibilityOptions}
            value={privacy?.contactInfoPrivacy}
            onChange={(value) => setPrivacy({ ...privacy, contactInfoPrivacy: value })}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" variant="default" loading={loading} className="w-full sm:w-auto">
          Save All Settings
        </Button>
      </div>
    </form>
  );
};

export default PreferencesSettingsTab;