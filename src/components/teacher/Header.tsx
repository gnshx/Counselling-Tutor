'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCheck, GraduationCap, AlertCircle, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  teacherName?: string;
  schoolName?: string;
  onLogout?: () => void;
}

export function Header({ teacherName = 'Teacher', schoolName, onLogout }: HeaderProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
      }
    } catch {
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
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
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-md w-full border border-[var(--color-border-subtle)] shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">Confirm Logout</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Educator Session</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Are you sure you want to log out of the Educator Portal? Any unsaved feedback draft will be discarded.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Confirm Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
