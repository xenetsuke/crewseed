import React from 'react';
import Icon from '../../../components/AppIcon';

const ShiftSchedule = ({ shifts }) => {
  const getDayColor = (day) => {
    const colors = {
      Monday: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Tuesday: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      Wednesday: 'bg-green-500/10 text-green-600 border-green-500/20',
      Thursday: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      Friday: 'bg-red-500/10 text-red-600 border-red-500/20',
      Saturday: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      Sunday: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    };
    return colors?.[day] || 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Calendar" size={24} color="var(--color-primary)" />
        Shift Schedule
      </h2>
      <div className="space-y-3">
        {shifts?.map((shift, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-lg border font-medium text-sm ${getDayColor(shift?.day)}`}>
                {shift?.day}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={16} color="var(--color-primary)" />
                  <span className="font-semibold">{shift?.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{shift?.duration}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{shift?.rate}</p>
              <p className="text-xs text-muted-foreground">{shift?.type}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" />
          <div>
            <p className="font-medium mb-1">Schedule Flexibility</p>
            <p className="text-sm text-muted-foreground">
              Shifts can be adjusted based on project requirements. Overtime opportunities available on weekends at 1.5x rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftSchedule;