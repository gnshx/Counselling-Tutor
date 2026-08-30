'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TeacherLogin() {
  const [email, setEmail] = useState('teacher@school.com');
  const [password, setPassword] = useState('teacher123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        router.push('/dashboard');
        return;
      }

      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col justify-between selection:bg-[var(--color-primary-soft)] selection:text-[var(--color-primary)] relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[var(--color-primary-soft)] rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/30 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-[var(--color-primary)]">Discovery</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              ← Student Access
            </Link>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-3xl p-8 shadow-md backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Teacher Login</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Access the Educator Portal to manage students and feedback</p>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="p-4 rounded-2xl bg-[var(--color-warm-soft)] border border-[var(--color-warm)]/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold flex items-center gap-1.5 text-[var(--color-warm)]">
                <Sparkles className="w-4 h-4" />
                <span>Open Preview Mode Active</span>
              </p>
            </div>
            <p className="text-[var(--color-text-secondary)]">
              JWT lock is temporarily relaxed so guests & friends can explore the dashboard without login errors!
            </p>
            <button
              type="button"
              onClick={handleBypassLogin}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-[var(--color-warm)] hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Instant Guest Access to Dashboard →</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                Teacher Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Log In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[var(--color-text-muted)]">
        Teacher Portal Access • Open Demo Mode
      </footer>
    </div>
  );
}
