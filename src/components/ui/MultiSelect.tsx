import React from 'react';
import { Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: string;
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
    <div className="space-y-3">
      {maxSelections && (
        <div className="flex justify-between items-center text-xs font-semibold text-[var(--color-text-secondary)]">
          <span>Choose up to {maxSelections}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-indigo-200 dark:border-indigo-800/40">
            {selectedValues.length} / {maxSelections} selected
          </span>
        </div>
      )}
      <div className={`grid grid-cols-1 ${options.length >= 6 ? 'sm:grid-cols-2 lg:grid-cols-2' : 'sm:grid-cols-2'} gap-2 sm:gap-2.5`}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isAtLimit = !isSelected && maxSelections !== undefined && selectedValues.length >= maxSelections;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || isAtLimit}
              onClick={() => handleToggle(option.value)}
              className={`p-3 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-2.5 text-xs sm:text-sm ${
                isSelected
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] border-[var(--color-primary)] font-semibold shadow-xs'
                  : isAtLimit
                  ? 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)] opacity-50 cursor-not-allowed'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-primary-soft)] hover:border-indigo-300 dark:hover:border-indigo-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.995]'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {option.icon && (
                  <span className="w-7 h-7 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-sm shrink-0 border border-[var(--color-border-subtle)]">
                    {option.icon}
                  </span>
                )}
                <span className="leading-snug truncate">{option.label}</span>
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
    </div>
  );
}
