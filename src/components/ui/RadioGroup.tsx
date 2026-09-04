import React from 'react';
import { Check } from 'lucide-react';

export interface RadioOption {
  value: string;
  label: string;
  icon?: string;
  proofPrompt?: string;
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
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`w-full p-2.5 sm:p-3 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-2.5 text-xs sm:text-sm ${
              isSelected
                ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-2xs'
                : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/40 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.995]'}`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {option.icon && (
                <span className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/50 flex items-center justify-center text-sm shrink-0 border border-blue-200/50 dark:border-blue-700/50">
                  {option.icon}
                </span>
              )}
              <span className="leading-snug">{option.label}</span>
            </div>
            <div
              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500'
                  : 'border-slate-300 dark:border-slate-600 bg-transparent'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

