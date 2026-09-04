'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-[var(--font-heading)] text-lg tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-gradient">Discovery</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              ← Student Access
            </Link>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-7 sm:p-9 shadow-xl shadow-indigo-500/5 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] border border-indigo-200 dark:border-indigo-800/40 text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-[var(--font-heading)] text-[var(--color-text-primary)]">Educator Portal Login</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Manage student profiles, view responses, and submit observations</p>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Demo Preview Mode Active</span>
              </p>
            </div>
            <p className="text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">
              Explore the full educator dashboard and student management features instantly.
            </p>
            <button
              type="button"
              onClick={handleBypassLogin}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>Instant Educator Dashboard Access →</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                Educator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <span>{isLoading ? 'Authenticating...' : 'Log In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-[var(--color-text-muted)]">
        Educator Portal Access • Open Demo Mode
      </footer>
    </div>
  );
}
