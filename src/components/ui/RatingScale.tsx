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
                  ? 'bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] shadow-md ring-2 ring-[var(--color-primary)]'
                  : 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md ring-2 ring-[var(--color-primary-soft)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-primary)]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
          >
            <span className="text-base font-bold">{opt.label}</span>
            <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-[var(--color-text-secondary)]'}`}>
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
