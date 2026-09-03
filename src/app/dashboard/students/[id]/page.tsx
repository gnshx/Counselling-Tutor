'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  School,
  Briefcase,
  DollarSign,
  MessageSquarePlus,
  CheckCircle,
  Sparkles,
  Brain,
  Compass,
  Star,
  Target,
  Sun,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import {
  formatQuestionnaireResponse,
  formatAssessmentResponse,
  FormattedQuestionnaireData,
  FormattedAssessmentData,
} from '@/lib/utils/profile-formatter';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';

interface StudentDetail {
  id: string;
  name: string;
  dob: string;
  classGrade: string;
  school?: string | null;
  parentJob?: string | null;
  familyIncome?: string | null;
  accessCode: string;
  questionnaireStatus: string;
  assessmentStatus: string;
  feedbackStatus: string;
  questionnaireResponse?: { responses: { questionId: string; answer: any }[] } | null;
  assessmentResponse?: { score: number; totalQuestions: number; responses: any[] } | null;
  teacherFeedback?: {
    ratings: { questionId: string; rating: any }[];
    strongestAreas?: string[];
    interestedAreas?: string[];
    workingStyle?: string;
    comment?: string;
  } | null;
}

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssessmentQuestions, setShowAssessmentQuestions] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        }
      } catch {
        console.error('Error loading student profile');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)]">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-[var(--color-text-secondary)]">
          <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)] font-sans antialiased">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-[var(--color-text-secondary)]">
          <p className="text-sm font-medium">Student profile not found.</p>
          <Link href="/dashboard" className="text-xs text-[var(--color-primary)] font-semibold hover:underline mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formattedDob = new Date(student.dob).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const questionnaireData: FormattedQuestionnaireData | null = student.questionnaireResponse
    ? formatQuestionnaireResponse(student.questionnaireResponse.responses)
    : null;

  const assessmentData: FormattedAssessmentData | null = student.assessmentResponse
    ? formatAssessmentResponse(student.assessmentResponse)
    : null;

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased pb-16">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {student.feedbackStatus !== 'completed' && (
            <Link
              href={`/dashboard/students/${student.id}/feedback`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-xs shadow-2xs transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Provide Educator Feedback</span>
            </Link>
          )}
        </div>

        {/* Student Header Card */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-2xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold border border-[var(--color-primary)]/20 shadow-2xs shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--color-text-secondary)] mt-1.5 font-medium">
                  <span className="flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" /> Class {student.classGrade}
                  </span>
                  <span className="text-[var(--color-border-subtle)]">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> DOB: {formattedDob}
                  </span>
                  {student.school && (
                    <>
                      <span className="text-[var(--color-border-subtle)]">•</span>
                      <span className="flex items-center gap-1">
                        <School className="w-3.5 h-3.5" /> {student.school}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-primary)] shrink-0 self-start sm:self-center">
              Access Code: <strong className="text-[var(--color-primary)] font-bold">{student.accessCode}</strong>
            </div>
          </div>

          {/* Family & Context Info */}
          {(student.parentJob || student.familyIncome) && (
            <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex flex-wrap gap-6 text-xs">
              {student.parentJob && (
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Parent Occupation: <strong className="text-[var(--color-text-primary)] font-semibold">{student.parentJob}</strong></span>
                </div>
              )}
              {student.familyIncome && (
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Family Income Range: <strong className="text-[var(--color-text-primary)] font-semibold">{student.familyIncome}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Progress Overview Section */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Assessment Milestones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">Student Discovery</span>
                </div>
                <StatusBadge status={student.questionnaireStatus} />
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">Thinking Challenge</span>
                </div>
                <StatusBadge status={student.assessmentStatus} />
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquarePlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">Educator Feedback</span>
                </div>
                <StatusBadge status={student.feedbackStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Structured Student Discovery Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-2xs space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/20">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Student Discovery Profile</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">Self-reported interests, strengths, and career goals</p>
              </div>
            </div>
            <StatusBadge status={student.questionnaireStatus} size="sm" />
          </div>

          {questionnaireData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category 1: Passions & Curiosity */}
              <div className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--color-border-subtle)] pb-2.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Curiosity & Passions</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Favorite Subjects</p>
                    {questionnaireData.passions.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {questionnaireData.passions.subjects.map((sub, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-medium text-xs border border-[var(--color-primary)]/20">
                            {sub}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">None specified</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Fulfilling Activities</p>
                    {questionnaireData.passions.activities.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {questionnaireData.passions.activities.map((act, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium text-xs border border-[var(--color-border-subtle)]">
                            {act}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">None specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category 2: Superpowers & Strengths */}
              <div className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider border-b border-[var(--color-border-subtle)] pb-2.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>Strengths & Attributes</span>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Self-Reported Strengths</p>
                  {questionnaireData.talents.strengths.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {questionnaireData.talents.strengths.map((str, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-xs border border-amber-200 dark:border-amber-800/60">
                          {str}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--color-text-muted)] italic">None specified</p>
                  )}
                </div>
              </div>

              {/* Category 3: Work Style & Mindset */}
              <div className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider border-b border-[var(--color-border-subtle)] pb-2.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Work Style & Mindset</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">Ideal Environment</p>
                    <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-medium text-[var(--color-text-primary)]">
                      {questionnaireData.style.environment}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">Challenge Approach</p>
                    <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-medium text-[var(--color-text-primary)]">
                      {questionnaireData.style.challengeApproach}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 4: Future Career Aspirations */}
              <div className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider border-b border-[var(--color-border-subtle)] pb-2.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Career Aspirations</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Exciting Career Fields</p>
                    {questionnaireData.aspirations.careerPaths.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {questionnaireData.aspirations.careerPaths.map((cp, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800/60">
                            {cp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">None specified</p>
                    )}
                  </div>

                  {questionnaireData.aspirations.dreamRole && (
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">Dream Role Goal</p>
                      <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-medium text-[var(--color-text-primary)] flex flex-col gap-0.5 text-xs">
                        <span>{questionnaireData.aspirations.dreamRole.choice}</span>
                        {questionnaireData.aspirations.dreamRole.detail && (
                          <span className="text-xs text-[var(--color-primary)] font-semibold">
                            Note: &ldquo;{questionnaireData.aspirations.dreamRole.detail}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {questionnaireData.aspirations.inspirations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Key Motivations</p>
                      <div className="flex flex-wrap gap-1.5">
                        {questionnaireData.aspirations.inspirations.map((insp, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-xs border border-[var(--color-border-subtle)] font-medium">
                            {insp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 5: Growth Potential & Needed Guidance */}
              <div className="md:col-span-2 p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider border-b border-[var(--color-border-subtle)] pb-2.5">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Growth Readiness & Desired Support</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Exploration Readiness</p>
                    <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-text-primary)]">
                      {questionnaireData.growth.readiness}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Desired Support</p>
                    {questionnaireData.growth.supportNeeds.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {questionnaireData.growth.supportNeeds.map((sup, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-xs border border-emerald-200 dark:border-emerald-800/60">
                            {sup}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] italic">None specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] italic py-6 text-center">Discovery section not completed by student yet.</p>
          )}
        </div>

        {/* Structured Brain & Life Challenge (Assessment) Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-2xs space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800/60">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Thinking Challenge Breakdown</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">Category performance scores and question results</p>
              </div>
            </div>
            <StatusBadge status={student.assessmentStatus} size="sm" />
          </div>

          {assessmentData ? (
            <div className="space-y-6">
              {/* Overall Score Banner */}
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-2xs">
                    {assessmentData.percent}%
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sky-950 dark:text-sky-100">Overall Aptitude Performance</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      Answered {assessmentData.score} out of {assessmentData.totalQuestions} questions correctly
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAssessmentQuestions(!showAssessmentQuestions)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] text-xs font-medium text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] shadow-2xs transition-colors cursor-pointer"
                >
                  <span>{showAssessmentQuestions ? 'Hide Questions' : 'View Questions'}</span>
                  {showAssessmentQuestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 3 Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assessmentData.categories.map((cat) => (
                  <div key={cat.key} className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-text-primary)]">{cat.label}</span>
                      <span className="font-bold text-[var(--color-primary)]">
                        {cat.score} / {cat.total}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>

                    <p className="text-right text-xs text-[var(--color-text-secondary)] font-medium">{cat.percent}% Score</p>
                  </div>
                ))}
              </div>

              {/* Question Level Detailed List */}
              {showAssessmentQuestions && (
                <div className="space-y-3 pt-4 border-t border-[var(--color-border-subtle)]">
                  <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Question Breakdown</h3>
                  <div className="space-y-3">
                    {assessmentData.questionDetails.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-2.5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{q.categoryLabel}</span>
                            <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-0.5">
                              {idx + 1}. {q.question}
                            </p>
                          </div>
                          {q.isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800/60 shrink-0">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                            <span className="text-[var(--color-text-secondary)]">Student Selected: </span>
                            <strong className={q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{q.selectedAnswer}</strong>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                            <span className="text-[var(--color-text-secondary)]">Correct Answer: </span>
                            <strong className="text-[var(--color-text-primary)]">{q.correctAnswer}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] italic py-6 text-center">Challenge not completed by student yet.</p>
          )}
        </div>

        {/* Educator Feedback Summary Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-2xs space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/60">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Educator Guidance & Notes</h2>
            </div>
            <StatusBadge status={student.feedbackStatus} size="sm" />
          </div>

          {student.teacherFeedback ? (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Educator Observations Complete</span>
                </div>
                <Link
                  href={`/dashboard/students/${student.id}/feedback`}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Edit Observations
                </Link>
              </div>

              {student.teacherFeedback.ratings && student.teacherFeedback.ratings.length > 0 && (
                <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
                  <span className="font-semibold text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block">
                    Observed Ratings & Behavioral Traits
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {student.teacherFeedback.ratings.map((rItem) => {
                      const qDef = teacherFeedbackQuestions.find((q) => q.id === rItem.questionId);
                      if (!qDef) return null;
                      return (
                        <div key={rItem.questionId} className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-between text-xs gap-2">
                          <span className="font-medium text-[var(--color-text-primary)] leading-tight">{qDef.question}</span>
                          <span className="px-2.5 py-1 rounded font-bold text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shrink-0">
                            {rItem.rating === 'N/O' ? 'N/O' : `${rItem.rating} / 5`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {student.teacherFeedback.strongestAreas && student.teacherFeedback.strongestAreas.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs">
                  <span className="font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Strongest Observed Areas</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.teacherFeedback.strongestAreas.map((area, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800/60 capitalize">
                        {area.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {student.teacherFeedback.interestedAreas && student.teacherFeedback.interestedAreas.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs">
                  <span className="font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">Observed Interest Areas</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.teacherFeedback.interestedAreas.map((area, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800/60 capitalize">
                        {area.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {student.teacherFeedback.workingStyle && (
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs">
                  <span className="font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Observed Working Style</span>
                  <span className="font-semibold text-[var(--color-text-primary)] capitalize">{student.teacherFeedback.workingStyle}</span>
                </div>
              )}

              {student.teacherFeedback.comment && (
                <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Educator Comment</p>
                  <p className="text-xs font-medium text-[var(--color-text-primary)] leading-relaxed">{student.teacherFeedback.comment}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-[var(--color-text-secondary)]">Educator observations pending for this student.</p>
              <Link
                href={`/dashboard/students/${student.id}/feedback`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-xs shadow-2xs transition-colors"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Provide Observations Now</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
