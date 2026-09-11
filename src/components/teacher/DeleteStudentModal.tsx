'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface DeleteStudentModalProps {
  isOpen: boolean;
  studentName: string;
  accessCode: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteStudentModal({
  isOpen,
  studentName,
  accessCode,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteStudentModalProps) {
  const { language } = useLanguage();
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmInput('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatched = confirmInput.trim().toUpperCase() === 'DELETE';

  const handleConfirm = async () => {
    if (!isMatched || isDeleting) return;
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-[var(--color-text-primary)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-[var(--font-heading)] font-bold text-[var(--color-text-primary)]">
              {language === 'hi' ? 'विद्यार्थी प्रोफ़ाइल हटाएं' : 'Delete Student Profile'}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {language === 'hi' ? 'स्थायी निष्कासन एवं डेटा विलोपन' : 'Permanent record deletion'}
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 space-y-1.5">
          <p className="font-semibold">
            {language === 'hi'
              ? `क्या आप वाकई ${studentName} (${accessCode}) को हटाना चाहते हैं?`
              : `Are you sure you want to permanently delete ${studentName} (${accessCode})?`}
          </p>
          <p className="text-[11px] leading-relaxed text-rose-700/90 dark:text-rose-400/90">
            {language === 'hi'
              ? 'यह क्रिया पूर्ववत नहीं की जा सकती। खोज प्रश्नावली उत्तर, चिंतन चुनौती स्कोर और शिक्षक अवलोकन हमेशा के लिए मिटा दिए जाएंगे।'
              : 'This action cannot be undone. All discovery answers, challenge scores, and teacher feedbacks will be permanently purged.'}
          </p>
        </div>

        {/* Confirmation Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
            {language === 'hi' ? (
              <>
                हटाने की पुष्टि करने के लिए नीचे <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">DELETE</span> टाइप करें:
              </>
            ) : (
              <>
                To confirm deletion, type <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">DELETE</span> below:
              </>
            )}
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="DELETE"
            disabled={isDeleting}
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm font-mono text-[var(--color-text-primary)] outline-hidden transition-all"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isMatched || isDeleting}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isMatched && !isDeleting
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-[0.98]'
                : 'bg-rose-300 dark:bg-rose-950 text-rose-100 dark:text-rose-400 cursor-not-allowed opacity-60'
            }`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'hi' ? 'हटाया जा रहा है...' : 'Deleting...'}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'पुष्टि करें एवं हटाएं' : 'Confirm & Delete'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
