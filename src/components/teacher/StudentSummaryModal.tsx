'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { StudentSummaryCard } from './StudentSummaryCard';
import { useLanguage } from '@/lib/context/LanguageContext';

interface StudentSummaryModalProps {
  isOpen: boolean;
  studentId: string | null;
  onClose: () => void;
}

export function StudentSummaryModal({
  isOpen,
  studentId,
  onClose,
}: StudentSummaryModalProps) {
  const { language } = useLanguage();
  const [student, setStudent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !studentId) {
      setStudent(null);
      return;
    }

    let isMounted = true;
    async function fetchStudentDetail() {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) throw new Error('Failed to load student');
        const data = await res.json();
        if (isMounted) {
          setStudent(data.student);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error loading details');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchStudentDetail();
    return () => {
      isMounted = false;
    };
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl flex flex-col text-[var(--color-text-primary)] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)]/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-primary)]">
            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{language === 'hi' ? 'त्वरित विद्यार्थी सारांश' : 'Quick Student Summary'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-[var(--color-text-secondary)] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" />
              <p>{language === 'hi' ? 'सारांश तैयार किया जा रहा है...' : 'Generating student summary...'}</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-xs text-rose-500 font-medium">
              {error}
            </div>
          ) : student ? (
            <StudentSummaryCard student={student} />
          ) : null}
        </div>

        {/* Modal Footer */}
        {student && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)]/50 text-xs">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-colors font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>

            <Link
              href={`/dashboard/students/${student.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>{language === 'hi' ? 'पूर्ण प्रोफ़ाइल देखें' : 'View Full Profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
