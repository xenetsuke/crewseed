import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const ProfileCompletionCard = ({ completionPercentage = 0, missingFields = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getCompletionColor = () => {
    if (completionPercentage >= 80) return 'var(--color-success)';
    if (completionPercentage >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {t('profileCompletion.title')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('profileCompletion.subtitle')}
          </p>
        </div>

        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-background border-4 border-border relative">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke={getCompletionColor()}
              strokeWidth="4"
              strokeDasharray={`${(completionPercentage / 100) * 176} 176`}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-bold relative z-10">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {missingFields?.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium">
            {t('profileCompletion.missing')}
          </p>
          <ul className="space-y-1">
            {missingFields?.slice(0, 3)?.map((field, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon
                  name="AlertCircle"
                  size={14}
                  color="var(--color-warning)"
                />
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        variant="default"
        size="sm"
        fullWidth
        iconName="ArrowRight"
        iconPosition="right"
        onClick={() => navigate('/worker-profile')}
      >
        {t('profileCompletion.cta')}
      </Button>
    </div>
  );
};

export default ProfileCompletionCard;
