'use client';

import React from 'react';
import { Sparkles, Trophy, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompletionScreenProps {
  studentName?: string;
  onNextJourney?: () => void;
  nextJourneyTitle?: string;
  isAllCompleted?: boolean;
  title?: string;
  subtitle?: string;
}

export function CompletionScreen({
  studentName = 'Friend',
  onNextJourney,
  nextJourneyTitle,
  isAllCompleted = false,
  title,
  subtitle,
}: CompletionScreenProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-12 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] text-center max-w-xl mx-auto space-y-8 animate-fadeIn">
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-[2rem] bg-[var(--color-primary-soft)] flex items-center justify-center text-4xl mx-auto animate-bounce border border-[var(--color-primary)]">
          ✨
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          {title || `Great Job, ${studentName}!`}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
          {subtitle || "Thank you for sharing your thoughts and exploring your interests."}
        </p>
      </div>

      {onNextJourney && nextJourneyTitle ? (
        <button
          onClick={onNextJourney}
          className="w-full py-4 px-6 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-lg shadow-sm hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Continue to {nextJourneyTitle}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : isAllCompleted ? (
        <div className="space-y-8 pt-6 border-t border-[var(--color-border-subtle)]">
          <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] text-sm font-medium flex items-center justify-center gap-2">
            <span>Next: Your counselor can now add their observations.</span>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Back to My Journey</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
