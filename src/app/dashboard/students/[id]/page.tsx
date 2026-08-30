'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, Calendar, GraduationCap, School, Briefcase, DollarSign, MessageSquarePlus, CheckCircle } from 'lucide-react';
import { questionnaireQuestions } from '@/lib/data/questionnaire';

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
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[var(--color-background-main)]">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-[var(--color-text-secondary)]">
          <p>Student not found.</p>
          <Link href="/dashboard" className="text-[var(--color-primary)] font-bold hover:underline mt-2 block">
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

  const getQuestionnaireAnswerLabel = (qId: string, ans: any) => {
    const question = questionnaireQuestions.find((q) => q.id === qId);
    if (!question) return String(ans);

    if (Array.isArray(ans)) {
      return ans
        .map((a) => {
          if ('options' in question) {
            const opt = question.options.find((o) => o.value === a);
            return opt ? opt.label : a;
          }
          return a;
        })
        .join(', ');
    }

    if (typeof ans === 'string' && 'options' in question) {
      const opt = question.options.find((o) => o.value === ans);
      if (opt) return opt.label;
    }

    return String(ans);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {student.feedbackStatus !== 'completed' && (
            <Link
              href={`/dashboard/students/${student.id}/feedback`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-sm transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Educator Feedback</span>
            </Link>
          )}
        </div>

        {/* Student Profile Card */}
        <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-10 border border-[var(--color-border-subtle)] shadow-sm space-y-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-3xl font-black border border-[var(--color-primary)]/20 shadow-sm">
                {student.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)] mt-2 font-medium">
                  <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <GraduationCap className="w-4 h-4" /> Class {student.classGrade}
                  </span>
                  <span className="text-[var(--color-border-subtle)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> DOB: {formattedDob}
                  </span>
                  {student.school && (
                    <>
                      <span className="text-[var(--color-border-subtle)]">•</span>
                      <span className="flex items-center gap-1.5">
                        <School className="w-4 h-4" /> {student.school}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-sm font-mono font-bold text-[var(--color-text-primary)]">
              Access Code: <strong className="text-[var(--color-primary)]">{student.accessCode}</strong>
            </div>
          </div>

          {/* Family Background Info */}
          {(student.parentJob || student.familyIncome) && (
            <div className="p-5 rounded-[1.25rem] bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex flex-wrap gap-6 text-sm">
              {student.parentJob && (
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Briefcase className="w-4 h-4" />
                  <span>Parent Occupation: <strong className="text-[var(--color-text-primary)]">{student.parentJob}</strong></span>
                </div>
              )}
              {student.familyIncome && (
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <DollarSign className="w-4 h-4" />
                  <span>Family Income Range: <strong className="text-[var(--color-text-primary)]">{student.familyIncome}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Progress Overview Section */}
          <div>
            <h2 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Progress Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] shadow-sm flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">Discovery</span>
                <StatusBadge status={student.questionnaireStatus} />
              </div>
              <div className="p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] shadow-sm flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">Challenge</span>
                <StatusBadge status={student.assessmentStatus} />
              </div>
              <div className="p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] shadow-sm flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">Feedback</span>
                <StatusBadge status={student.feedbackStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-10 border border-[var(--color-border-subtle)] shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Student Discovery</h2>
            <StatusBadge status={student.questionnaireStatus} size="sm" />
          </div>

          {student.questionnaireResponse ? (
            <div className="space-y-4 pt-2">
              {student.questionnaireResponse.responses.map((item, idx) => {
                const q = questionnaireQuestions.find((ques) => ques.id === item.questionId);
                return (
                  <div key={idx} className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
                    <p className="text-sm font-bold text-[var(--color-text-secondary)] mb-2">
                      {q ? q.question : item.questionId}
                    </p>
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">
                      {getQuestionnaireAnswerLabel(item.questionId, item.answer)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] italic py-4">Discovery not completed by student yet.</p>
          )}
        </div>

        {/* Assessment Section */}
        <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-10 border border-[var(--color-border-subtle)] shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Brain & Life Challenge</h2>
            <StatusBadge status={student.assessmentStatus} size="sm" />
          </div>

          {student.assessmentResponse ? (
            <div className="space-y-4 pt-2">
              <div className="p-6 rounded-2xl bg-[var(--color-cyan-soft)] border border-[var(--color-cyan)]/20 flex items-center justify-between">
                <span className="text-base font-bold text-[var(--color-cyan)]">Assessment Score</span>
                <span className="text-3xl font-bold text-[var(--color-cyan)]">
                  {student.assessmentResponse.score} / {student.assessmentResponse.totalQuestions}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] italic py-4">Challenge not completed by student yet.</p>
          )}
        </div>

        {/* Teacher Feedback Section */}
        <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-10 border border-[var(--color-border-subtle)] shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Educator Feedback</h2>
            <StatusBadge status={student.feedbackStatus} size="sm" />
          </div>

          {student.teacherFeedback ? (
            <div className="space-y-6 pt-2">
              <div className="p-5 rounded-xl bg-[var(--color-success-soft)] border border-[var(--color-success)]/20 text-[var(--color-success)] text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Feedback submitted</span>
              </div>

              {student.teacherFeedback.comment && (
                <div className="p-5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Educator Comment</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">{student.teacherFeedback.comment}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Observations pending for this student.</p>
              <Link
                href={`/dashboard/students/${student.id}/feedback`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-sm transition-all"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>Provide Observations Now</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
