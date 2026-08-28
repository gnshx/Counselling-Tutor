'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/data/assessment';
import { AssessmentCard } from '@/components/student/AssessmentCard';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

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
        setError(data.error || 'Failed to submit assessment');
        setIsSubmitting(false);
        return;
      }

      const updatedStudent = { ...student, assessmentStatus: 'completed' };
      localStorage.setItem('student_session', JSON.stringify(updatedStudent));

      setIsCompleted(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center px-4 py-8">
        <CompletionScreen
          studentName={student.name}
          isAllCompleted={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-purple-700 dark:text-purple-400 tracking-wider uppercase">
              Challenge {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 sm:py-10 flex-1 flex flex-col justify-center space-y-8 z-10">
        {/* Assessment Card */}
        <AssessmentCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          isSubmitting={isSubmitting}
        />

        {error && <p className="text-xs font-extrabold text-rose-500 text-center">{error}</p>}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="gradient"
            onClick={handleNext}
            isLoading={isSubmitting}
            disabled={!selectedAnswer}
            rightIcon={currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish Brain Challenge' : 'Next Challenge'}
          </Button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs font-medium text-slate-500">
        Brain & Life Challenge • Empowering Student Growth ✨
      </footer>
    </div>
  );
}
