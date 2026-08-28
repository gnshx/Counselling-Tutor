import React from 'react';
import { CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'completed' | 'in_progress' | 'not_started' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
      case 'Complete':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          text: label || 'Completed',
        };
      case 'in_progress':
      case 'In Progress':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          text: label || 'In Progress',
        };
      case 'not_started':
      case 'Not Started':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
          icon: <CircleDot className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          text: label || 'Not Started',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium gap-1' : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs transition-colors ${config.bg} ${sizeClasses}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
}
