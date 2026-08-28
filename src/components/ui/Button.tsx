import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 focus:ring-indigo-500 dark:shadow-none dark:bg-indigo-600 dark:hover:bg-indigo-500',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-md focus:ring-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
    outline: 'border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost: 'hover:bg-slate-100 text-slate-700 focus:ring-slate-400 dark:text-slate-200 dark:hover:bg-slate-800',
    gradient: 'bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg shadow-violet-200 focus:ring-pink-500 dark:shadow-none',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200 focus:ring-red-500 dark:shadow-none',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 rounded-2xl',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
