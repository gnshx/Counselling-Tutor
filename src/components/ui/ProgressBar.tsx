import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  label?: string;
  colorTheme?: 'violet' | 'emerald' | 'amber' | 'blue';
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  total,
  showText = true,
  label,
  colorTheme = 'violet',
  height = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  const themeColors = {
    violet: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    blue: 'bg-blue-600 dark:bg-blue-500',
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(showText || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
          <span className="text-[var(--color-text-secondary)]">{label || `Step ${current} of ${total}`}</span>
          <span className="text-[var(--color-primary)]">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[var(--color-surface-soft)] rounded-full overflow-hidden border border-[var(--color-border-subtle)] ${heightClasses[height]}`}>
        <div
          className={`h-full rounded-full ${themeColors[colorTheme]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
