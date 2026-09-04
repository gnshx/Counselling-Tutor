'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaireQuestions, QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { QuestionCard } from '@/components/student/QuestionCard';
import { QuestionPalette } from '@/components/student/QuestionPalette';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { ArrowLeft, ArrowRight, Check, Sparkles, FastForward, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentQuestionnairePage() {
  const router = useRouter();
  const [student, setStudent] = useState<{ id: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('student_session');
    if (!sessionStr) {
      router.push('/');
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      setStudent(parsed);
    } catch {
      router.push('/');
    }
  }, [router]);

  // Load draft from localStorage when student session is ready
  useEffect(() => {
    if (!student?.id) return;
    const draftKey = `draft_questionnaire_${student.id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers && typeof parsed.answers === 'object') {
          setAnswers(parsed.answers);
        }
        if (parsed.followUpAnswers && typeof parsed.followUpAnswers === 'object') {
          setFollowUpAnswers(parsed.followUpAnswers);
        }
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0 && parsed.currentIndex < questionnaireQuestions.length) {
          setCurrentIndex(parsed.currentIndex);
        }
      } catch {
        // Ignore parse error
      }
    }
  }, [student?.id]);

  // Auto-save draft on answers, followUpAnswers, or index change
  useEffect(() => {
    if (!student?.id) return;
    const draftKey = `draft_questionnaire_${student.id}`;
    if (Object.keys(answers).length > 0 || Object.keys(followUpAnswers).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify({ answers, followUpAnswers, currentIndex }));
    }
  }, [answers, followUpAnswers, currentIndex, student?.id]);

  if (!student) return null;

  const currentQuestion: QuestionnaireQuestion = questionnaireQuestions[currentIndex];
  const totalQuestions = questionnaireQuestions.length;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  // Compute status for every question (Answered / Incomplete / Unanswered)
  const questionsStatus = questionnaireQuestions.map((q) => {
    const val = answers[q.id];
    const hasVal = val !== undefined && val !== null && val !== '' && (!Array.isArray(val) || val.length > 0);

    let isAnswered = false;
    let isIncomplete = false;

    if (hasVal) {
      let proofNeeded = false;
      if (q.type === 'conditional' && q.followUp && val === q.followUp.triggerValue) {
        proofNeeded = true;
      }
      if (q.type === 'single-select' && typeof val === 'string') {
        const selectedOpt = q.options.find((opt) => opt.value === val);
        if (selectedOpt?.proofPrompt || q.proofPrompt) {
          proofNeeded = true;
        }
      }

      if (proofNeeded) {
        if (followUpAnswers[q.id]?.trim()) {
          isAnswered = true;
        } else {
          isIncomplete = true;
        }
      } else {
        isAnswered = true;
      }
    }

    return { id: q.id, isAnswered, isIncomplete };
  });

  const answeredCount = questionsStatus.filter((s) => s.isAnswered).length;
  const unansweredIndices = questionsStatus
    .map((s, idx) => (!s.isAnswered ? idx : null))
    .filter((v): v is number => v !== null);

  const handleAnswerChange = (val: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
    setError('');
    setShowUnansweredWarning(false);
  };

  const handleFollowUpChange = (val: string) => {
    setFollowUpAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
    setError('');
    setShowUnansweredWarning(false);
  };

  const isCurrentAnswered = () => {
    return questionsStatus[currentIndex]?.isAnswered;
  };

  const handleSelectQuestion = (idx: number) => {
    setError('');
    setShowUnansweredWarning(false);
    setCurrentIndex(idx);
  };

  const handleNext = async () => {
    setError('');
    setShowUnansweredWarning(false);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question reached
      if (unansweredIndices.length > 0) {
        setShowUnansweredWarning(true);
      } else {
        await handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    setError('');
    setShowUnansweredWarning(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (unansweredIndices.length > 0 && !showUnansweredWarning) {
      setShowUnansweredWarning(true);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const formattedResponses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer:
          followUpAnswers[questionId]
            ? { choice: answer, detail: followUpAnswers[questionId] }
            : answer,
      }));

      const res = await fetch(`/api/student/${student.id}/questionnaire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something didn\'t go as planned. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Clear draft on successful submission
      localStorage.removeItem(`draft_questionnaire_${student.id}`);
      const updatedStudent = { ...student, questionnaireStatus: 'completed' };
      localStorage.setItem('student_session', JSON.stringify(updatedStudent));

      setIsCompleted(true);
    } catch {
      setError('Something didn\'t go as planned. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)] flex flex-col justify-center px-4 py-6">
        <CompletionScreen
          studentName={student.name}
          onNextJourney={() => router.push('/student/assessment')}
          nextJourneyTitle="Explore Your Thinking"
          title="Section Completed"
          subtitle="You've completed the self-discovery questionnaire. Your responses have been saved."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 h-13 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <div className="text-[var(--color-primary)] font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Yourself</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-3 sm:py-4 flex-1 flex flex-col justify-between z-10">
        {/* HackerRank-style Question Palette Bar */}
        <QuestionPalette
          questionsStatus={questionsStatus}
          currentIndex={currentIndex}
          onSelectQuestion={handleSelectQuestion}
          title="Self-Discovery Questionnaire Navigation"
        />

        {/* Unanswered Questions Warning Banner */}
        {showUnansweredWarning && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Unanswered Questions Remaining ({unansweredIndices.length})</span>
            </div>
            <p className="leading-relaxed font-medium">
              You have not answered all questions yet. Click on any unanswered question number below to complete it, or submit anyway.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {unansweredIndices.map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuestion(idx)}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-extrabold text-xs hover:bg-amber-300 transition-colors"
                >
                  Jump to Q{idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors ml-auto"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        )}

        {/* Question Container */}
        <div className="flex-1 flex flex-col justify-center my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <QuestionCard
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
                followUpValue={followUpAnswers[currentQuestion.id]}
                onFollowUpChange={handleFollowUpChange}
              />
            </motion.div>
          </AnimatePresence>

          {error && <p className="text-xs font-semibold text-rose-500 text-center mt-2">{error}</p>}
        </div>

        {/* Reassuring text */}
        <div className="text-center my-2">
          <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
            Click any question number above to jump back and forth freely. Save genuine examples to highlight your strengths.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentIndex === 0 || isSubmitting 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {!isCurrentAnswered() && currentIndex < totalQuestions - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-medium bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
              >
                <span>Answer Later / Skip</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={currentIndex === totalQuestions - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-2xs cursor-pointer transition-colors"
            >
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : currentIndex === totalQuestions - 1
                  ? 'Finish Section'
                  : 'Next Question'}
              </span>
              {!isSubmitting && (currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
