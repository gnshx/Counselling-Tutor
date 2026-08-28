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
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {label}
            {props.required && <span className="text-pink-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error
              ? 'border-red-500 ring-1 ring-red-500'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
