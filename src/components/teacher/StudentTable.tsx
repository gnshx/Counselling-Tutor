'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '../ui/StatusBadge';
import { KeyRound, Eye, MessageSquarePlus, CheckCircle } from 'lucide-react';

export interface StudentListItem {
  id: string;
  name: string;
  dob: string | Date;
  classGrade: string;
  school?: string | null;
  accessCode: string;
  questionnaireStatus: string;
  assessmentStatus: string;
  feedbackStatus: string;
  createdAt: string | Date;
  questionnaireResponse?: { id: string } | null;
  assessmentResponse?: { id: string; score: number; totalQuestions: number } | null;
  teacherFeedback?: { id: string } | null;
}

interface StudentTableProps {
  students: StudentListItem[];
  onCopyCode?: (code: string) => void;
}

export function StudentTable({ students }: StudentTableProps) {
  const computeOverallStatus = (s: StudentListItem) => {
    const qDone = s.questionnaireStatus === 'completed';
    const aDone = s.assessmentStatus === 'completed';
    const fDone = s.feedbackStatus === 'completed';

    if (qDone && aDone && fDone) return 'completed';
    if (qDone || aDone || fDone) return 'in_progress';
    return 'not_started';
  };

  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No students found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Add your first student to generate an access code and start their career discovery journey.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/70 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Student Info</th>
              <th className="py-3.5 px-4">Access Code</th>
              <th className="py-3.5 px-4 text-center">Questionnaire</th>
              <th className="py-3.5 px-4 text-center">Brain Challenge</th>
              <th className="py-3.5 px-4 text-center">Teacher Feedback</th>
              <th className="py-3.5 px-4 text-center">Overall</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {students.map((student) => {
              const overall = computeOverallStatus(student);
              const formattedDob = new Date(student.dob).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              const isFeedbackReady =
                student.questionnaireStatus === 'completed' && student.assessmentStatus === 'completed';
              const isFeedbackDone = student.feedbackStatus === 'completed';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Name & Class */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Class {student.classGrade}</span>
                      <span>•</span>
                      <span>DOB: {formattedDob}</span>
                    </div>
                  </td>

                  {/* Access Code */}
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      <KeyRound className="w-3 h-3 text-indigo-500" />
                      <span>{student.accessCode}</span>
                    </div>
                  </td>

                  {/* Questionnaire Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={student.questionnaireStatus} size="sm" />
                  </td>

                  {/* Assessment Status */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <StatusBadge status={student.assessmentStatus} size="sm" />
                      {student.assessmentResponse && (
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                          Score: {student.assessmentResponse.score}/{student.assessmentResponse.totalQuestions}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Teacher Feedback Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={student.feedbackStatus} size="sm" />
                  </td>

                  {/* Overall Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={overall} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </Link>

                      {isFeedbackDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Feedback Submitted</span>
                        </span>
                      ) : (
                        <Link
                          href={`/dashboard/students/${student.id}/feedback`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isFeedbackReady
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300'
                          }`}
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>Give Feedback</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
