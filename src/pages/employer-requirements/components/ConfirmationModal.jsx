import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'default', loading = false }) => {
  if (!isOpen) return null;

  const getIconConfig = () => {
    switch (type) {
      case 'delete':
        return { name: 'Trash2', color: 'var(--color-error)', bgClass: 'bg-error/10' };
      case 'pause':
        return { name: 'Pause', color: 'var(--color-warning)', bgClass: 'bg-warning/10' };
      case 'renew':
        return { name: 'RefreshCw', color: 'var(--color-success)', bgClass: 'bg-success/10' };
      default:
        return { name: 'AlertCircle', color: 'var(--color-primary)', bgClass: 'bg-primary/10' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative card p-6 max-w-md w-full space-y-4 animate-slide-in">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg ${iconConfig?.bgClass} flex items-center justify-center flex-shrink-0`}>
            <Icon name={iconConfig?.name} size={24} color={iconConfig?.color} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={type === 'delete' ? 'destructive' : 'default'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;