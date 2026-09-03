'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Compass, Sparkles, Brain, ArrowRight, CheckCircle2, LogOut, MessageCircle, Clock } from 'lucide-react';

interface StudentSession {
  id: string;
  name: string;
  classGrade: string;
  questionnaireStatus: string;
  assessmentStatus: string;
  feedbackStatus?: string;
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
      const parsed: StudentSession = JSON.parse(sessionStr);
      setStudent(parsed);

      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      // Fetch latest student status from DB to ensure teacher feedback status is up-to-date
      fetch(`/api/student/${parsed.id}/status`)
        .then((res) => res.json())
        .then((data) => {
          if (data.student) {
            const updated = {
              ...parsed,
              questionnaireStatus: data.student.questionnaireStatus,
              assessmentStatus: data.student.assessmentStatus,
              feedbackStatus: data.student.feedbackStatus,
            };
            setStudent(updated);
            localStorage.setItem('student_session', JSON.stringify(updated));
          }
        })
        .catch((err) => console.error('Failed to sync student status:', err));
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
  const isFeedbackDone = student.feedbackStatus === 'completed';

  let completedSteps = 0;
  if (isQuestionnaireDone) completedSteps++;
  if (isAssessmentDone) completedSteps++;
  if (isFeedbackDone) completedSteps++;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      {/* Header */}
      <header className="bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-[var(--color-primary)] font-bold">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col z-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)] mb-1">
            {greeting}, {student.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Explore your interests and complete your career discovery steps.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border-subtle)] shadow-2xs mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Overall Progress</h2>
            <span className="text-xs font-semibold text-[var(--color-primary)]">{completedSteps} of 3 completed ({progressPercent}%)</span>
          </div>

          <div className="w-full h-2.5 bg-[var(--color-surface-soft)] rounded-full mb-3 overflow-hidden border border-[var(--color-border-subtle)]">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            {progressPercent === 100
              ? 'All student and educator steps are complete.'
              : 'Complete all steps to finish your career discovery profile.'}
          </p>
        </div>

        {/* Journey Cards Container */}
        <div className="space-y-4">
          {/* Card 1 — Discover Yourself */}
          <div className="bg-[var(--color-surface)] rounded-xl p-5 sm:p-6 border border-[var(--color-border-subtle)] shadow-2xs transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                  isQuestionnaireDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-0.5">1. Discover Yourself</h3>
                  <p className="text-[var(--color-text-secondary)] text-xs max-w-md">Explore your interests, preferences, values, and aspirations.</p>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0">
                {isQuestionnaireDone ? (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <Link
                    href="/student/questionnaire"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Start Questionnaire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 — Explore Your Thinking */}
          <div className={`bg-[var(--color-surface)] rounded-xl p-5 sm:p-6 border border-[var(--color-border-subtle)] shadow-2xs transition-colors ${
            !isQuestionnaireDone ? 'opacity-60' : ''
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAssessmentDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 text-sky-600 dark:text-sky-400'
                }`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-0.5">2. Explore Your Thinking</h3>
                  <p className="text-[var(--color-text-secondary)] text-xs max-w-md">Try scenario challenges covering reasoning and decision making.</p>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0">
                {isAssessmentDone ? (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <Link
                    href={isQuestionnaireDone ? "/student/assessment" : "#"}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs transition-colors ${
                      isQuestionnaireDone
                        ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-2xs cursor-pointer'
                        : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] cursor-not-allowed'
                    }`}
                  >
                    <span>{isQuestionnaireDone ? 'Start Challenge' : 'Complete Step 1 First'}</span>
                    {isQuestionnaireDone && <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 3 — Counselor Insight */}
          <div className="bg-[var(--color-surface)] rounded-xl p-5 sm:p-6 border border-[var(--color-border-subtle)] shadow-2xs transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                  isFeedbackDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
                }`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-0.5">3. Educator Observations</h3>
                  <p className="text-[var(--color-text-secondary)] text-xs max-w-md">
                    {isFeedbackDone
                      ? 'Your educator has completed their review and submitted recommendations.'
                      : 'Your educator will review your responses and add observation notes.'}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0">
                {isFeedbackDone ? (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium text-xs px-3 py-1.5 bg-[var(--color-surface-soft)] rounded-lg border border-[var(--color-border-subtle)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Educator</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
