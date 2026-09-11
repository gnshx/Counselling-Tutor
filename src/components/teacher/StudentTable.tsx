'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '../ui/StatusBadge';
import { KeyRound, Eye, MessageSquarePlus, CheckCircle, Sparkles, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { DeleteStudentModal } from './DeleteStudentModal';
import { StudentSummaryModal } from './StudentSummaryModal';

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
  onStudentDeleted?: (studentId: string) => void;
}

export function StudentTable({ students, onStudentDeleted }: StudentTableProps) {
  const { language } = useLanguage();
  const [summaryStudentId, setSummaryStudentId] = useState<string | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete student');
      }
      onStudentDeleted?.(deletingStudent.id);
      setDeletingStudent(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <h3 className="text-base font-[var(--font-heading)] text-[var(--color-text-primary)] mb-1">
          {language === 'hi' ? 'कोई विद्यार्थी नहीं मिला' : 'No students found'}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto mb-4">
          {language === 'hi'
            ? 'एक्सेस कोड जनरेट करने और करियर खोज यात्रा शुरू करने के लिए अपना पहला विद्यार्थी जोड़ें।'
            : 'Add your first student to generate an access code and start their career discovery journey.'}
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
              <th className="py-4 px-4 sm:px-5">{language === 'hi' ? 'विद्यार्थी जानकारी' : 'Student Info'}</th>
              <th className="py-4 px-4">{language === 'hi' ? 'एक्सेस कोड' : 'Access Code'}</th>
              <th className="py-4 px-4 text-center">{language === 'hi' ? 'खोज यात्रा' : 'Discovery'}</th>
              <th className="py-4 px-4 text-center">{language === 'hi' ? 'चुनौती' : 'Challenge'}</th>
              <th className="py-4 px-4 text-center">{language === 'hi' ? 'प्रतिक्रिया' : 'Feedback'}</th>
              <th className="py-4 px-4 text-center">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
              <th className="py-4 px-4 sm:px-5 text-right">{language === 'hi' ? 'कार्य' : 'Actions'}</th>
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
                      <span className="font-semibold text-[var(--color-primary)]">
                        {language === 'hi' ? 'कक्षा' : 'Class'} {student.classGrade}
                      </span>
                      <span>•</span>
                      <span>{language === 'hi' ? 'जन्म: ' : 'DOB: '}{formattedDob}</span>
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
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      {/* Quick Summary Button */}
                      <button
                        type="button"
                        onClick={() => setSummaryStudentId(student.id)}
                        title={language === 'hi' ? 'त्वरित सारांश' : 'Quick Summary'}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{language === 'hi' ? 'सारांश' : 'Summary'}</span>
                      </button>

                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
                      </Link>

                      {isFeedbackDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'दर्ज' : 'Done'}</span>
                        </span>
                      ) : (
                        <Link
                          href={`/dashboard/students/${student.id}/feedback`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isFeedbackReady
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xs cursor-pointer'
                              : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)]'
                          }`}
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>
                            {isFeedbackReady
                              ? language === 'hi'
                                ? 'फीडबैक'
                                : 'Feedback'
                              : language === 'hi'
                              ? 'प्रतीक्षा...'
                              : 'Wait...'}
                          </span>
                        </Link>
                      )}

                      {/* Delete Student Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingStudent(student)}
                        title={language === 'hi' ? 'विद्यार्थी हटाएं' : 'Delete Student'}
                        className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-all cursor-pointer"
                        aria-label="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteStudentModal
        isOpen={Boolean(deletingStudent)}
        studentName={deletingStudent?.name || ''}
        accessCode={deletingStudent?.accessCode || ''}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Quick Summary Modal */}
      <StudentSummaryModal
        isOpen={Boolean(summaryStudentId)}
        studentId={summaryStudentId}
        onClose={() => setSummaryStudentId(null)}
      />
    </div>
  );
}
