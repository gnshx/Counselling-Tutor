'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/data/assessment';
import { AssessmentCard } from '@/components/student/AssessmentCard';
import { QuestionPalette } from '@/components/student/QuestionPalette';
import { CompletionScreen } from '@/components/student/CompletionScreen';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ArrowLeft, ArrowRight, Check, FastForward, AlertCircle, Brain, Eye, CheckCircle2, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function StudentAssessmentPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [student, setStudent] = useState<{ id: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        if (Array.isArray(parsed.visited)) {
          setVisitedQuestions(new Set(parsed.visited));
        }
      } catch {
        // Ignore parse error
      }
    }
  }, [student?.id]);

  // Track visited questions whenever currentIndex changes
  useEffect(() => {
    setVisitedQuestions((prev) => new Set(prev).add(currentIndex));
  }, [currentIndex]);

  // Auto-save draft on answers, visited or index change
  useEffect(() => {
    if (!student?.id) return;
    const draftKey = `draft_assessment_${student.id}`;
    if (Object.keys(answers).length > 0 || visitedQuestions.size > 1) {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          answers,
          currentIndex,
          visited: Array.from(visitedQuestions),
        })
      );
    }
  }, [answers, currentIndex, visitedQuestions, student?.id]);

  if (!student) return null;

  const currentQuestion: AssessmentQuestion = assessmentQuestions[currentIndex];
  const totalQuestions = assessmentQuestions.length;
  const selectedAnswer = answers[currentQuestion.id] || null;

  // Compute status for all assessment questions
  const questionsStatus = assessmentQuestions.map((q) => ({
    id: q.id,
    isAnswered: Boolean(answers[q.id]),
  }));

  const answeredCount = Object.keys(answers).length;
  const leftCount = totalQuestions - answeredCount;
  const visitedCount = visitedQuestions.size;

  const unansweredIndices = questionsStatus
    .map((s, idx) => (!s.isAnswered ? idx : null))
    .filter((v): v is number => v !== null);

  const handleSelectAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setError('');
  };

  const handleSelectQuestion = (idx: number) => {
    setError('');
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    setError('');
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleOpenSubmitModal = () => {
    setError('');
    setShowConfirmModal(true);
  };

  const performFinalSubmission = async () => {
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
        setShowConfirmModal(false);
        return;
      }

      // Clear draft on successful submission
      localStorage.removeItem(`draft_assessment_${student.id}`);
      const updatedStudent = { ...student, assessmentStatus: 'completed' };
      localStorage.setItem('student_session', JSON.stringify(updatedStudent));

      setShowConfirmModal(false);
      setIsCompleted(true);
    } catch {
      setError('Something didn\'t go as planned. Please try again.');
      setShowConfirmModal(false);
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
          title={language === 'hi' ? 'अभिरुचि चुनौती पूरी हुई!' : 'Thinking Challenge Complete!'}
          subtitle={
            language === 'hi'
              ? 'आपने तर्क और विचार अनुभाग पूरा कर लिया है। आपके उत्तर परामर्शदाता के विश्लेषण के लिए सहेज लिए गए हैं।'
              : "You've completed the reasoning and thinking section. Your responses have been saved for counselor synthesis."
          }
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
            <span>{language === 'hi' ? 'पोर्टल पर वापस' : 'Back to Portal'}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-violet-600 dark:text-violet-400 font-bold text-xs tracking-wider uppercase hidden sm:flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              <span>{language === 'hi' ? 'अपनी सोच और क्षमताओं को जानें' : 'Explore Your Thinking'}</span>
            </div>
            <LanguageToggle />
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
          title={language === 'hi' ? 'अभिरुचि चुनौती नेविगेशन' : 'Thinking Challenge Navigation'}
        />

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
            {language === 'hi'
              ? 'आगे-पीछे जाने के लिए ऊपर दिए गए किसी भी प्रश्न संख्या पर क्लिक करें।'
              : 'Click any challenge number above to switch back and forth freely.'}
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
            <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
          </button>

          <div className="flex items-center gap-2">
            {!selectedAnswer && currentIndex < totalQuestions - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-all cursor-pointer"
              >
                <span>Answer Later / Skip</span>
                <span>{language === 'hi' ? 'बाद में उत्तर दें / आगे बढ़ें' : 'Answer Later / Skip'}</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={currentIndex === totalQuestions - 1 ? handleOpenSubmitModal : handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>
                {currentIndex === totalQuestions - 1 ? 'Finish & Submit' : 'Next Challenge'}
                {currentIndex === totalQuestions - 1
                  ? language === 'hi'
                    ? 'पूरा करें और जमा करें'
                    : 'Finish & Submit'
                  : language === 'hi'
                  ? 'अगली चुनौती'
                  : 'Next Challenge'}
              </span>
              {currentIndex === totalQuestions - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-lg w-full border border-[var(--color-border-subtle)] shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">Ready to Submit Your Exam?</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Please review your question completion summary</p>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {language === 'hi' ? 'क्या आप आकलन जमा करने के लिए तैयार हैं?' : 'Ready to Submit Your Exam?'}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {language === 'hi'
                      ? 'कृपया अपने प्रश्नों की पूर्णता समीक्षा देखें'
                      : 'Please review your question completion summary'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visited</span>
                  <span>{language === 'hi' ? 'देखे गए' : 'Visited'}</span>
                </div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {visitedCount} <span className="text-xs text-blue-600/80 font-normal">/ {totalQuestions}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Answered</span>
                  <span>{language === 'hi' ? 'उत्तर दिए गए' : 'Answered'}</span>
                </div>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                  {answeredCount} <span className="text-xs text-emerald-600/80 font-normal">/ {totalQuestions}</span>
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border text-center space-y-1 ${
                leftCount > 0 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-100'
                  : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <div className={`flex items-center justify-center gap-1 text-xs font-bold ${leftCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Left</span>
                  <span>{language === 'hi' ? 'शेष' : 'Left'}</span>
                </div>
                <p className="text-xl font-bold">
                  {leftCount} <span className="text-xs opacity-75 font-normal">/ {totalQuestions}</span>
                </p>
              </div>
            </div>

            {/* Left Unanswered Warning & Jump Links */}
            {leftCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>You have {leftCount} unanswered challenge question{leftCount === 1 ? '' : 's'}:</span>
                  <span>
                    {language === 'hi'
                      ? `आपके पास ${leftCount} अनुत्तरित चुनौती प्रश्न ${leftCount === 1 ? 'है' : 'हैं'}:`
                      : `You have ${leftCount} unanswered challenge question${leftCount === 1 ? '' : 's'}:`}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unansweredIndices.map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setShowConfirmModal(false);
                        handleSelectQuestion(idx);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Jump to Q{idx + 1}
                      {language === 'hi' ? `प्रश्न ${idx + 1} पर जाएँ` : `Jump to Q${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Great job! You have answered all {totalQuestions} questions.</span>
                <span>
                  {language === 'hi'
                    ? `बहुत खूब! आपने सभी ${totalQuestions} प्रश्नों के उत्तर दे दिए हैं।`
                    : `Great job! You have answered all ${totalQuestions} questions.`}
                </span>
              </div>
            )}

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed text-center">
              Are you sure you want to submit your responses? Once submitted, your answers will be recorded for counselor review.
              {language === 'hi'
                ? 'क्या आप सुनिश्चित हैं कि आप अपने उत्तर जमा करना चाहते हैं? एक बार जमा करने के बाद, आपके उत्तर परामर्शदाता के विश्लेषण के लिए दर्ज हो जाएँगे।'
                : 'Are you sure you want to submit your responses? Once submitted, your answers will be recorded for counselor review.'}
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl"
                disabled={isSubmitting}
              >
                Go Back & Review
                {language === 'hi' ? 'वापस जाएँ और समीक्षा करें' : 'Go Back & Review'}
              </Button>
              <button
                type="button"
                onClick={performFinalSubmission}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Confirm & Submit'}
                {isSubmitting
                  ? language === 'hi'
                    ? 'जमा किया जा रहा है...'
                    : 'Submitting...'
                  : language === 'hi'
                  ? 'हाँ, पुष्टि करें और जमा करें'
                  : 'Yes, Confirm & Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
