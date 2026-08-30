import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] ${
            error
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--color-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
