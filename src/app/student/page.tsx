'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Compass, Brain, ArrowRight, CheckCircle2, LogOut, Heart, Clock, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const journeySteps = [
    {
      num: 1,
      title: 'Discover Yourself',
      desc: 'Share your interests, passions, and natural strengths through visual, thoughtful questions.',
      icon: <Search className="w-5 h-5" />,
      done: isQuestionnaireDone,
      href: '/student/questionnaire',
      unlocked: true,
      buttonText: 'Begin Discovery',
      colorClass: 'indigo',
    },
    {
      num: 2,
      title: 'Explore How You Think',
      desc: 'Engage with real-world scenarios that reveal your unique reasoning and decision-making style.',
      icon: <Brain className="w-5 h-5" />,
      done: isAssessmentDone,
      href: '/student/assessment',
      unlocked: isQuestionnaireDone,
      buttonText: 'Start Thinking Challenge',
      colorClass: 'violet',
    },
    {
      num: 3,
      title: 'Counselor Guidance',
      desc: isFeedbackDone
        ? 'Your counselor has reviewed everything and shared their personalized observations.'
        : 'Your educator will review your responses and add their perspective — sit tight!',
      icon: <Heart className="w-5 h-5" />,
      done: isFeedbackDone,
      href: '#',
      unlocked: false,
      buttonText: 'Awaiting Counselor',
      colorClass: 'emerald',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; softBg: string }> = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      softBg: 'bg-indigo-500',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800/50',
      softBg: 'bg-violet-500',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      softBg: 'bg-emerald-500',
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-[var(--font-heading)] text-lg tracking-tight text-[var(--color-text-primary)]">
              Career<span className="text-gradient">Discovery</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-[var(--font-heading)] text-[var(--color-text-primary)] mb-2">
            {greeting}, {student.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {progressPercent === 100
              ? 'All steps complete — your career discovery profile is ready!'
              : 'This is your space to explore who you are. There are no right or wrong answers.'}
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border-subtle)] mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <h2 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Your Journey</h2>
            </div>
            <span className="text-xs font-bold text-[var(--color-primary)]">{completedSteps} of 3 steps</span>
          </div>

          <div className="w-full h-2.5 bg-[var(--color-surface-soft)] rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-4">
            {journeySteps.map((step) => (
              <div key={step.num} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step.done
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]'
                }`}>
                  {step.done ? <CheckCircle2 className="w-3 h-3" /> : step.num}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:block ${step.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text-muted)]'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Journey Cards */}
        <div className="space-y-4">
          {journeySteps.map((step, i) => {
            const colors = colorMap[step.colorClass];
            const isLocked = !step.unlocked && !step.done;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className={`bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border-subtle)] transition-all ${
                  isLocked ? 'opacity-50' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      step.done
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                        : `${colors.bg} ${colors.border} ${colors.text}`
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-[var(--font-heading)] text-[var(--color-text-primary)] mb-0.5">
                        {step.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] text-xs max-w-md leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    {step.done ? (
                      <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    ) : step.num === 3 ? (
                      <div className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium text-xs px-4 py-2 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting Counselor</span>
                      </div>
                    ) : step.unlocked ? (
                      <Link
                        href={step.href}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/15 cursor-pointer active:scale-[0.98]"
                      >
                        <span>{step.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium text-xs px-4 py-2 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)] cursor-not-allowed">
                        <span>Complete previous step first</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement Message */}
        {progressPercent < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-[var(--color-text-muted)] italic">
              Remember — these are clues about who you are, not limits on who you can become.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
