'use client';

import { CheckCircle2, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

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
  const { language } = useLanguage();

  const defaultTitle =
    language === 'hi' ? `शाबाश, ${studentName}!` : `Great Job, ${studentName}!`;

  const defaultSubtitle =
    language === 'hi'
      ? 'अपने विचार साझा करने और अपनी रुचियों को खोजने के लिए धन्यवाद।'
      : 'Thank you for sharing your thoughts and exploring your interests.';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-[var(--color-surface)] rounded-2xl p-7 sm:p-10 border border-[var(--color-border-subtle)] shadow-lg shadow-indigo-500/5 text-center max-w-xl mx-auto space-y-6 transition-colors"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
          {title || defaultTitle}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {onNextJourney && nextJourneyTitle ? (
        <button
          onClick={onNextJourney}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span>
            {language === 'hi' ? `${nextJourneyTitle} पर आगे बढ़ें` : `Continue to ${nextJourneyTitle}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : isAllCompleted ? (
        <div className="space-y-6 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] text-xs font-medium flex items-center justify-center gap-2 border border-[var(--color-border-subtle)]">
            <Heart className="w-4 h-4 text-violet-500 shrink-0" />
            <span>
              {language === 'hi'
                ? 'अब आपके शिक्षक आपके प्रोफ़ाइल को और बेहतर बनाने के लिए अपना अवलोकन जोड़ सकते हैं।'
                : 'Your educator can now add observation feedback to personalize your profile.'}
            </span>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/15 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{language === 'hi' ? 'मेरी यात्रा पर वापस जाएँ' : 'Return to My Discovery Journey'}</span>
          </Link>
        </div>
      ) : (
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/15 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <span>{language === 'hi' ? 'मेरी यात्रा पर वापस जाएँ' : 'Back to My Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}
