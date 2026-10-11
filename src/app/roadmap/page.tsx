'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Layers,
  BookOpen,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/context/LanguageContext';
import { CareerRoadmapExplorer } from '@/components/roadmap/CareerRoadmapExplorer';

export default function CareerRoadmapPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-indigo-500/30 selection:text-[var(--color-text-primary)]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[var(--color-surface)]/85 backdrop-blur-md border-b border-[var(--color-border-subtle)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Back Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer mr-1"
              title={isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-[var(--font-heading)] text-base font-bold text-[var(--color-text-primary)]">
                  {isHindi ? 'करियर ' : 'Career'}
                  <span className="text-gradient">{isHindi ? 'मार्गदर्शक' : 'Discovery'}</span>
                </span>
                <span className="hidden md:inline text-xs text-[var(--color-text-muted)] font-normal ml-2">
                  | {isHindi ? 'करियर रोडमैप एवं स्ट्रीम गाइड' : 'Pathways & Stream Roadmap'}
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/student"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isHindi ? 'विद्यार्थी पोर्टल' : 'Student Portal'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Roadmap Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Hero Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isHindi
                ? '10वीं कक्षा के बाद की संपूर्ण शैक्षणिक दिशा'
                : 'Complete Post-10th & 12th Educational Journey'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[var(--font-heading)] font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
            {isHindi ? (
              <>
                10वीं के बाद <span className="text-gradient">करियर रोडमैप</span> एवं स्ट्रीम गाइड
              </>
            ) : (
              <>
                After 10th Class <span className="text-gradient">Career Roadmap</span> & Pathways
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {isHindi
              ? 'इंटरमीडिएट (एमपीसी, बायपीसी, एमईसी, सीईसी, एचईसी), पॉलिटेक्निक डिप्लोमा, आईटीआई शिल्पकार ट्रेड्स, पैरामेडिकल स्वास्थ्य तकनीक, व्यावसायिक पाठ्यक्रम और रक्षा सेवाओं का संपूर्ण, निष्पक्ष एवं मानक विवरण।'
              : 'Explore all standard options across Intermediate (+2), 3-Year Polytechnic Diplomas, ITI Craftsman Trades, Paramedical Healthcare Technologies, Vocational Streams, and Defense Commission opportunities.'}
          </p>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-bold text-[var(--color-text-primary)]">6+</span>
              <span>{isHindi ? 'प्रमुख शैक्षणिक धाराएं' : 'Primary Streams'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-[var(--color-text-primary)]">50+</span>
              <span>{isHindi ? 'पाठ्यक्रम व ट्रेड' : 'Courses & Trades'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-bold text-[var(--color-text-primary)]">100+</span>
              <span>{isHindi ? 'करियर एवं रोजगार' : 'Career Outcomes'}</span>
            </div>
          </div>
        </div>

        {/* Master Career Roadmap Explorer Component */}
        <CareerRoadmapExplorer />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-8 mt-16 bg-[var(--color-surface)] text-center text-xs text-[var(--color-text-muted)]">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            {isHindi
              ? 'विद्यार्थी करियर मार्गदर्शक — 10वीं व 12वीं के छात्रों के उज्ज्वल भविष्य हेतु एक व्यापक पहल'
              : 'Career Discovery Platform — Empowering students with unbiased, universal career guidance'}
          </p>
        </div>
      </footer>
    </div>
  );
}
