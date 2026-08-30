'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/data/assessment';
import { AssessmentCard } from '@/components/student/AssessmentCard';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentAssessmentPage() {
  const router = useRouter();
  const [student, setStudent] = useState<{ id: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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

  const currentQuestion: AssessmentQuestion = assessmentQuestions[currentIndex];
  const totalQuestions = assessmentQuestions.length;
  const selectedAnswer = answers[currentQuestion.id] || null;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  const handleSelectAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError('Please choose an answer to proceed.');
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
          title="✨ Nice work!"
          subtitle="You've completed the thinking assessment. You took the time to challenge yourself — that's something to be proud of."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] flex flex-col font-sans selection:bg-[var(--color-cyan-soft)] selection:text-[var(--color-cyan)]">
      
      {/* Header */}
      <header className="bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] sticky top-0 z-20 transition-colors">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-[var(--color-cyan)] font-bold text-sm tracking-wider uppercase">
            Explore Your Thinking
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 py-8 flex-1 flex flex-col z-10">
        
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
            <span>Challenge {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-[var(--color-cyan)]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-surface-soft)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-cyan)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div className="flex-1 flex flex-col justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
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

          {error && <p className="text-sm font-semibold text-red-500 text-center mt-6">{error}</p>}
        </div>

        {/* Reassuring text */}
        <div className="text-center mt-6 mb-10">
          <p className="text-sm text-[var(--color-text-muted)] font-medium">
            Take your time. This is about discovering your style, not just finding the right answer.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all ${
              currentIndex === 0 || isSubmitting 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedAnswer || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all ${
              !selectedAnswer || isSubmitting
                ? 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border-subtle)]'
                : 'bg-[var(--color-cyan)] hover:bg-[#0891b2] text-white shadow-sm cursor-pointer'
            }`}
          >
            <span>{isSubmitting ? 'Saving...' : currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
            {!isSubmitting && (currentIndex === totalQuestions - 1 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
          </button>
        </div>
      </main>
    </div>
  );
}
