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
}: MultiSelectProps) {
  const handleToggle = (value: string) => {
    if (disabled) return;
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-4">
      {maxSelections && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Choose up to {maxSelections}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
            {selectedValues.length} / {maxSelections} selected
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isAtLimit = !isSelected && maxSelections !== undefined && selectedValues.length >= maxSelections;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || isAtLimit}
              onClick={() => handleToggle(option.value)}
              className={`p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-xs'
                  : isAtLimit
                  ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/40 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.995]'}`}
            >
              <span className="leading-relaxed">{option.label}</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500'
                    : 'border-slate-300 dark:border-slate-600 bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

