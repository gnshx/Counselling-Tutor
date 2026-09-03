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
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]';

  const variantClasses = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-2xs',
    secondary: 'bg-[var(--color-surface-soft)] hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]',
    outline: 'border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] bg-[var(--color-surface)]',
    ghost: 'hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
    gradient: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-2xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
    md: 'px-4 py-2 text-sm gap-2 rounded-lg',
    lg: 'px-5 py-2.5 text-base gap-2 rounded-lg',
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
