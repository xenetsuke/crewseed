import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SkillsTab = ({ skills, onAddSkill, onRemoveSkill, onUpdateSkill }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 'intermediate',
    yearsOfExperience: '',
  });

  const proficiencyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleAddSkill = () => {
    if (newSkill?.name && newSkill?.yearsOfExperience) {
      onAddSkill(newSkill);
      setNewSkill({ name: '', proficiency: 'intermediate', yearsOfExperience: '' });
      setShowAddForm(false);
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: 'bg-warning/10 text-warning border-warning/20',
      intermediate: 'bg-primary/10 text-primary border-primary/20',
      advanced: 'bg-success/10 text-success border-success/20',
      expert: 'bg-accent/10 text-accent border-accent/20',
    };
    return colors?.[level] || colors?.intermediate;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills & Certifications</h3>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Skill
        </Button>
      </div>
      {showAddForm && (
        <div className="card p-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Skill Name"
              type="text"
              placeholder="e.g., Welding, Carpentry"
              value={newSkill?.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e?.target?.value })}
            />
            <Select
              label="Proficiency Level"
              options={proficiencyOptions}
              value={newSkill?.proficiency}
              onChange={(value) => setNewSkill({ ...newSkill, proficiency: value })}
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="0"
              value={newSkill?.yearsOfExperience}
              onChange={(e) =>
                setNewSkill({ ...newSkill, yearsOfExperience: e?.target?.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button variant="default" onClick={handleAddSkill}>
              Add
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills?.map((skill) => (
          <div key={skill?.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{skill?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {skill?.yearsOfExperience} years experience
                </p>
              </div>
              <button
                onClick={() => onRemoveSkill(skill?.id)}
                className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Icon name="Trash2" size={18} color="var(--color-destructive)" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`badge ${getProficiencyColor(skill?.proficiency)}`}
              >
                {skill?.proficiency?.charAt(0)?.toUpperCase() +
                  skill?.proficiency?.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {skills?.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Award" size={48} className="mx-auto mb-4 opacity-50" />
          <p>No skills added yet. Add your first skill to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SkillsTab;