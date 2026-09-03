import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-10 border border-[var(--color-border-subtle)] shadow-2xs text-center max-w-xl mx-auto space-y-6 transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)]">
          {title || `Great Job, ${studentName}!`}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
          {subtitle || "Thank you for sharing your thoughts and exploring your interests."}
        </p>
      </div>

      {onNextJourney && nextJourneyTitle ? (
        <button
          onClick={onNextJourney}
          className="w-full py-3 px-5 rounded-lg bg-[var(--color-primary)] text-white font-medium text-sm shadow-2xs hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to {nextJourneyTitle}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : isAllCompleted ? (
        <div className="space-y-6 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="p-3.5 rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] text-xs font-medium flex items-center justify-center gap-2 border border-[var(--color-border-subtle)]">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Next: Your educator can now add observation feedback.</span>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Back to My Journey</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
