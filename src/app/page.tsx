'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, KeyRound, ArrowRight, ShieldCheck, Compass, Brain, Users, CheckCircle, Shield, GraduationCap, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm text-white">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-blue-600 dark:text-blue-400 font-extrabold">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs hover:shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Teacher Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 sm:pt-24 pb-20 sm:pb-32">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI-Assisted Career Discovery Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-[1.12]">
                Discover what makes you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">uniquely you.</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore your natural interests, strengths, and thinking style — taking guided, confident steps toward a future tailored for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button 
                  onClick={scrollToHowItWorks}
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Access Code Card */}
            <div id="access-card" className="flex-1 w-full max-w-md z-10 scroll-mt-32">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden space-y-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Student Portal Access</h2>
                    <p className="text-xs text-[var(--color-text-secondary)]">Enter your 8-character access code</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Enter the access code provided by your educator to log in and complete your career discovery activities.
                </p>

                <form onSubmit={handleStudentAccess} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={8}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="A B C 1 2 X Y"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center font-mono text-xl font-bold tracking-[0.35em] text-[var(--color-text-primary)] uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
                    />
                    {error && (
                      <p className="text-xs text-rose-500 font-semibold mt-2 text-center">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <span>{isLoading ? 'Preparing Journey...' : 'Continue to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[var(--color-surface)] border-y border-[var(--color-border-subtle)] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold text-[var(--color-text-primary)]">How the Process Works</h2>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto">A simple three-step journey to explore and understand student strengths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] flex flex-col items-start text-left space-y-4 hover:-translate-y-1 transition-all shadow-2xs hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">Step 01</div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Self-Discovery Questionnaire</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Students answer structured questions regarding personal preferences, subject interests, and future goals.</p>
              </div>

              <div className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] flex flex-col items-start text-left space-y-4 hover:-translate-y-1 transition-all shadow-2xs hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">Step 02</div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Reasoning & Mindset Challenge</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Interactive scenario challenges measure problem solving, logical reasoning, and analytical thinking.</p>
              </div>

              <div className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] flex flex-col items-start text-left space-y-4 hover:-translate-y-1 transition-all shadow-2xs hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">Step 03</div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Educator Synthesis & Feedback</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Educators review student data alongside classroom observations to produce actionable career recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Privacy */}
        <section className="py-20 bg-[var(--color-background-main)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Designed for Educational Integrity & Privacy</h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xl mx-auto">Built from the ground up for schools, ensuring data protection and positive guidance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left pt-4">
              <div className="flex gap-4 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-2xs">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-[var(--color-text-primary)]">Secure Access Control</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">Unique access keys isolate student records and restrict profile access exclusively to assigned educators.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-2xs">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-[var(--color-text-primary)]">Growth-Oriented Assessment</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">Evaluations emphasize development areas and natural affinity rather than high-pressure grading scores.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] py-8 text-center">
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} Career Discovery & Counselling Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

