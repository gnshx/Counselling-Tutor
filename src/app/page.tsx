'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Compass, Brain, Users, CheckCircle, Shield, GraduationCap, Sparkles, Heart, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStudentAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('Please enter your 8-character access code.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/student/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim().toUpperCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Access code not recognized.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('student_session', JSON.stringify(data.student));
      router.push('/student');
    } catch {
      setError('Something didn\'t go as planned. Please try again.');
      setIsLoading(false);
    }
  };

  const scrollToAccess = () => {
    const card = document.getElementById('access-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] selection:bg-indigo-500/30 selection:text-[var(--color-text-primary)]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm text-white">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-[var(--font-heading)] text-xl tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-gradient font-bold">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Educator Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* ──── Hero Section ──── */}
        <section className="relative overflow-hidden pt-16 sm:pt-28 pb-20 sm:pb-36">
          {/* Background glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-indigo-500/8 via-violet-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/6 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex-1 text-center lg:text-left z-10 space-y-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-soft)] border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guided Career Discovery Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-[var(--font-heading)] tracking-tight text-[var(--color-text-primary)] leading-[1.15]">
                Discover what makes{' '}
                <span className="text-gradient">you, you.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A calm, encouraging journey to explore your natural interests,
                strengths, and thinking style — guided by your counselor every step of the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-1">
                <button
                  onClick={scrollToAccess}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  Begin Your Journey
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Access Code Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              id="access-card"
              className="flex-1 w-full max-w-md z-10 scroll-mt-32"
            >
              <div className="bg-[var(--color-surface)] rounded-2xl p-7 sm:p-9 shadow-xl shadow-indigo-500/5 border border-[var(--color-border-subtle)] relative overflow-hidden space-y-6">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] border border-indigo-200 dark:border-indigo-700/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text-primary)]">Student Access</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">Enter your personal access code</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Your educator has provided you with a unique code. Enter it below to start discovering your strengths and interests.
                </p>

                <form onSubmit={handleStudentAccess} className="space-y-4">
                  <div>
                    <input
                      ref={inputRef}
                      type="text"
                      maxLength={8}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="Enter your code"
                      className="w-full px-4 py-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-center font-mono text-xl font-bold tracking-[0.3em] text-[var(--color-text-primary)] uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[var(--color-text-muted)]"
                    />
                    {error && (
                      <p className="text-xs text-rose-500 font-semibold mt-2.5 text-center">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <span>{isLoading ? 'Preparing your journey...' : 'Continue to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ──── Journey Steps ──── */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[var(--color-surface)] border-y border-[var(--color-border-subtle)] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-2xl sm:text-4xl font-[var(--font-heading)] text-[var(--color-text-primary)]">Your Discovery Journey</h2>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-lg mx-auto">
                Three thoughtful steps to understand yourself better — no right or wrong answers, just genuine exploration.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Search className="w-6 h-6" />,
                  step: '01',
                  title: 'Discover Yourself',
                  desc: 'Share your interests, passions, and natural strengths through thoughtful, visual questions.',
                  color: 'indigo',
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  step: '02',
                  title: 'Explore How You Think',
                  desc: 'Engage with real-world scenarios that reveal your unique problem-solving and reasoning style.',
                  color: 'violet',
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  step: '03',
                  title: 'Counselor Guidance',
                  desc: 'Your educator reviews everything and adds their personal insights to guide your career path.',
                  color: 'emerald',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] flex flex-col items-start text-left space-y-5 hover:-translate-y-1 transition-all cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.color === 'indigo'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50'
                      : item.color === 'violet'
                      ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                  }`}>
                    {item.icon}
                  </div>
                  <div className={`font-bold text-xs uppercase tracking-wider ${
                    item.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400'
                    : item.color === 'violet' ? 'text-violet-600 dark:text-violet-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── Trust & Privacy ──── */}
        <section className="py-20 bg-[var(--color-background-main)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-[var(--font-heading)] text-[var(--color-text-primary)]">Safe, Private & Growth-Oriented</h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto">
                Built for schools — your data stays safe, and every result is framed as a clue for growth, not a score or judgment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left pt-4">
              <div className="flex gap-4 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">Secure Access Control</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">Unique access keys isolate student records and restrict profile access exclusively to assigned educators.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">Growth-Oriented Assessment</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">Evaluations emphasize development areas and natural affinity — these are clues, not limits.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] py-8 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Career Discovery & Counselling Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
