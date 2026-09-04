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
            className={`w-full p-3 sm:p-3.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${
              isSelected
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] border-[var(--color-primary)] font-semibold shadow-xs'
                : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-primary-soft)] hover:border-indigo-300 dark:hover:border-indigo-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.995]'}`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {option.icon && (
                <span className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-base shrink-0 border border-[var(--color-border-subtle)]">
                  {option.icon}
                </span>
              )}
              <span className="leading-snug">{option.label}</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-600 shadow-xs'
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
