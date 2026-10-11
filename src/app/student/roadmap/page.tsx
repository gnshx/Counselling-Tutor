'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/context/LanguageContext';
import { CareerRoadmapExplorer } from '@/components/roadmap/CareerRoadmapExplorer';

export default function StudentCareerRoadmapPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-indigo-500/30 selection:text-[var(--color-text-primary)]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[var(--color-surface)]/85 backdrop-blur-md border-b border-[var(--color-border-subtle)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHindi ? 'विद्यार्थी डैशबोर्ड' : 'Back to Dashboard'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)] hidden sm:inline">
                {isHindi ? 'करियर रोडमैप' : 'Career Pathways Roadmap'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Roadmap Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isHindi ? '10वीं के बाद के सभी रास्ते' : 'Educational Pathways After 10th & 12th'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-[var(--font-heading)] font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {isHindi ? 'करियर एवं स्ट्रीम मार्गदर्शक' : 'Career & Stream Roadmap'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {isHindi
              ? 'इंटरमीडिएट, पॉलिटेक्निक, आईटीआई, पैरामेडिकल और रक्षा सेवाओं के सभी मानक पाठ्यक्रम एवं उनके बाद मिलने वाले रोजगार।'
              : 'Detailed guide covering Intermediate (+2), Polytechnic Diplomas, ITI Craftsman Trades, Paramedical Diplomas, and Uniformed Services.'}
          </p>
        </div>

        <CareerRoadmapExplorer />
      </main>
    </div>
  );
}
