'use client';

import React from 'react';
import { LogOut, UserCheck, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  teacherName?: string;
  schoolName?: string;
  onLogout?: () => void;
}

export function Header({ teacherName = 'Teacher', schoolName, onLogout }: HeaderProps) {
  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-soft)] flex items-center justify-center border border-[var(--color-primary)]/20">
            <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="font-semibold text-base leading-tight text-[var(--color-text-primary)]">
              Career Discovery <span className="text-[var(--color-text-muted)] font-normal text-xs sm:text-sm">| Educator Portal</span>
            </h1>
            {schoolName && <p className="text-xs text-[var(--color-text-secondary)] font-normal">{schoolName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
            <UserCheck className="w-3.5 h-3.5 text-[var(--color-success)]" />
            <span>Logged in as <strong className="text-[var(--color-text-primary)] font-medium">{teacherName}</strong></span>
          </div>

          <ThemeToggle />

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
