'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  Compass,
  Brain,
  ArrowRight,
  CheckCircle2,
  LogOut,
  Heart,
  Clock,
  Search,
  Sparkles,
  X,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAssessmentResponse, FormattedAssessmentData } from '@/lib/utils/profile-formatter';

interface StudentSession {
  id: string;
  name: string;
  classGrade: string;
  questionnaireStatus: string;
  assessmentStatus: string;
  feedbackStatus?: string;
}

interface RawAssessmentData {
  score: number;
  totalQuestions: number;
  responses: Array<{ questionId: string; selectedAnswer: string; isCorrect: boolean }>;
}

export default function StudentPortalPage() {
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [timePeriod, setTimePeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [rawAssessment, setRawAssessment] = useState<RawAssessmentData | null>(null);
  const [showAssessmentReview, setShowAssessmentReview] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const { language } = useLanguage();
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
      if (hour < 12) setTimePeriod('morning');
      else if (hour < 18) setTimePeriod('afternoon');
      else setTimePeriod('evening');

      // Check if URL specifies auto-opening review
      if (typeof window !== 'undefined' && window.location.search.includes('review=assessment')) {
        setShowAssessmentReview(true);
      }

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

  // Load assessment response when assessment status is completed
  useEffect(() => {
    if (!student?.id || student.assessmentStatus !== 'completed') return;

    setIsLoadingAssessment(true);
    fetch(`/api/student/${student.id}/assessment`)
      .then((res) => res.json())
      .then((data) => {
        if (data.assessmentResponse) {
          setRawAssessment(data.assessmentResponse);
        }
      })
      .catch((err) => console.error('Failed to load student assessment response:', err))
      .finally(() => setIsLoadingAssessment(false));
  }, [student?.id, student?.assessmentStatus]);

  const handleLogout = () => {
    localStorage.removeItem('student_session');
    router.push('/');
  };

  if (!student) return null;

  const greeting =
    language === 'hi'
      ? timePeriod === 'morning'
        ? 'शुभ प्रभात'
        : timePeriod === 'afternoon'
        ? 'शुभ दोपहर'
        : 'शुभ संध्या'
      : timePeriod === 'morning'
      ? 'Good morning'
      : timePeriod === 'afternoon'
      ? 'Good afternoon'
      : 'Good evening';

  const isQuestionnaireDone = student.questionnaireStatus === 'completed';
  const isAssessmentDone = student.assessmentStatus === 'completed';
  const isFeedbackDone = student.feedbackStatus === 'completed';

  let completedSteps = 0;
  if (isQuestionnaireDone) completedSteps++;
  if (isAssessmentDone) completedSteps++;
  if (isFeedbackDone) completedSteps++;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  const assessmentData: FormattedAssessmentData | null = rawAssessment
    ? formatAssessmentResponse(rawAssessment, language)
    : null;

  const filteredQuestions = assessmentData?.questionDetails.filter((q) => {
    if (filterType === 'correct') return q.isCorrect;
    if (filterType === 'incorrect') return !q.isCorrect;
    return true;
  }) || [];

  const journeySteps = [
    {
      num: 1,
      title: language === 'hi' ? 'खुद को जानें' : 'Discover Yourself',
      desc:
        language === 'hi'
          ? 'आसान और रोचक प्रश्नों के ज़रिए अपनी पसंद, रुचियों और स्वाभाविक खूबियों को साझा करें।'
          : 'Share your interests, passions, and natural strengths through visual, thoughtful questions.',
      icon: <Search className="w-5 h-5" />,
      done: isQuestionnaireDone,
      href: '/student/questionnaire',
      unlocked: true,
      buttonText: language === 'hi' ? 'शुरू करें' : 'Begin Discovery',
      colorClass: 'indigo',
    },
    {
      num: 2,
      title: language === 'hi' ? 'अपनी सोच को समझें' : 'Explore How You Think',
      desc:
        language === 'hi'
          ? 'रोज़मर्रा की परिस्थितियों के माध्यम से अपनी समस्या सुलझाने और सोचने के तरीके को समझें।'
          : 'Engage with real-world scenarios that reveal your unique reasoning and decision-making style.',
      icon: <Brain className="w-5 h-5" />,
      done: isAssessmentDone,
      href: '/student/assessment',
      unlocked: isQuestionnaireDone,
      buttonText: language === 'hi' ? 'शुरू करें' : 'Start Thinking Challenge',
      colorClass: 'violet',
    },
    {
      num: 3,
      title: language === 'hi' ? 'परामर्शदाता का मार्गदर्शन' : 'Counselor Guidance',
      desc: isFeedbackDone
        ? language === 'hi'
          ? 'आपके शिक्षक/परामर्शदाता ने सभी उत्तरों की समीक्षा कर अपना मार्गदर्शन जोड़ दिया है।'
          : 'Your counselor has reviewed everything and shared their personalized observations.'
        : language === 'hi'
        ? 'आपके शिक्षक आपके उत्तरों की समीक्षा करेंगे और अपना मार्गदर्शन जोड़ेंगे।'
        : 'Your educator will review your responses and add their perspective — sit tight!',
      icon: <Heart className="w-5 h-5" />,
      done: isFeedbackDone,
      href: '#',
      unlocked: false,
      buttonText: language === 'hi' ? 'मार्गदर्शन प्रतीक्षारत' : 'Awaiting Counselor',
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
              {language === 'hi' ? 'करियर ' : 'Career'}
              <span className="text-gradient">{language === 'hi' ? 'मार्गदर्शक' : 'Discovery'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉगआउट' : 'Exit'}</span>
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
              ? language === 'hi'
                ? 'सभी चरण पूर्ण — आपकी प्रोफ़ाइल तैयार है!'
                : 'All steps complete — your career discovery profile is ready!'
              : language === 'hi'
              ? 'यह आपकी अपनी रुचियों को जानने की जगह है। यहाँ कोई सही या गलत उत्तर नहीं है।'
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
              <h2 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                {language === 'hi' ? 'आपकी यात्रा' : 'Your Journey'}
              </h2>
            </div>
            <span className="text-xs font-bold text-[var(--color-primary)]">
              {language === 'hi' ? `3 में से ${completedSteps} चरण पूर्ण` : `${completedSteps} of 3 steps`}
            </span>
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
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-3 h-3" /> : step.num}
                </div>
                <span
                  className={`text-[11px] font-semibold hidden sm:block ${
                    step.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assessment Completed Quick Review Card */}
        {isAssessmentDone && assessmentData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 border border-violet-500/25 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)]">
                    {language === 'hi' ? 'अभिरुचि चुनौती के परिणाम व व्याख्या' : 'Thinking Challenge Solutions & Explanations'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                    {assessmentData.score} / {assessmentData.totalQuestions} ({assessmentData.percent}%)
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {language === 'hi'
                    ? 'सभी 15 प्रश्नों के सही उत्तर, आपका चयन और उनकी विस्तृत व्याख्या देखें।'
                    : 'Review every question, check your selected choice, and explore step-by-step explanations.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAssessmentReview(true)}
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{language === 'hi' ? 'उत्तर एवं व्याख्या देखें' : 'View Explanations'}</span>
            </button>
          </motion.div>
        )}

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
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        step.done
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                          : `${colors.bg} ${colors.border} ${colors.text}`
                      }`}
                    >
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
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="inline-flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'hi' ? 'पूर्ण' : 'Completed'}</span>
                        </div>
                        {step.num === 2 && (
                          <button
                            type="button"
                            onClick={() => setShowAssessmentReview(true)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-sm shadow-violet-500/15 transition-all cursor-pointer active:scale-[0.98]"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'उत्तर एवं व्याख्या देखें' : 'View Answers & Explanations'}</span>
                          </button>
                        )}
                      </div>
                    ) : step.num === 3 ? (
                      <div className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium text-xs px-4 py-2 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'परामर्शदाता की प्रतीक्षा' : 'Awaiting Counselor'}</span>
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
                        <span>{language === 'hi' ? 'पहले पिछला चरण पूरा करें' : 'Complete previous step first'}</span>
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
              {language === 'hi'
                ? 'याद रखें — ये आपके बारे में संकेत हैं, आप क्या बन सकते हैं इस पर कोई सीमा नहीं।'
                : 'Remember — these are clues about who you are, not limits on who you can become.'}
            </p>
          </motion.div>
        )}
      </main>

      {/* Answers & Explanations Modal */}
      <AnimatePresence>
        {showAssessmentReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--color-surface)] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-800/60 shrink-0">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-[var(--font-heading)] font-bold text-base text-[var(--color-text-primary)]">
                      {language === 'hi' ? 'अभिरुचि चुनौती: उत्तर और व्याख्या' : 'Thinking Challenge: Answers & Explanations'}
                    </h2>
                    {assessmentData && (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {language === 'hi' ? 'कुल प्राप्तांक: ' : 'Total Score: '}
                        <span className="font-bold text-violet-600 dark:text-violet-400">
                          {assessmentData.score} / {assessmentData.totalQuestions} ({assessmentData.percent}%)
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAssessmentReview(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingAssessment ? (
                <div className="py-20 text-center text-[var(--color-text-muted)] text-sm">
                  {language === 'hi' ? 'उत्तर व व्याख्या लोड हो रही है...' : 'Loading solutions & explanations...'}
                </div>
              ) : !assessmentData ? (
                <div className="py-20 text-center text-[var(--color-text-muted)] text-sm">
                  {language === 'hi'
                    ? 'अभिरुचि चुनौती का परिणाम उपलब्ध नहीं है।'
                    : 'Assessment responses not available.'}
                </div>
              ) : (
                <>
                  {/* Category Pills & Filters */}
                  <div className="px-6 py-3 bg-[var(--color-surface-soft)]/60 border-b border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)]">
                      <button
                        type="button"
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          filterType === 'all'
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {language === 'hi' ? 'सभी प्रश्न' : 'All'} ({assessmentData.questionDetails.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterType('correct')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          filterType === 'correct'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {language === 'hi' ? 'सही उत्तर' : 'Correct'} ({assessmentData.score})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterType('incorrect')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          filterType === 'incorrect'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {language === 'hi' ? 'पुनरावलोकन' : 'To Review'} (
                        {assessmentData.totalQuestions - assessmentData.score})
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {assessmentData.categories.map((cat) => (
                        <span
                          key={cat.key}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]"
                        >
                          {cat.label.split(' ')[0]} {cat.score}/{cat.total}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Questions Scrollable List */}
                  <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    {filteredQuestions.length === 0 ? (
                      <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">
                        {language === 'hi' ? 'कोई प्रश्न नहीं मिला।' : 'No questions found for this filter.'}
                      </div>
                    ) : (
                      filteredQuestions.map((q, idx) => {
                        const qParts = q.question.split('\n');
                        const mainQ = qParts[0];
                        const subQ = qParts.slice(1).join('\n');

                        return (
                          <div
                            key={q.id}
                            className="bg-[var(--color-surface-soft)] rounded-xl p-5 border border-[var(--color-border-subtle)] space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                                  {q.categoryLabel}
                                </span>
                                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">
                                  {idx + 1}. {mainQ}
                                </h4>
                                {subQ && (
                                  <div className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-mono text-sm font-semibold text-[var(--color-text-primary)]">
                                    {subQ}
                                  </div>
                                )}
                              </div>
                              {q.isCorrect ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'hi' ? 'सही' : 'Correct'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/60 shrink-0">
                                  <XCircle className="w-3.5 h-3.5" /> {language === 'hi' ? 'गलत' : 'Incorrect'}
                                </span>
                              )}
                            </div>

                            {/* Answers Comparison Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div
                                className={`p-3 rounded-lg border ${
                                  q.isCorrect
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                                }`}
                              >
                                <span className="text-[var(--color-text-secondary)] block text-[11px] mb-0.5">
                                  {language === 'hi' ? 'आपका चयन:' : 'Your Selection:'}
                                </span>
                                <strong
                                  className={
                                    q.isCorrect
                                      ? 'text-emerald-700 dark:text-emerald-300'
                                      : 'text-rose-700 dark:text-rose-300'
                                  }
                                >
                                  {q.selectedAnswer}
                                </strong>
                              </div>

                              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                                <span className="text-[var(--color-text-secondary)] block text-[11px] mb-0.5">
                                  {language === 'hi' ? 'सही उत्तर:' : 'Correct Answer:'}
                                </span>
                                <strong className="text-[var(--color-text-primary)]">
                                  {q.correctAnswer}
                                </strong>
                              </div>
                            </div>

                            {/* Explanation Box */}
                            {q.explanation && (
                              <div className="p-3.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/50 text-xs flex items-start gap-2.5">
                                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <span className="font-bold text-indigo-800 dark:text-indigo-300">
                                    {language === 'hi' ? 'उत्तर की व्याख्या:' : 'Explanation:'}
                                  </span>
                                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                    {q.explanation}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] flex items-center justify-end bg-[var(--color-surface)]">
                    <button
                      type="button"
                      onClick={() => setShowAssessmentReview(false)}
                      className="px-5 py-2 rounded-xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-surface)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
                    >
                      {language === 'hi' ? 'बंद करें' : 'Close'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
