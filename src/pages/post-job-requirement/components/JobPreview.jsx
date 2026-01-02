import React from 'react';
import Icon from '../../../components/AppIcon';


const JobPreview = ({ formData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const benefitIcons = {
    health: 'Heart',
    dental: 'Smile',
    vision: 'Eye',
    retirement: 'PiggyBank',
    pto: 'Calendar',
    overtime: 'Clock',
    bonus: 'Award',
    training: 'GraduationCap',
    equipment: 'Wrench',
    transportation: 'Car',
    meals: 'Utensils',
    housing: 'Home'
  };

  const benefitLabels = {
    health: 'Health Insurance',
    dental: 'Dental Insurance',
    vision: 'Vision Insurance',
    retirement: '401(k) Plan',
    pto: 'Paid Time Off',
    overtime: 'Overtime Pay',
    bonus: 'Performance Bonus',
    training: 'Training',
    equipment: 'Equipment Provided',
    transportation: 'Transportation',
    meals: 'Meal Allowance',
    housing: 'Housing Assistance'
  };

  const workDayLabels = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Icon name="Eye" size={20} color="var(--color-primary)" />
        <div>
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-muted-foreground">How workers will see your job posting</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name="Briefcase" size={32} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              {formData?.jobTitle || 'Job Title'}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData?.category && (
                <span className="badge badge-primary">
                  {formData?.category?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </span>
              )}
              {formData?.employmentType && (
                <span className="badge badge-success">
                  {formData?.employmentType?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </span>
              )}
              {formData?.experienceLevel && (
                <span className="badge">
                  {formData?.experienceLevel === 'entry' ? 'Entry Level' : 
                   formData?.experienceLevel === 'intermediate' ? 'Intermediate' :
                   formData?.experienceLevel === 'experienced' ? 'Experienced' : 'Senior'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {formData?.location && (
                <div className="flex items-center gap-1">
                  <Icon name="MapPin" size={16} />
                  <span>{formData?.location}</span>
                </div>
              )}
              {formData?.positions && (
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={16} />
                  <span>{formData?.positions} {parseInt(formData?.positions) === 1 ? 'Position' : 'Positions'}</span>
                </div>
              )}
              {formData?.startDate && (
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  <span>Starts {formatDate(formData?.startDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {(formData?.minPay || formData?.maxPay) && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compensation</p>
                <p className="text-2xl font-bold text-success">
                  ${formData?.minPay || '0'} - ${formData?.maxPay || '0'}
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    / {formData?.payFrequency || 'hour'}
                  </span>
                </p>
              </div>
              <Icon name="DollarSign" size={32} color="var(--color-success)" />
            </div>
          </div>
        )}

        {formData?.description && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: formData?.description?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')?.replace(/\n• /g, '\n<li>')?.replace(/\n\d+\. /g, '\n<li>')?.replace(/\n/g, '<br />')?.replace(/<li>/g, '<ul><li>')?.replace(/<\/li><br \/>/g, '</li></ul><br />')
              }}
            />
          </div>
        )}

        {formData?.benefits && formData?.benefits?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Benefits & Perks</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData?.benefits?.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Icon name={benefitIcons?.[benefit]} size={16} color="var(--color-primary)" />
                  <span className="text-sm">{benefitLabels?.[benefit]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(formData?.shiftType || formData?.workDays) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Schedule</h3>
            <div className="space-y-3">
              {formData?.shiftType && (
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} color="var(--color-primary)" />
                  <span className="text-sm">
                    {formData?.shiftType?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </div>
              )}
              {formData?.startTime && formData?.endTime && (
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} color="var(--color-primary)" />
                  <span className="text-sm">
                    {formatTime(formData?.startTime)} - {formatTime(formData?.endTime)}
                  </span>
                </div>
              )}
              {formData?.workDays && formData?.workDays?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} color="var(--color-primary)" />
                  <div className="flex gap-2">
                    {formData?.workDays?.map((day) => (
                      <span key={day} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {workDayLabels?.[day]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData?.duration && (
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} color="var(--color-primary)" />
                  <span className="text-sm">
                    Duration: {formData?.duration === 'custom' ? formData?.customDuration : formData?.duration?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {formData?.qualifications && formData?.qualifications?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <div className="space-y-2">
              {formData?.qualifications?.map((qual) => (
                <div key={qual} className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-sm">
                    {qual === 'license' ? "Valid driver's license required" :
                     qual === 'certification' ? 'Industry certification required' :
                     qual === 'background' ? 'Background check required' :
                     qual === 'drug' ? 'Drug screening required' :
                     qual === 'physical' ? 'Physical examination required' :
                     qual === 'references' ? 'Professional references required' : qual}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData?.applicationDeadline && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
              <div>
                <p className="text-sm font-medium">Application Deadline</p>
                <p className="text-sm text-muted-foreground">
                  Applications close on {formatDate(formData?.applicationDeadline)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPreview;