import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "Post New Job",
      description: "Create a new job posting to attract qualified candidates",
      icon: "PlusCircle",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10",
      path: "/post-job-requirement"
    },
    {
      id: 2,
      title: "Find Workers",
      description: "Search and discover skilled workers for your requirements",
      icon: "Search",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10",
      path: "/find-workers"
    },
    {
      id: 3,
      title: "Review Applications",
      description: "Manage and review pending candidate applications",
      icon: "FileCheck",
      color: "var(--color-success)",
      bgColor: "bg-success/10",
      path: "/employer-requirements"
    },
    {
      id: 4,
      title: "Bulk Actions",
      description: "Perform bulk operations on multiple applications",
      icon: "Layers",
      color: "var(--color-accent)",
      bgColor: "bg-accent/10",
      path: "/employer-requirements"
    }
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Zap" size={24} color="var(--color-primary)" />
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => navigate(action?.path)}
            className="p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all text-left group"
          >
            <div className={`w-12 h-12 rounded-lg ${action?.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon name={action?.icon} size={24} color={action?.color} />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{action?.title}</h3>
            <p className="text-sm text-muted-foreground">{action?.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;