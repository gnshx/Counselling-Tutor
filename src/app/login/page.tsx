'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, Compass, UserPlus, LogIn, User, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { language } = useLanguage();
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (language === 'hi' ? 'अमान्य ईमेल या पासवर्ड' : 'Invalid email or password'));
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError(language === 'hi' ? 'कनेक्शन त्रुटि। कृपया पुन: प्रयास करें।' : 'Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !signupEmail.trim() || !signupPassword) {
      setError(
        language === 'hi'
          ? 'कृपया अपना पूरा नाम, ईमेल और पासवर्ड दर्ज करें।'
          : 'Please enter your full name, email, and password.'
      );
      return;
    }

    if (signupPassword.length < 6) {
      setError(
        language === 'hi'
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (language === 'hi' ? 'खाता बनाने में विफल।' : 'Failed to create account.'));
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError(language === 'hi' ? 'कनेक्शन त्रुटि। कृपया पुन: प्रयास करें।' : 'Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col justify-between selection:bg-blue-500/20">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-[var(--font-heading)] text-lg tracking-tight text-[var(--color-text-primary)]">
              {language === 'hi' ? 'करियर ' : 'Career'}
              <span className="text-blue-500 font-bold">{language === 'hi' ? 'मार्गदर्शक' : 'Discovery'}</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-blue-500 transition-colors">
              {language === 'hi' ? '← विद्यार्थी प्रवेश' : '← Student Access'}
            </Link>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto px-4 py-10 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-7 sm:p-9 shadow-xl shadow-blue-500/5 space-y-6"
        >
          {/* Header & Mode Switcher */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm shadow-blue-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                {mode === 'login'
                  ? language === 'hi'
                    ? 'शिक्षक / परामर्शदाता लॉगिन'
                    : 'Teacher / Counselor Login'
                  : language === 'hi'
                  ? 'शिक्षक खाता बनाएँ'
                  : 'Create Teacher Account'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {mode === 'login'
                  ? language === 'hi'
                    ? 'विद्यार्थी सूची और आकलनों को देखने के लिए साइन इन करें'
                    : 'Sign in to access your student roster and evaluations'
                  : language === 'hi'
                  ? 'विद्यार्थी आकलनों का प्रबंधन करने के लिए अपना नाम और ईमेल दर्ज करें'
                  : 'Register with your name and email to manage student evaluations'}
              </p>
            </div>

            {/* Tab Switcher Pills */}
            <div className="flex p-1 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉग इन' : 'Log In'}</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'साइन अप' : 'Sign Up'}</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                {/* Login Email */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                  </div>
                </div>

                {/* Login Password */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3.5 text-[var(--color-text-muted)] hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400 font-medium text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                >
                  <span>
                    {isLoading
                      ? language === 'hi'
                        ? 'साइन इन हो रहा है...'
                        : 'Signing in...'
                      : language === 'hi'
                      ? 'डैशबोर्ड में लॉग इन करें'
                      : 'Log In to Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-[var(--color-text-secondary)] pt-1">
                  {language === 'hi' ? 'खाता नहीं है? ' : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-semibold text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'साइन अप' : 'Sign Up'}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                {/* Signup Name */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा. गणेश शर्मा' : 'e.g. Ganesh Sharma'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                  </div>
                </div>

                {/* Signup Email */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'ईमेल पता' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                  </div>
                </div>

                {/* Signup Password */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder={language === 'hi' ? 'कम से कम 6 अक्षर' : 'Min. 6 characters'}
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 top-3.5 text-[var(--color-text-muted)] hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Signup Confirm Password */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === 'hi' ? 'पासवर्ड दोबारा दर्ज करें' : 'Repeat password'}
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:bg-slate-900/90 dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-[var(--color-text-muted)] hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400 font-medium text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                >
                  <span>{isLoading ? (language === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...') : (language === 'hi' ? 'खाता बनाएँ और आगे बढ़ें' : 'Sign Up & Continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-[var(--color-text-secondary)] pt-1">
                  {language === 'hi' ? 'पहले से खाता है? ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-semibold text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'लॉग इन' : 'Log In'}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-[var(--color-text-muted)]">
        Career Discovery & Counselling Platform • Secure Access
      </footer>
    </div>
  );
}
