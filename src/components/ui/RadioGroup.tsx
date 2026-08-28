import React from 'react';
import { Check } from 'lucide-react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  colorTheme?: 'violet' | 'indigo' | 'emerald';
}

export function RadioGroup({
  options,
  selectedValue,
  onChange,
  disabled = false,
  colorTheme = 'violet',
}: RadioGroupProps) {
  const themeClasses = {
    violet: 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 dark:shadow-none',
    indigo: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none',
    emerald: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none',
  };

  return (
    <div className="space-y-2.5">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`w-full p-4 rounded-2xl border text-left font-medium transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${
              isSelected
                ? themeClasses[colorTheme]
                : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800/80'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
          >
            <span>{option.label}</span>
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-white text-violet-700 border-white dark:text-indigo-700'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
