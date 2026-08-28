import React from 'react';
import { Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  disabled?: boolean;
  colorTheme?: 'violet' | 'indigo' | 'emerald';
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  maxSelections,
  disabled = false,
  colorTheme = 'violet',
}: MultiSelectProps) {
  const handleToggle = (value: string) => {
    if (disabled) return;
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        // Drop the earliest or block
        return;
      }
      onChange([...selectedValues, value]);
    }
  };

  const themeClasses = {
    violet: {
      selected: 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 dark:shadow-none',
      badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
    },
    indigo: {
      selected: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    },
    emerald: {
      selected: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
  };

  return (
    <div className="space-y-3">
      {maxSelections && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span>Choose up to {maxSelections}</span>
          <span className={`px-2 py-0.5 rounded-full ${themeClasses[colorTheme].badge}`}>
            {selectedValues.length} / {maxSelections} selected
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isAtLimit = !isSelected && maxSelections !== undefined && selectedValues.length >= maxSelections;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || isAtLimit}
              onClick={() => handleToggle(option.value)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left font-medium transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${
                isSelected
                  ? themeClasses[colorTheme].selected
                  : isAtLimit
                  ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-600'
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
    </div>
  );
}
