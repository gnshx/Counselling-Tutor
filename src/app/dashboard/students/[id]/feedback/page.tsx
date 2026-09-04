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

  // Load saved draft on mount when student ID is ready
  useEffect(() => {
    if (!id) return;
    const draftKey = `draft_teacher_feedback_${id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.ratings && typeof parsed.ratings === 'object') setRatings(parsed.ratings);
        if (Array.isArray(parsed.strongestAreas)) setStrongestAreas(parsed.strongestAreas);
        if (Array.isArray(parsed.interestedAreas)) setInterestedAreas(parsed.interestedAreas);
        if (typeof parsed.workingStyle === 'string') setWorkingStyle(parsed.workingStyle);
        if (typeof parsed.comment === 'string') setComment(parsed.comment);
      } catch {
        // Ignore parse error
      }
    }
  }, [id]);

  // Auto-save draft on any input change
  useEffect(() => {
    if (!id) return;
    const draftKey = `draft_teacher_feedback_${id}`;
    if (
      Object.keys(ratings).length > 0 ||
      strongestAreas.length > 0 ||
      interestedAreas.length > 0 ||
      workingStyle !== null ||
      comment.trim() !== ''
    ) {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ ratings, strongestAreas, interestedAreas, workingStyle, comment })
      );
    }
  }, [id, ratings, strongestAreas, interestedAreas, workingStyle, comment]);

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

      // Clear saved draft on successful submission
      localStorage.removeItem(`draft_teacher_feedback_${id}`);
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

  const renderSingleQuestionBox = (qData: ReturnType<typeof getStudentQAnswer>) => {
    if (!qData) return null;

    return (
      <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-2 shadow-2xs">
        <div className="text-xs font-semibold text-[var(--color-text-primary)] leading-snug flex items-start gap-1.5">
          <span className="font-mono text-xs uppercase text-[var(--color-primary)] font-bold shrink-0">[{qData.qId.toUpperCase()}]</span>
          <span>{qData.questionText}</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {qData.pills.map((pill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300/80 dark:border-slate-700">
              {pill}
            </span>
          ))}
        </div>

        {qData.detail && (
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/70 text-xs space-y-0.5 mt-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              Student Proof / Real Example:
            </span>
            <p className="font-medium italic leading-relaxed">&ldquo;{qData.detail}&rdquo;</p>
          </div>
        )}
      </div>
    );
  };

  const renderObservationGuidanceBox = (title: string, criteriaList: string[]) => {
    return (
      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2 shadow-2xs">
        <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-200/60 dark:border-indigo-800/40 pb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Observation Focus Criteria</span>
        </div>
        <p className="text-xs font-bold text-indigo-950 dark:text-indigo-100">{title}</p>
        <ul className="text-xs text-indigo-900/90 dark:text-indigo-200/90 space-y-1 list-disc list-inside leading-relaxed font-medium">
          {criteriaList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMatchedStudentAnswers = (tfId: string) => {
    switch (tfId) {
      case 'tf1':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q1'))}
            {renderSingleQuestionBox(getStudentQAnswer('q2'))}
            {renderSingleQuestionBox(getStudentQAnswer('q6'))}
            {renderSingleQuestionBox(getStudentQAnswer('q7'))}
          </div>
        );
      case 'tf2':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q3'))}
          </div>
        );
      case 'tf3':
        return (
          <div className="space-y-2.5">
            {assessmentData ? (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/70 space-y-1">
                <div className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Aptitude Challenge Score:</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {assessmentData.score} / {assessmentData.totalQuestions} ({assessmentData.percent}%)
                </div>
              </div>
            ) : null}
            {renderSingleQuestionBox(getStudentQAnswer('q5'))}
          </div>
        );
      case 'tf4':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q4'))}
            {renderSingleQuestionBox(getStudentQAnswer('q5'))}
          </div>
        );
      case 'tf5':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q4'))}
            {renderSingleQuestionBox(getStudentQAnswer('q3'))}
          </div>
        );
      case 'tf6':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q3'))}
            {renderSingleQuestionBox(getStudentQAnswer('q2'))}
          </div>
        );
      case 'tf7':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q5'))}
            {renderSingleQuestionBox(getStudentQAnswer('q9'))}
          </div>
        );
      case 'tf_sincerity':
        return renderObservationGuidanceBox('Sincerity & Dedication Criteria:', [
          'Genuine effort and earnestness in class assignments and projects.',
          'Honesty, authenticity, and taking personal ownership of learning.',
          'Sustained focus without requiring continuous teacher intervention.',
        ]);
      case 'tf_attendance':
        return renderObservationGuidanceBox('Attendance & Punctuality Criteria:', [
          'Regularity in class attendance with minimal unexcused absences.',
          'Arriving on time for classes, laboratory sessions, and group activities.',
          'Timely submission of homework, projects, and lab reports.',
        ]);
      case 'tf_discipline':
        return renderObservationGuidanceBox('Classroom Conduct & Discipline Criteria:', [
          'Adherence to school policies, classroom decorum, and instructions.',
          'Maintaining self-control during independent work and group activities.',
          'Respectful, non-disruptive behavior towards teachers and classmates.',
        ]);
      case 'tf_respect':
        return renderObservationGuidanceBox('Interpersonal Respect Criteria:', [
          'Polite tone, active listening, and courteous speech with teachers and staff.',
          'Openness to constructive feedback, advice, and guidance.',
          'Empathy, inclusion, and kindness towards peers of all backgrounds.',
        ]);
      case 'tf_cleanliness':
        return renderObservationGuidanceBox('Workplace Neatness & Hygiene Criteria:', [
          'Keeping study desk, laboratory bench, and workspace organized.',
          'Careful handling and neat presentation of books, notebooks, and equipment.',
          'Personal hygiene, tidy uniform/attire, and pride in neat work.',
        ]);
      case 'tf8':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q3'))}
          </div>
        );
      case 'tf9':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q1'))}
            {renderSingleQuestionBox(getStudentQAnswer('q6'))}
            {renderSingleQuestionBox(getStudentQAnswer('q7'))}
          </div>
        );
      case 'tf10':
        return (
          <div className="space-y-2.5">
            {renderSingleQuestionBox(getStudentQAnswer('q4'))}
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
                Your educator observations and recommendations for <strong>{student?.name}</strong> have been securely recorded.
              </p>
            </div>

            <div className="flex gap-4 justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/students/${id}`)}
                className="px-6 py-2.5 text-xs font-semibold"
              >
                View Student Profile
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 text-xs font-semibold"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                    Educator Feedback: {student?.name}
                  </h1>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                    Review {student?.name}&apos;s self-reported questionnaire answers alongside your observed assessment to guide their career journey.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-primary)] shrink-0 self-start sm:self-center">
                  Class {student?.classGrade}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Behavioral & Competency Assessment (1-5 Rating)
                </h2>

                {teacherFeedbackQuestions
                  .filter((q) => q.type === 'rating')
                  .map((q, idx) => {
                    const studentContent = renderMatchedStudentAnswers(q.id);
                    const isGuidanceOnly = ['tf_sincerity', 'tf_attendance', 'tf_discipline', 'tf_respect', 'tf_cleanliness'].includes(q.id);

                    return (
                      <div
                        key={q.id}
                        className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4 transition-colors"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                            <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                              <span>{isGuidanceOnly ? 'Educator Guidance Criteria' : "Student's Stated Answer"}</span>
                              <span className={`w-2 h-2 rounded-full ${isGuidanceOnly ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                            </div>
                            {studentContent}
                          </div>

                          <div className="lg:col-span-7 space-y-4">
                            <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                              {idx + 1}. {q.question} <span className="text-rose-500">*</span>
                            </label>
                            <RatingScale
                              value={ratings[q.id]}
                              onChange={(val) => handleRatingChange(q.id, val)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>Student&apos;s Stated Answer</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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

              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>Student&apos;s Stated Answer</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
                      {ratingQuestionsCount + 3}. What is the student&apos;s preferred working style based on your observations? <span className="text-rose-500">*</span>
                    </label>
                    <RadioGroup
                      options={teacherFeedbackQuestions.find((q) => q.id === 'tf10')?.options || []}
                      selectedValue={workingStyle}
                      onChange={setWorkingStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                    Educator Observations & Detailed Assessment (400–500 Words)
                  </label>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                    (comment.trim() ? comment.trim().split(/\s+/).length : 0) > 500
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800'
                  }`}>
                    {comment.trim() ? comment.trim().split(/\s+/).length : 0} / 500 words
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Is there anything important about this student&apos;s strengths, proof of work, group collaboration, or future career interests that the questions did not capture?
                </p>
                <textarea
                  rows={7}
                  maxLength={3500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share detailed feedback, observations, project proof notes, and personalized career recommendations for the student (up to 400-500 words)..."
                  className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
                />
                <div className="flex justify-between items-center text-xs text-[var(--color-text-secondary)] font-medium">
                  <span>Word count: {comment.trim() ? comment.trim().split(/\s+/).length : 0} / 500 words</span>
                  <span>{comment.length} / 3500 characters</span>
                </div>
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
