'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/data/assessment';
import { AssessmentCard } from '@/components/student/AssessmentCard';
import { QuestionPalette } from '@/components/student/QuestionPalette';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { ArrowLeft, ArrowRight, Check, FastForward, AlertCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentAssessmentPage() {
  const router = useRouter();
  const [student, setStudent] = useState<{ id: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
    const draftKey = `draft_assessment_${student.id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers && typeof parsed.answers === 'object') {
          setAnswers(parsed.answers);
        }
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0 && parsed.currentIndex < assessmentQuestions.length) {
          setCurrentIndex(parsed.currentIndex);
        }
      } catch {
        // Ignore parse error
      }
    }
  }, [student?.id]);

  // Auto-save draft on answers or index change
  useEffect(() => {
    if (!student?.id) return;
    const draftKey = `draft_assessment_${student.id}`;
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify({ answers, currentIndex }));
    }
  }, [answers, currentIndex, student?.id]);

  if (!student) return null;

  const currentQuestion: AssessmentQuestion = assessmentQuestions[currentIndex];
  const totalQuestions = assessmentQuestions.length;
  const selectedAnswer = answers[currentQuestion.id] || null;

  // Compute status for all assessment questions
  const questionsStatus = assessmentQuestions.map((q) => ({
    id: q.id,
    isAnswered: Boolean(answers[q.id]),
  }));

  const unansweredIndices = questionsStatus
    .map((s, idx) => (!s.isAnswered ? idx : null))
    .filter((v): v is number => v !== null);

  const handleSelectAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setError('');
    setShowUnansweredWarning(false);
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
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      const res = await fetch(`/api/student/${student.id}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something didn\'t go as planned. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Clear draft on successful submission
      localStorage.removeItem(`draft_assessment_${student.id}`);
      const updatedStudent = { ...student, assessmentStatus: 'completed' };
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
      <div className="min-h-screen bg-[var(--color-background-main)] flex flex-col justify-center px-4 py-8">
        <CompletionScreen
          studentName={student.name}
          isAllCompleted={true}
          title="Thinking Challenge Complete!"
          subtitle="You've completed the reasoning and thinking section. Your responses have been saved for counselor synthesis."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20 transition-colors">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <div className="text-violet-600 dark:text-violet-400 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>Explore Your Thinking</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 py-6 flex-1 flex flex-col z-10">
        {/* HackerRank-style Question Palette Bar */}
        <QuestionPalette
          questionsStatus={questionsStatus}
          currentIndex={currentIndex}
          onSelectQuestion={handleSelectQuestion}
          title="Thinking Challenge Navigation"
        />

        {/* Unanswered Questions Warning Banner */}
        {showUnansweredWarning && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Unanswered Challenges Remaining ({unansweredIndices.length})</span>
            </div>
            <p className="leading-relaxed font-medium">
              You have unanswered challenge questions remaining. Click any unanswered number below to complete it, or submit anyway.
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
        <div className="flex-1 flex flex-col justify-center min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <AssessmentCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={totalQuestions}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>

          {error && <p className="text-xs font-semibold text-rose-500 text-center mt-4">{error}</p>}
        </div>

        {/* Reassuring text */}
        <div className="text-center mt-3 mb-6">
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            Click any challenge number above to switch back and forth freely.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentIndex === 0 || isSubmitting 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {!selectedAnswer && currentIndex < totalQuestions - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-all cursor-pointer"
              >
                <span>Answer Later / Skip</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={currentIndex === totalQuestions - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : currentIndex === totalQuestions - 1
                  ? 'Finish Section'
                  : 'Next Challenge'}
              </span>
              {!isSubmitting && (currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
