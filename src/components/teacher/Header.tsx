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
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] flex items-center justify-center border border-[var(--color-primary)]/30">
            <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-[var(--color-text-primary)]">
              Career Discovery <span className="text-[var(--color-text-muted)] font-medium">| Educator Portal</span>
            </h1>
            {schoolName && <p className="text-xs text-[var(--color-text-secondary)] font-medium">{schoolName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
            <UserCheck className="w-4 h-4 text-[var(--color-success)]" />
            <span>Logged in as <strong className="text-[var(--color-text-primary)] font-semibold">{teacherName}</strong></span>
          </div>

          <ThemeToggle />

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] border border-[var(--color-border-subtle)] transition-all cursor-pointer shadow-sm"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
