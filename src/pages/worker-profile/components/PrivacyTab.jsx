import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const PrivacyTab = ({ settings, onSave }) => {
  const [formData, setFormData] = useState(settings);
  const [loading, setLoading] = useState(false);

  const visibilityOptions = [
    { value: 'public', label: 'Public - Visible to all employers' },
    { value: 'verified', label: 'Verified Employers Only' },
    { value: 'private', label: 'Private - Only visible when I apply' },
  ];

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
          <Icon name="Eye" size={20} />
          Profile Visibility
        </h3>
        <div className="space-y-4">
          <Select
            label="Who can see my profile?"
            description="Control who can view your complete profile information"
            options={visibilityOptions}
            value={formData?.profileVisibility}
            onChange={(value) =>
              setFormData({ ...formData, profileVisibility: value })
            }
          />
          <Checkbox
            label="Show my profile in search results"
            description="Allow employers to find your profile when searching for workers"
            checked={formData?.showInSearch}
            onChange={(e) =>
              setFormData({ ...formData, showInSearch: e?.target?.checked })
            }
          />
          <Checkbox
            label="Display my last active status"
            description="Let employers see when you were last active on the platform"
            checked={formData?.showLastActive}
            onChange={(e) =>
              setFormData({ ...formData, showLastActive: e?.target?.checked })
            }
          />
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Mail" size={20} />
          Contact Preferences
        </h3>
        <div className="space-y-4">
          <Checkbox
            label="Allow employers to contact me directly"
            description="Employers can send you messages about job opportunities"
            checked={formData?.allowDirectContact}
            onChange={(e) =>
              setFormData({ ...formData, allowDirectContact: e?.target?.checked })
            }
          />
          <Checkbox
            label="Show my phone number to verified employers"
            description="Display your phone number on your profile for quick contact"
            checked={formData?.showPhoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, showPhoneNumber: e?.target?.checked })
            }
          />
          <Checkbox
            label="Show my email address to verified employers"
            description="Display your email address on your profile"
            checked={formData?.showEmail}
            onChange={(e) =>
              setFormData({ ...formData, showEmail: e?.target?.checked })
            }
          />
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <Checkbox
            label="Email notifications for new job matches"
            checked={formData?.emailJobMatches}
            onChange={(e) =>
              setFormData({ ...formData, emailJobMatches: e?.target?.checked })
            }
          />
          <Checkbox
            label="SMS notifications for urgent opportunities"
            checked={formData?.smsNotifications}
            onChange={(e) =>
              setFormData({ ...formData, smsNotifications: e?.target?.checked })
            }
          />
          <Checkbox
            label="Weekly summary of new opportunities"
            checked={formData?.weeklySummary}
            onChange={(e) =>
              setFormData({ ...formData, weeklySummary: e?.target?.checked })
            }
          />
        </div>
      </div>
      <div className="card p-6 bg-warning/5 border-warning/20">
        <div className="flex gap-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Data Privacy Notice</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your personal information is protected and will only be shared according to your privacy settings. You can update these settings at any time.
            </p>
            <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
              View Privacy Policy
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" variant="default" loading={loading}>
          Save Settings
        </Button>
      </div>
    </form>
  );
};

export default PrivacyTab;