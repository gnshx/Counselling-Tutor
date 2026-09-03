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
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${
              isSelected
                ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-xs'
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
  );
}

