'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, KeyRound, ArrowRight, ShieldCheck, Compass, Brain, Users, CheckCircle, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] selection:bg-[var(--color-primary-soft)] selection:text-[var(--color-primary)] font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-[var(--color-primary)]">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[var(--color-cyan)]" />
              <span>Teacher Login</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute inset-0 hero-gradient -z-10" />
          {/* Abstract background shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--color-primary-soft)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--color-cyan-soft)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Your future isn't one straight line</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-[var(--color-text-primary)] leading-[1.15]">
                Discover what makes you <span className="text-[var(--color-primary)]">uniquely you.</span>
              </h1>
              <p className="text-lg lg:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto lg:mx-0">
                Explore your interests, strengths, and thinking style — and take the next step toward a future that feels right for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={scrollToHowItWorks}
                  className="px-8 py-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Access Code Card */}
            <div id="access-card" className="flex-1 w-full max-w-md z-10 scroll-mt-32">
              <div className="bg-[var(--color-surface)] rounded-3xl p-8 shadow-md border border-[var(--color-border-subtle)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Your journey starts here</h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">Already have your access code?</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  Enter the access code shared by your teacher or counselor. Your code gives you secure access to your personal career journey.
                </p>

                <form onSubmit={handleStudentAccess} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={8}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="A B C 1 2 X Y"
                      className="w-full px-4 py-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-center font-mono text-xl font-bold tracking-[0.5em] text-[var(--color-text-primary)] uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all placeholder:tracking-normal"
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-2 flex items-center justify-center gap-1">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isLoading ? 'Preparing Journey...' : 'Continue'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-[var(--color-surface)] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">How it works</h2>
              <p className="text-lg text-[var(--color-text-secondary)]">A simple, calm progression to help you learn more about yourself.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector lines (hidden on mobile) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-[var(--color-border-subtle)] z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border-subtle)]">
                  <Compass className="w-10 h-10 text-[var(--color-primary)]" />
                </div>
                <div className="text-[var(--color-primary)] font-semibold text-sm mb-2">01 — Discover</div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Discover Yourself</h3>
                <p className="text-[var(--color-text-secondary)]">Answer thoughtful questions about what you enjoy, your values, and how you see the world.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-[var(--color-cyan-soft)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border-subtle)]">
                  <Brain className="w-10 h-10 text-[var(--color-cyan)]" />
                </div>
                <div className="text-[var(--color-cyan)] font-semibold text-sm mb-2">02 — Explore</div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Explore Your Thinking</h3>
                <p className="text-[var(--color-text-secondary)]">Try gentle challenges that reveal different ways you approach and solve everyday problems.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-[var(--color-warm-soft)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border-subtle)]">
                  <Users className="w-10 h-10 text-[var(--color-warm)]" />
                </div>
                <div className="text-[var(--color-warm)] font-semibold text-sm mb-2">03 — Reflect</div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Counselor Insight</h3>
                <p className="text-[var(--color-text-secondary)]">Your teacher or counselor adds observations to help you explore career possibilities together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Privacy */}
        <section className="py-20 bg-[var(--color-background-main)] border-t border-[var(--color-border-subtle)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-12 h-12 text-[var(--color-success)] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Your journey belongs to you.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mt-10">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-[var(--color-success)] shrink-0" />
                <div>
                  <h4 className="font-semibold text-[var(--color-text-primary)]">Safe & Secure</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">Your responses are handled securely and access is controlled through your unique code.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-[var(--color-success)] shrink-0" />
                <div>
                  <h4 className="font-semibold text-[var(--color-text-primary)]">For Your Growth</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">Assessments are meant for discovery and are never intended to define your future.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] py-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} Career Discovery & Counselling Tutor.
        </p>
      </footer>
    </div>
  );
}
