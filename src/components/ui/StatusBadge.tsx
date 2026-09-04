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
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
          text: label || 'Completed',
        };
      case 'review_needed':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
          dot: 'bg-indigo-500',
          text: label || 'Review needed',
        };
      case 'in_progress':
      case 'In Progress':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
          dot: 'bg-amber-500',
          text: label || 'In progress',
        };
      case 'not_started':
      case 'Not Started':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
          dot: 'bg-slate-400 dark:bg-slate-500',
          text: label || 'Not started',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px] font-semibold gap-1.5' : 'px-3 py-1 text-xs font-semibold gap-2';

  return (
    <span className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.text}</span>
    </span>
  );
}
