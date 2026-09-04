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
    if (qDone && aDone && !fDone) return 'review_needed';
    if (qDone || aDone || fDone) return 'in_progress';
    return 'not_started';
  };

  if (students.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-12 text-center shadow-xs transition-colors">
        <div className="w-12 h-12 bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[var(--color-border-subtle)]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-base font-[var(--font-heading)] text-[var(--color-text-primary)] mb-1">No students found</h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto mb-4">
          Add your first student to generate an access code and start their career discovery journey.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden shadow-xs transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-soft)]/60 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-5">Student Info</th>
              <th className="py-4 px-4">Access Code</th>
              <th className="py-4 px-4 text-center">Discovery</th>
              <th className="py-4 px-4 text-center">Challenge</th>
              <th className="py-4 px-4 text-center">Feedback</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 sm:px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)] text-sm">
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
                  className="hover:bg-[var(--color-surface-soft)]/50 transition-colors"
                >
                  {/* Name & Class */}
                  <td className="py-4 px-4 sm:px-5">
                    <div className="font-semibold text-[var(--color-text-primary)]">{student.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5 font-normal">
                      <span className="font-semibold text-[var(--color-primary)]">Class {student.classGrade}</span>
                      <span>•</span>
                      <span>DOB: {formattedDob}</span>
                    </div>
                  </td>

                  {/* Access Code */}
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-mono font-bold text-[var(--color-text-primary)]">
                      <KeyRound className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>{student.accessCode}</span>
                    </div>
                  </td>

                  {/* Questionnaire Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={student.questionnaireStatus} size="sm" />
                  </td>

                  {/* Assessment Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={student.assessmentStatus} size="sm" />
                  </td>

                  {/* Teacher Feedback Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={student.feedbackStatus} size="sm" />
                  </td>

                  {/* Overall Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={overall} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </Link>

                      {isFeedbackDone ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <Link
                          href={`/dashboard/students/${student.id}/feedback`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isFeedbackReady
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs cursor-pointer'
                              : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)]'
                          }`}
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>{isFeedbackReady ? 'Add Feedback' : 'Wait...'}</span>
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
