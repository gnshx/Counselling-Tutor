'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaireQuestions, QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { QuestionCard } from '@/components/student/QuestionCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
      // Submit questionnaire
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
        setError(data.error || 'Failed to submit questionnaire');
        setIsSubmitting(false);
        return;
      }

      // Update localStorage session status
      const updatedStudent = { ...student, questionnaireStatus: 'completed' };
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-4 py-8">
        <CompletionScreen
          studentName={student.name}
          onNextJourney={() => router.push('/student/assessment')}
          nextJourneyTitle="Brain Challenge"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

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

          <span className="text-xs font-extrabold text-violet-400 tracking-wider uppercase">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center space-y-6 z-10">
        {/* Progress Bar */}
        <ProgressBar
          current={currentIndex + 1}
          total={totalQuestions}
          showText={true}
          label={`Question ${currentIndex + 1} of ${totalQuestions}`}
          colorTheme="violet"
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswerChange}
          followUpValue={followUpAnswers[currentQuestion.id]}
          onFollowUpChange={handleFollowUpChange}
        />

        {error && <p className="text-xs font-bold text-rose-400 text-center">{error}</p>}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
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
            disabled={!canProceed()}
            rightIcon={currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {currentIndex === totalQuestions - 1 ? 'Complete Questionnaire' : 'Next Question'}
          </Button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-600">
        Student Career Discovery Questionnaire
      </footer>
    </div>
  );
}
