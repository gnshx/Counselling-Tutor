'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, User, Calendar, GraduationCap, School, MessageSquarePlus, CheckCircle } from 'lucide-react';
import { questionnaireQuestions } from '@/lib/data/questionnaire';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';

interface StudentDetail {
  id: string;
  name: string;
  dob: string;
  classGrade: string;
  school?: string | null;
  parentBackground?: string | null;
  backgroundInfo?: string | null;
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
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500">
          <p>Student not found.</p>
          <Link href="/dashboard" className="text-indigo-600 font-bold underline mt-2 block">
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

  // Helper to map questionnaire response IDs to human-readable labels
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {student.feedbackStatus !== 'completed' && (
            <Link
              href={`/dashboard/students/${student.id}/feedback`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Teacher Feedback</span>
            </Link>
          )}
        </div>

        {/* Student Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                {student.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                    <GraduationCap className="w-3.5 h-3.5" /> Class {student.classGrade}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> DOB: {formattedDob}
                  </span>
                  {student.school && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <School className="w-3.5 h-3.5" /> {student.school}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              Access Code: <strong className="text-indigo-600 dark:text-indigo-400">{student.accessCode}</strong>
            </div>
          </div>

          {/* Progress Overview Section */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Progress Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Questionnaire</span>
                <StatusBadge status={student.questionnaireStatus} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Brain Challenge</span>
                <StatusBadge status={student.assessmentStatus} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Teacher Feedback</span>
                <StatusBadge status={student.feedbackStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Student Questionnaire</h2>
            <StatusBadge status={student.questionnaireStatus} size="sm" />
          </div>

          {student.questionnaireResponse ? (
            <div className="space-y-4 pt-2">
              {student.questionnaireResponse.responses.map((item, idx) => {
                const q = questionnaireQuestions.find((ques) => ques.id === item.questionId);
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      {q ? q.question : item.questionId}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {getQuestionnaireAnswerLabel(item.questionId, item.answer)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic py-4">Questionnaire not completed by student yet.</p>
          )}
        </div>

        {/* Assessment Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Brain & Life Challenge Assessment</h2>
            <StatusBadge status={student.assessmentStatus} size="sm" />
          </div>

          {student.assessmentResponse ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between">
                <span className="text-sm font-bold text-purple-900 dark:text-purple-200">Assessment Score</span>
                <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
                  {student.assessmentResponse.score} / {student.assessmentResponse.totalQuestions}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic py-4">Brain challenge not completed by student yet.</p>
          )}
        </div>

        {/* Teacher Feedback Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Teacher Feedback</h2>
            <StatusBadge status={student.feedbackStatus} size="sm" />
          </div>

          {student.teacherFeedback ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Feedback submitted on {new Date().toLocaleDateString()}</span>
              </div>

              {student.teacherFeedback.comment && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 mb-1">Teacher Comment:</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{student.teacherFeedback.comment}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-slate-500">Teacher feedback pending for this student.</p>
              <Link
                href={`/dashboard/students/${student.id}/feedback`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Provide Feedback Now</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
