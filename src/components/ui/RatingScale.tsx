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
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl border font-medium text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
              isSelected
                ? opt.value === 'N/O'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md ring-2 ring-slate-400 dark:bg-slate-700 dark:border-slate-600'
                  : 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 dark:ring-indigo-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
          >
            <span className="text-base font-bold">{opt.label}</span>
            <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-indigo-100 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
