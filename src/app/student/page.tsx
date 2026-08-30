'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Compass, Sparkles, Brain, Users, ArrowRight, CheckCircle2, LogOut, Sun, MessageCircle } from 'lucide-react';

interface StudentSession {
  id: string;
  name: string;
  classGrade: string;
  questionnaireStatus: string;
  assessmentStatus: string;
}

export default function StudentPortalPage() {
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [greeting, setGreeting] = useState('Good day');
  const router = useRouter();

  useEffect(() => {
    const sessionStr = localStorage.getItem('student_session');
    if (!sessionStr) {
      router.push('/');
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      setStudent(parsed);
      
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    } catch {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('student_session');
    router.push('/');
  };

  if (!student) return null;

  const isQuestionnaireDone = student.questionnaireStatus === 'completed';
  const isAssessmentDone = student.assessmentStatus === 'completed';
  
  let completedSteps = 0;
  if (isQuestionnaireDone) completedSteps++;
  if (isAssessmentDone) completedSteps++;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans">
      {/* Header */}
      <header className="bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-[var(--color-primary)]">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1 flex flex-col z-10">
        
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            {greeting}, {student.name.split(' ')[0]} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Ready to discover a little more about yourself?
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-md mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Your Journey</h2>
          
          <div className="flex items-end justify-between mb-2">
            <span className="text-[var(--color-text-primary)] font-semibold">{completedSteps} of 3 steps completed</span>
            <span className="text-[var(--color-primary)] font-bold">{progressPercent}%</span>
          </div>
          
          <div className="w-full h-3 bg-[var(--color-surface-soft)] rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <p className="text-[var(--color-success)] font-medium flex items-center gap-2">
            You're making great progress! 🌱
          </p>
        </div>

        {/* Journey Cards Container */}
        <div className="space-y-6">
          
          {/* Card 1 — Discover Yourself */}
          <div className={`bg-[var(--color-surface)] rounded-[2rem] p-6 sm:p-8 border transition-all ${
            isQuestionnaireDone ? 'border-[var(--color-border-subtle)]' : 'border-[var(--color-primary)] shadow-[0_8px_30px_rgba(99,102,241,0.12)]'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  isQuestionnaireDone ? 'bg-[var(--color-surface-soft)]' : 'bg-[var(--color-primary-soft)]'
                }`}>
                  <Compass className={`w-7 h-7 ${isQuestionnaireDone ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-primary)]'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Discover Yourself</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm max-w-md">Explore your interests, preferences, values, and aspirations.</p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto shrink-0">
                {isQuestionnaireDone ? (
                  <div className="flex items-center gap-2 text-[var(--color-success)] font-semibold px-4 py-2 bg-[var(--color-success-soft)] rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <Link
                    href="/student/questionnaire"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 — Explore Your Thinking */}
          <div className={`bg-[var(--color-surface)] rounded-[2rem] p-6 sm:p-8 border transition-all ${
            !isQuestionnaireDone ? 'opacity-60 border-[var(--color-border-subtle)]' :
            isAssessmentDone ? 'border-[var(--color-border-subtle)]' : 'border-[var(--color-cyan)] shadow-[0_8px_30px_rgba(6,182,212,0.12)]'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  isAssessmentDone ? 'bg-[var(--color-surface-soft)]' : 'bg-[var(--color-cyan-soft)]'
                }`}>
                  <Brain className={`w-7 h-7 ${isAssessmentDone ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-cyan)]'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Explore Your Thinking</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm max-w-md">Try a few thoughtful challenges covering logic, language, and problem solving.</p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto shrink-0">
                {isAssessmentDone ? (
                  <div className="flex items-center gap-2 text-[var(--color-success)] font-semibold px-4 py-2 bg-[var(--color-success-soft)] rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <Link
                    href={isQuestionnaireDone ? "/student/assessment" : "#"}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all ${
                      isQuestionnaireDone 
                        ? 'bg-[var(--color-cyan)] hover:bg-[#0891b2] text-white shadow-sm cursor-pointer' 
                        : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] cursor-not-allowed'
                    }`}
                  >
                    <span>{isQuestionnaireDone ? 'Continue Assessment' : 'Locked'}</span>
                    {isQuestionnaireDone && <ArrowRight className="w-4 h-4" />}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 3 — Counselor Insight */}
          <div className="bg-[var(--color-surface)] rounded-[2rem] p-6 sm:p-8 border border-[var(--color-border-subtle)] opacity-80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--color-warm-soft)]">
                  <MessageCircle className="w-7 h-7 text-[var(--color-warm)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Counselor Insight</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm max-w-md">Your teacher or counselor will add observations and guidance based on your journey.</p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto shrink-0">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-medium px-4 py-2 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
                  <span>Waiting for counselor</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* CSS for wave animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }
      `}} />
    </div>
  );
}
