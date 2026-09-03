'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaireQuestions, QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { QuestionCard } from '@/components/student/QuestionCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
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

  if (!student) return null;

  const currentQuestion: QuestionnaireQuestion = questionnaireQuestions[currentIndex];
  const totalQuestions = questionnaireQuestions.length;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  const handleAnswerChange = (val: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleFollowUpChange = (val: string) => {
    setFollowUpAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const canProceed = () => {
    const val = answers[currentQuestion.id];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (currentQuestion.type === 'conditional' && currentQuestion.followUp && val === currentQuestion.followUp.triggerValue) {
      return Boolean(followUpAnswers[currentQuestion.id]?.trim());
    }
    return true;
  };

  const handleNext = async () => {
    if (!canProceed()) {
      setError('Please select or answer before continuing.');
      return;
    }

    setError('');
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedResponses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer:
          answers[questionId] === 'yes_know_one' && followUpAnswers[questionId]
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
      <div className="min-h-screen bg-[var(--color-background-main)] flex flex-col justify-center px-4 py-8">
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
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <div className="text-[var(--color-primary)] font-semibold text-xs tracking-wider uppercase">
            Discover Yourself
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 py-8 flex-1 flex flex-col z-10">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-[var(--color-primary)]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-surface-soft)] rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
            <div 
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div className="flex-1 flex flex-col justify-center min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
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

          {error && <p className="text-xs font-semibold text-rose-500 text-center mt-4">{error}</p>}
        </div>

        {/* Reassuring text */}
        <div className="text-center mt-4 mb-8">
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            Select the options that best reflect your true preferences and experiences.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
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

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              !canProceed() || isSubmitting
                ? 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border-subtle)]'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-2xs cursor-pointer'
            }`}
          >
            <span>{isSubmitting ? 'Saving...' : currentIndex === totalQuestions - 1 ? 'Finish Section' : 'Next Question'}</span>
            {!isSubmitting && (currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
          </button>
        </div>
      </main>
    </div>
  );
}
