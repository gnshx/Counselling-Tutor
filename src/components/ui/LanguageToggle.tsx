'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-0.5 sm:p-1 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold shadow-xs">
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs ${
          language === 'hi'
            ? 'bg-blue-600 text-white font-bold shadow-xs'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
        title="हिन्दी में देखें (Hindi)"
      >
        <span>हिन्दी</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs ${
          language === 'en'
            ? 'bg-blue-600 text-white font-bold shadow-xs'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
        title="View in English"
      >
        <span>English</span>
      </button>
    </div>
  );
}
