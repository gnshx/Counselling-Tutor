import React from 'react';

interface StatusBadgeProps {
  status: 'completed' | 'in_progress' | 'not_started' | 'review_needed' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
      case 'Complete':
        return {
          bg: 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/20',
          icon: '🟢',
          text: label || 'Completed',
        };
      case 'review_needed':
        return {
          bg: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/20',
          icon: '🔵',
          text: label || 'Review needed',
        };
      case 'in_progress':
      case 'In Progress':
        return {
          bg: 'bg-[var(--color-warm-soft)] text-[var(--color-warm)] border-[var(--color-warm)]/20',
          icon: '🟡',
          text: label || 'In progress',
        };
      case 'not_started':
      case 'Not Started':
      default:
        return {
          bg: 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]',
          icon: '⚪',
          text: label || 'Not started',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold gap-1.5' : 'px-3 py-1 text-sm font-semibold gap-2';

  return (
    <span className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${sizeClasses}`}>
      <span className="text-[10px] leading-none">{config.icon}</span>
      <span>{config.text}</span>
    </span>
  );
}
