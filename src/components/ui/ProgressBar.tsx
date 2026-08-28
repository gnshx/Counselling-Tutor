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

  const themeGradients = {
    violet: 'from-violet-500 to-indigo-600 shadow-violet-200 dark:shadow-none',
    emerald: 'from-emerald-400 to-teal-600 shadow-emerald-200 dark:shadow-none',
    amber: 'from-amber-400 to-orange-500 shadow-amber-200 dark:shadow-none',
    blue: 'from-blue-500 to-cyan-600 shadow-blue-200 dark:shadow-none',
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className="w-full">
      {(showText || label) && (
        <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
          <span className="text-slate-700 dark:text-slate-200">{label || `Step ${current} of ${total}`}</span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60 ${heightClasses[height]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${themeGradients[colorTheme]} transition-all duration-500 ease-out shadow-xs`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
