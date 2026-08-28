'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/data/assessment';
import { AssessmentCard } from '@/components/student/AssessmentCard';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
      // Submit assessment
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

      // Update localStorage session status
      const updatedStudent = { ...student, assessmentStatus: 'completed' };
      localStorage.setItem('student_session', JSON.stringify(updatedStudent));

      setIsCompleted(true);
    } catch {
      setError('Connection error. Please try again.');
    } flex: {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-4 py-8">
        <CompletionScreen
          studentName={student.name}
          isAllCompleted={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          <span className="text-xs font-extrabold text-purple-400 tracking-wider uppercase">
            Challenge {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center space-y-6 z-10">
        {/* Assessment Card */}
        <AssessmentCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          isSubmitting={isSubmitting}
        />

        {error && <p className="text-xs font-bold text-rose-400 text-center">{error}</p>}

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

      <footer className="py-4 text-center text-xs text-slate-600">
        Brain & Life Challenge Assessment
      </footer>
    </div>
  );
}
