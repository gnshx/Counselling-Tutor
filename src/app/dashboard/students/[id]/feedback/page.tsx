'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { RatingScale } from '@/components/ui/RatingScale';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  MessageSquarePlus,
  CheckCircle2,
  BookOpen,
  Star,
  Zap,
  Target,
  Sun,
  Brain,
  Compass,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';
import { questionnaireQuestions } from '@/lib/data/questionnaire';
import {
  formatAssessmentResponse,
  getQuestionnaireAnswerLabel,
  FormattedAssessmentData,
} from '@/lib/utils/profile-formatter';

interface StudentDetail {
  id: string;
  name: string;
  classGrade: string;
  school?: string | null;
  accessCode: string;
  feedbackStatus: string;
  questionnaireResponse?: { responses: { questionId: string; answer: any }[] } | null;
  assessmentResponse?: { score: number; totalQuestions: number; responses: any[] } | null;
}

export default function TeacherFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [ratings, setRatings] = useState<Record<string, number | 'N/O'>>({});
  const [strongestAreas, setStrongestAreas] = useState<string[]>([]);
  const [interestedAreas, setInterestedAreas] = useState<string[]>([]);
  const [workingStyle, setWorkingStyle] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
          if (data.student.feedbackStatus === 'completed') {
            setIsSuccess(true);
          }
        }
      } catch {
        console.error('Error fetching student');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  const handleRatingChange = (qId: string, val: number | 'N/O') => {
    setRatings((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required rating questions
    const requiredRatingIds = teacherFeedbackQuestions
      .filter((q) => q.type === 'rating' && q.required)
      .map((q) => q.id);

    for (const qId of requiredRatingIds) {
      if (ratings[qId] === undefined) {
        setError('Please complete all rating questions before submitting.');
        return;
      }
    }

    if (strongestAreas.length === 0) {
      setError("Please select at least 1 area for student's strongest areas.");
      return;
    }

    if (interestedAreas.length === 0) {
      setError("Please select at least 1 area for student's interest areas.");
      return;
    }

    if (!workingStyle) {
      setError('Please select preferred working style.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const formattedRatings = Object.entries(ratings).map(([questionId, rating]) => ({
        questionId,
        rating,
      }));

      const res = await fetch(`/api/students/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings: formattedRatings,
          strongestAreas,
          interestedAreas,
          workingStyle,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit feedback');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)]">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-[var(--color-text-secondary)]">
          <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">Loading feedback workspace...</p>
        </div>
      </div>
    );
  }

  const assessmentData: FormattedAssessmentData | null = student?.assessmentResponse
    ? formatAssessmentResponse(student.assessmentResponse)
    : null;

  // Helper to extract student's specific questionnaire question & answer
  const getStudentQAnswer = (qId: string) => {
    const responses = student?.questionnaireResponse?.responses || [];
    const item = responses.find((r) => r.questionId === qId);
    const questionDef = questionnaireQuestions.find((q) => q.id === qId);

    if (!questionDef) return null;
    if (!item) {
      return {
        qId,
        questionText: questionDef.question,
        pills: ['Not answered'],
        detail: undefined,
      };
    }

    const labelObj = getQuestionnaireAnswerLabel(qId, item.answer);
    let pills: string[] = [];

    if (Array.isArray(item.answer)) {
      pills = item.answer.map((v) => {
        if ('options' in questionDef) {
          const opt = questionDef.options.find((o) => o.value === v);
          return opt ? opt.label : String(v);
        }
        return String(v);
      });
    } else if (labelObj.label) {
      pills = [labelObj.label];
    }

    return {
      qId,
      questionText: questionDef.question,
      pills: pills.length > 0 ? pills : ['Not answered'],
      detail: labelObj.detail,
    };
  };

  // Helper to render matched student question & answer blocks
  const renderSingleQuestionBox = (qData: ReturnType<typeof getStudentQAnswer>, badgeColor = 'primary') => {
    if (!qData) return null;

    const colorStyles: Record<string, string> = {
      primary: 'text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-700/70',
      amber: 'text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700/70',
      cyan: 'text-sky-900 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/60 border-sky-300 dark:border-sky-700/70',
      emerald: 'text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700/70',
      purple: 'text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 border-purple-300 dark:border-purple-700/70',
      rose: 'text-rose-900 dark:text-rose-200 bg-rose-100 dark:bg-rose-900/60 border-rose-300 dark:border-rose-700/70',
      indigo: 'text-indigo-900 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/60 border-indigo-300 dark:border-indigo-700/70',
    };

    const style = colorStyles[badgeColor] || colorStyles.primary;

    return (
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed flex items-start gap-1.5">
          <span className="font-mono text-xs uppercase text-blue-600 dark:text-blue-400 font-bold shrink-0">[{qData.qId.toUpperCase()}]</span>
          <span>{qData.questionText}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {qData.pills.map((pill, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-lg font-semibold text-xs border ${style}`}>
              {pill}
            </span>
          ))}
          {qData.detail && (
            <span className="px-2.5 py-1 rounded-lg font-semibold text-xs bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600">
              Detail: {qData.detail}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Render matched student answers per teacher feedback question
  const renderMatchedStudentAnswers = (tfId: string) => {
    switch (tfId) {
      case 'tf1': // Interests match
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q1'), 'primary')}
            {renderSingleQuestionBox(getStudentQAnswer('q2'), 'indigo')}
          </div>
        );

      case 'tf2': // Strengths match
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
          </div>
        );

      case 'tf3': // Problem solving
        return (
          <div className="space-y-3">
            {assessmentData ? (
              <div className="p-3 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800/80 space-y-1">
                <div className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Aptitude Challenge Score:</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {assessmentData.score} / {assessmentData.totalQuestions} ({assessmentData.percent}%)
                </div>
              </div>
            ) : null}
            {renderSingleQuestionBox(getStudentQAnswer('q5'), 'cyan')}
          </div>
        );

      case 'tf4': // Independent learning
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q4'), 'purple')}
            {renderSingleQuestionBox(getStudentQAnswer('q5'), 'cyan')}
          </div>
        );

      case 'tf5': // Teamwork
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q4'), 'emerald')}
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
          </div>
        );

      case 'tf6': // Communication
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
            {renderSingleQuestionBox(getStudentQAnswer('q2'), 'indigo')}
          </div>
        );

      case 'tf7': // Persistence
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q5'), 'cyan')}
            {renderSingleQuestionBox(getStudentQAnswer('q9'), 'rose')}
          </div>
        );

      case 'tf_sincerity': // Sincerity & Dedication
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q5'), 'cyan')}
            {renderSingleQuestionBox(getStudentQAnswer('q9'), 'rose')}
          </div>
        );

      case 'tf_attendance': // Attendance & Punctuality
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q9'), 'emerald')}
          </div>
        );

      case 'tf_discipline': // Obedience & Discipline
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q4'), 'purple')}
            {renderSingleQuestionBox(getStudentQAnswer('q5'), 'cyan')}
          </div>
        );

      case 'tf_respect': // Respect
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
            {renderSingleQuestionBox(getStudentQAnswer('q4'), 'emerald')}
          </div>
        );

      case 'tf_cleanliness': // Cleanliness
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
          </div>
        );

      case 'tf8': // Strongest areas (observed vs claimed)
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q3'), 'amber')}
          </div>
        );

      case 'tf9': // Interested areas (observed vs claimed)
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q1'), 'primary')}
            {renderSingleQuestionBox(getStudentQAnswer('q6'), 'indigo')}
            {renderSingleQuestionBox(getStudentQAnswer('q7'), 'purple')}
          </div>
        );

      case 'tf10': // Preferred working style
        return (
          <div className="space-y-3">
            {renderSingleQuestionBox(getStudentQAnswer('q4'), 'emerald')}
          </div>
        );

      default:
        return null;
    }
  };

  const ratingQuestionsCount = teacherFeedbackQuestions.filter((q) => q.type === 'rating').length;

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <Link
          href={`/dashboard/students/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Profile</span>
        </Link>

        {isSuccess ? (
          <div className="max-w-2xl mx-auto bg-[var(--color-surface)] rounded-2xl p-8 sm:p-10 border border-emerald-200 dark:border-emerald-800/80 shadow-md text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/80">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Feedback Saved Successfully</h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
                Educator observation feedback for <strong>{student?.name}</strong> has been saved.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" className="text-sm px-5 py-2.5" onClick={() => router.push(`/dashboard/students/${id}`)}>
                View Student Profile
              </Button>
              <Button variant="primary" className="text-sm px-5 py-2.5" onClick={() => router.push('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-10 border border-[var(--color-border-subtle)] shadow-sm space-y-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/80">
                  <MessageSquarePlus className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">Educator Feedback Assessment</h1>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    Evaluating <strong>{student?.name}</strong> (Class {student?.classGrade}) • Access Code: <strong className="text-blue-600 dark:text-blue-400 font-mono">{student?.accessCode}</strong>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
                <span className="text-blue-900 dark:text-blue-200 font-bold uppercase tracking-wider">Side-by-Side Assessment (Student Self-Report vs Educator Observation)</span>
                <span className="text-blue-700 dark:text-blue-300 font-medium">1 = Very Low, 5 = Excellent, N/O = Not Observed</span>
              </div>

              {/* Rating Questions (Side-by-Side) */}
              {teacherFeedbackQuestions
                .filter((q) => q.type === 'rating')
                .map((q, idx) => (
                  <div key={q.id} className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Column: Matched Student Question & Answer (5 cols) */}
                      <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                        <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                          <span>Student&apos;s Stated Answer</span>
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        </div>
                        {renderMatchedStudentAnswers(q.id)}
                      </div>

                      {/* Right Column: Teacher Rating (7 cols) */}
                      <div className="lg:col-span-7 space-y-3">
                        <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                          {idx + 1}. {q.question} <span className="text-rose-500">*</span>
                        </label>
                        <RatingScale
                          value={ratings[q.id] ?? null}
                          onChange={(val) => handleRatingChange(q.id, val)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {/* Question: Strongest Areas (Side-by-Side) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>Student&apos;s Stated Answer</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf8')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 1}. Which areas appear to be the student&apos;s strongest based on your observations? <span className="text-rose-500">*</span>
                    </label>
                    <MultiSelect
                      options={teacherFeedbackQuestions.find((q) => q.id === 'tf8')?.options || []}
                      selectedValues={strongestAreas}
                      onChange={setStrongestAreas}
                      maxSelections={3}
                      colorTheme="indigo"
                    />
                  </div>
                </div>
              </div>

              {/* Question: Interested Areas (Side-by-Side) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>Student&apos;s Stated Answer</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf9')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 2}. Which areas does the student appear most interested in? <span className="text-rose-500">*</span>
                    </label>
                    <MultiSelect
                      options={teacherFeedbackQuestions.find((q) => q.id === 'tf9')?.options || []}
                      selectedValues={interestedAreas}
                      onChange={setInterestedAreas}
                      maxSelections={3}
                      colorTheme="indigo"
                    />
                  </div>
                </div>
              </div>

              {/* Question: Preferred Working Style (Side-by-Side) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>Student&apos;s Stated Answer</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf10')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 3}. What is the student&apos;s preferred working style based on your observation? <span className="text-rose-500">*</span>
                    </label>
                    <RadioGroup
                      options={teacherFeedbackQuestions.find((q) => q.id === 'tf10')?.options || []}
                      selectedValue={workingStyle}
                      onChange={setWorkingStyle}
                      colorTheme="indigo"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Comment */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
                <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
                  Optional Educator Comment (Max 200 characters)
                </label>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Is there anything important about this student&apos;s strengths or interests that the questions did not capture?
                </p>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type any additional observations..."
                  className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
                />
                <div className="text-right text-xs text-[var(--color-text-secondary)] font-medium">{comment.length} / 200</div>
              </div>

              {error && <p className="text-sm font-semibold text-rose-500 text-center">{error}</p>}

              <div className="flex gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 py-3 text-sm font-semibold"
                  onClick={() => router.push(`/dashboard/students/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-1/2 py-3 text-sm font-semibold shadow-sm hover:shadow-md"
                  isLoading={isSubmitting}
                >
                  Save & Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
