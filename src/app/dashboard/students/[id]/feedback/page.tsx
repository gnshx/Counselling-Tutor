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
  CheckCircle2,
  Brain,
  Sparkles,
} from 'lucide-react';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';
import { questionnaireQuestions } from '@/lib/data/questionnaire';
import {
  formatAssessmentResponse,
  getQuestionnaireAnswerLabel,
  FormattedAssessmentData,
} from '@/lib/utils/profile-formatter';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

interface StudentDetail {
  id: string;
  name: string;
  classGrade: string;
  school?: string | null;
  accessCode: string;
  feedbackStatus: string;
  questionnaireResponse?: { responses: { questionId: string; answer: unknown }[] } | null;
  assessmentResponse?: { score: number; totalQuestions: number; responses: { questionId: string; selectedAnswer: string; isCorrect: boolean }[] } | null;
}

export default function TeacherFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { language } = useLanguage();

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
        setError(
          language === 'hi'
            ? 'कृपया जमा करने से पहले सभी रेटिंग प्रश्नों को पूरा करें।'
            : 'Please complete all rating questions before submitting.'
        );
        return;
      }
    }

    if (strongestAreas.length === 0) {
      setError(
        language === 'hi'
          ? 'कृपया विद्यार्थी के सबसे मजबूत क्षेत्रों में से कम से कम 1 क्षेत्र चुनें।'
          : "Please select at least 1 area for student's strongest areas."
      );
      return;
    }

    if (interestedAreas.length === 0) {
      setError(
        language === 'hi'
          ? 'कृपया विद्यार्थी के रुचि क्षेत्रों में से कम से कम 1 क्षेत्र चुनें।'
          : "Please select at least 1 area for student's interest areas."
      );
      return;
    }

    if (!workingStyle) {
      setError(
        language === 'hi'
          ? 'कृपया पसंदीदा कार्य शैली का चयन करें।'
          : 'Please select preferred working style.'
      );
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
        setError(data.error || (language === 'hi' ? 'प्रतिक्रिया जमा करने में त्रुटि' : 'Failed to submit feedback'));
        setIsSubmitting(false);
        return;
      }

      // Clear saved draft on successful submission
      localStorage.removeItem(`draft_teacher_feedback_${id}`);
      setIsSuccess(true);
    } catch {
      setError(language === 'hi' ? 'कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।' : 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)] font-sans">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-[var(--color-text-secondary)]">
          <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">
            {language === 'hi' ? 'फीडबैक कार्यक्षेत्र लोड हो रहा है...' : 'Loading feedback workspace...'}
          </p>
        </div>
      </div>
    );
  }

  const assessmentData: FormattedAssessmentData | null = student?.assessmentResponse
    ? formatAssessmentResponse(student.assessmentResponse, language)
    : null;

  // Helper to extract student's specific questionnaire question & answer
  const getStudentQAnswer = (qId: string) => {
    const responses = student?.questionnaireResponse?.responses || [];
    const item = responses.find((r) => r.questionId === qId);
    const questionDef = questionnaireQuestions.find((q) => q.id === qId);

    if (!questionDef) return null;
    const notAnsweredLabel = language === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered';
    const qText = language === 'hi' && questionDef.questionHi ? questionDef.questionHi : questionDef.question;

    if (!item) {
      return {
        qId,
        questionText: qText,
        pills: [notAnsweredLabel],
        detail: undefined,
      };
    }

    const labelObj = getQuestionnaireAnswerLabel(qId, item.answer, language);
    let pills: string[] = [];

    if (Array.isArray(item.answer)) {
      pills = item.answer.map((v) => {
        if ('options' in questionDef) {
          const opt = questionDef.options.find((o) => o.value === v);
          return opt ? (language === 'hi' && opt.labelHi ? opt.labelHi : opt.label) : String(v);
        }
        return String(v);
      });
    } else if (labelObj.label) {
      pills = [labelObj.label];
    }

    return {
      qId,
      questionText: qText,
      pills: pills.length > 0 ? pills : [notAnsweredLabel],
      detail: labelObj.detail,
    };
  };

  const renderSingleQuestionBox = (qData: ReturnType<typeof getStudentQAnswer>) => {
    if (!qData) return null;

    return (
      <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-2 shadow-xs">
        <div className="text-xs font-semibold text-[var(--color-text-primary)] leading-snug flex items-start gap-1.5">
          <span className="font-mono text-[11px] uppercase text-[var(--color-primary)] font-bold shrink-0">[{qData.qId.toUpperCase()}]</span>
          <span>{qData.questionText}</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {qData.pills.map((pill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg font-semibold text-xs bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
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
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2 shadow-xs">
        <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-200/60 dark:border-indigo-800/40 pb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'hi' ? 'शिक्षक अवलोकन कसौटियाँ' : 'Observation Focus Criteria'}</span>
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
                  <span>{language === 'hi' ? 'अभिरुचि चुनौती अंक:' : 'Aptitude Challenge Score:'}</span>
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
      case 'tf_sincerity': {
        const qDef = teacherFeedbackQuestions.find((q) => q.id === 'tf_sincerity');
        return renderObservationGuidanceBox(
          language === 'hi' ? 'ईमानदारी एवं समर्पण संबंधी कसौटियाँ:' : 'Sincerity & Dedication Criteria:',
          (language === 'hi' && qDef?.guidanceHi ? qDef.guidanceHi : qDef?.guidance) || []
        );
      }
      case 'tf_attendance': {
        const qDef = teacherFeedbackQuestions.find((q) => q.id === 'tf_attendance');
        return renderObservationGuidanceBox(
          language === 'hi' ? 'उपस्थिति एवं नियमितता संबंधी कसौटियाँ:' : 'Attendance & Punctuality Criteria:',
          (language === 'hi' && qDef?.guidanceHi ? qDef.guidanceHi : qDef?.guidance) || []
        );
      }
      case 'tf_discipline': {
        const qDef = teacherFeedbackQuestions.find((q) => q.id === 'tf_discipline');
        return renderObservationGuidanceBox(
          language === 'hi' ? 'कक्षा अनुशासन एवं आज्ञाकारिता संबंधी कसौटियाँ:' : 'Classroom Conduct & Discipline Criteria:',
          (language === 'hi' && qDef?.guidanceHi ? qDef.guidanceHi : qDef?.guidance) || []
        );
      }
      case 'tf_respect': {
        const qDef = teacherFeedbackQuestions.find((q) => q.id === 'tf_respect');
        return renderObservationGuidanceBox(
          language === 'hi' ? 'सम्मान एवं शिष्टाचार संबंधी कसौटियाँ:' : 'Interpersonal Respect Criteria:',
          (language === 'hi' && qDef?.guidanceHi ? qDef.guidanceHi : qDef?.guidance) || []
        );
      }
      case 'tf_cleanliness': {
        const qDef = teacherFeedbackQuestions.find((q) => q.id === 'tf_cleanliness');
        return renderObservationGuidanceBox(
          language === 'hi' ? 'स्वच्छता एवं सुव्यवस्था संबंधी कसौटियाँ:' : 'Workplace Neatness & Hygiene Criteria:',
          (language === 'hi' && qDef?.guidanceHi ? qDef.guidanceHi : qDef?.guidance) || []
        );
      }
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'विद्यार्थी प्रोफ़ाइल पर वापस जाएँ' : 'Back to Student Profile'}</span>
        </Link>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-[var(--color-surface)] rounded-2xl p-8 sm:p-10 border border-emerald-200 dark:border-emerald-800/80 shadow-md text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/80">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
                {language === 'hi' ? 'प्रतिक्रिया सफलतापूर्वक सहेजी गई' : 'Feedback Saved Successfully'}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
                {language === 'hi' ? (
                  <>
                    <strong>{student?.name}</strong> के लिए आपका अवलोकन और अनुशंसाएँ सुरक्षित रूप से दर्ज कर ली गई हैं।
                  </>
                ) : (
                  <>
                    Your educator observations and recommendations for <strong>{student?.name}</strong> have been securely recorded.
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-4 justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/students/${id}`)}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl"
              >
                {language === 'hi' ? 'विद्यार्थी प्रोफ़ाइल देखें' : 'View Student Profile'}
              </Button>
              <Button
                type="button"
                variant="gradient"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl"
              >
                {language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
                    {language === 'hi'
                      ? `शिक्षक अवलोकन प्रतिक्रिया: ${student?.name}`
                      : `Educator Observation Feedback: ${student?.name}`}
                  </h1>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-relaxed">
                    {language === 'hi'
                      ? `अपने अवलोकन रूपरेखा के साथ ${student?.name} के स्व-मूल्यांकन उत्तरों का तुलनात्मक दृश्य।`
                      : `Side-by-side view of ${student?.name}'s self-reported questionnaire responses alongside your observation framework.`}
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-[var(--color-primary-soft)] border border-indigo-200 dark:border-indigo-800/40 text-xs font-bold text-[var(--color-primary)] shrink-0 self-start sm:self-center">
                  {language === 'hi' ? `कक्षा ${student?.classGrade}` : `Class ${student?.classGrade}`}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {language === 'hi'
                    ? 'व्यवहार एवं दक्षता आकलन (1-5 पैमाना)'
                    : 'Behavioral & Competency Assessment (1-5 Scale)'}
                </h2>

                {teacherFeedbackQuestions
                  .filter((q) => q.type === 'rating')
                  .map((q, idx) => {
                    const studentContent = renderMatchedStudentAnswers(q.id);
                    const isGuidanceOnly = ['tf_sincerity', 'tf_attendance', 'tf_discipline', 'tf_respect', 'tf_cleanliness'].includes(q.id);
                    const questionText = language === 'hi' && q.questionHi ? q.questionHi : q.question;

                    return (
                      <div
                        key={q.id}
                        className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4 transition-colors"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-xs">
                            <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                              <span>
                                {isGuidanceOnly
                                  ? language === 'hi'
                                    ? 'शिक्षक मार्गदर्शन कसौटियाँ'
                                    : 'Educator Guidance Criteria'
                                  : language === 'hi'
                                  ? 'विद्यार्थी द्वारा दिया गया उत्तर'
                                  : "Student's Stated Answer"}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${isGuidanceOnly ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                            </div>
                            {studentContent}
                          </div>

                          <div className="lg:col-span-7 space-y-4">
                            <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                              {idx + 1}. {questionText} <span className="text-rose-500">*</span>
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
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>
                        {language === 'hi'
                          ? 'विद्यार्थी द्वारा दिया गया उत्तर'
                          : "Student's Stated Answer"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf8')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 1}.{' '}
                      {language === 'hi'
                        ? 'आपके अवलोकन के आधार पर विद्यार्थी की सबसे मजबूत क्षमताएँ किन क्षेत्रों में दिखाई देती हैं?'
                        : "Which areas appear to be the student's strongest based on your observations?"}{' '}
                      <span className="text-rose-500">*</span>
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
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>
                        {language === 'hi'
                          ? 'विद्यार्थी द्वारा दिया गया उत्तर'
                          : "Student's Stated Answer"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf9')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 2}.{' '}
                      {language === 'hi'
                        ? 'विद्यार्थी की रुचियों के अनुसार कौन-से करियर क्षेत्र सबसे अधिक उपयुक्त दिखाई देते हैं?'
                        : 'Which career direction interest areas align best with this student?'}{' '}
                      <span className="text-rose-500">*</span>
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
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                      <span>
                        {language === 'hi'
                          ? 'विद्यार्थी द्वारा दिया गया उत्तर'
                          : "Student's Stated Answer"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    {renderMatchedStudentAnswers('tf10')}
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                      {ratingQuestionsCount + 3}.{' '}
                      {language === 'hi'
                        ? 'विद्यार्थी के लिए कौन-सी कार्यशैली सबसे अधिक उपयुक्त दिखाई देती है?'
                        : 'What working environment style suits this student best?'}{' '}
                      <span className="text-rose-500">*</span>
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

              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
                <label className="block text-sm sm:text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                  {ratingQuestionsCount + 4}.{' '}
                  {language === 'hi'
                    ? 'शिक्षक/परामर्शदाता के अवलोकन एवं विस्तृत आकलन (वैकल्पिक)'
                    : 'Additional Counselor Notes & Recommendations (Optional)'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'विद्यार्थी के व्यक्तित्व, विशेष मार्गदर्शन की आवश्यकता, क्षमताओं और समग्र करियर सलाह पर विस्तृत टिप्पणी लिखें...'
                      : 'Share specific observations, strengths, or recommendations for future career counselling...'
                  }
                  rows={4}
                  className="w-full p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-y"
                />
              </div>

              {error && <p className="text-xs font-semibold text-rose-500 text-center">{error}</p>}

              <div className="flex justify-end gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/students/${id}`)}
                  className="px-6 py-3 text-xs font-semibold rounded-xl"
                  disabled={isSubmitting}
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  isLoading={isSubmitting}
                  className="px-8 py-3 text-xs font-semibold rounded-xl"
                >
                  {language === 'hi' ? 'शिक्षक प्रतिक्रिया जमा करें' : 'Submit Educator Feedback'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}


