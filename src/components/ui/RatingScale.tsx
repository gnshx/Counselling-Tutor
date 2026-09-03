import React from 'react';

interface RatingScaleProps {
  value: number | string | null;
  onChange: (value: number | 'N/O') => void;
  disabled?: boolean;
}

export function RatingScale({ value, onChange, disabled = false }: RatingScaleProps) {
  const options: { value: number | 'N/O'; label: string; desc: string }[] = [
    { value: 1, label: '1', desc: 'Very Low' },
    { value: 2, label: '2', desc: 'Low' },
    { value: 3, label: '3', desc: 'Average' },
    { value: 4, label: '4', desc: 'Good' },
    { value: 5, label: '5', desc: 'Very Good' },
    { value: 'N/O', label: 'N/O', desc: 'Not Observed' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              isSelected
                ? opt.value === 'N/O'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-500 shadow-xs font-bold'
                  : 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-500 shadow-sm font-bold ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/60 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
          >
            <span className="text-base sm:text-lg font-bold leading-none">{opt.label}</span>
            <span
              className={`text-xs font-medium leading-none truncate max-w-full ${
                isSelected
                  ? opt.value === 'N/O'
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-blue-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}

