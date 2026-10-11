'use client';

import React from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerStreamOption } from '@/lib/data/career-roadmap-data';
import { useLanguage } from '@/lib/context/LanguageContext';

interface RoadmapDetailModalProps {
  item: CareerStreamOption | null;
  onClose: () => void;
}

export function RoadmapDetailModal({ item, onClose }: RoadmapDetailModalProps) {
  const { language } = useLanguage();

  if (!item) return null;

  const isHindi = language === 'hi';

  const colorStyles: Record<string, { bg: string; text: string; border: string; pill: string }> = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      pill: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/60',
      pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-800/60',
      pill: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800/60',
      pill: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/60',
      pill: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
    },
  };

  const style = colorStyles[item.badgeColor] || colorStyles.indigo;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-[var(--color-border-subtle)] flex items-start justify-between gap-4 sticky top-0 bg-[var(--color-surface)] z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.pill}`}>
                  {item.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isHindi ? item.durationHi : item.duration}</span>
                </span>
              </div>
              <h2 className="font-[var(--font-heading)] font-bold text-xl sm:text-2xl text-[var(--color-text-primary)]">
                {isHindi ? item.nameHi : item.name}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
                {isHindi ? item.shortDescHi : item.shortDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6 flex-1">
            {/* Eligibility & Summary Alert */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  {isHindi ? 'प्रवेश पात्रता' : 'Eligibility & Prerequisite'}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {isHindi ? item.eligibilityHi : item.eligibility}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subjects / Core Modules */}
              <div className="bg-[var(--color-surface-soft)]/50 rounded-xl p-5 border border-[var(--color-border-subtle)] space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    {isHindi ? 'अध्ययन के विषय / तकनीकी ट्रेड' : 'Key Subjects & Trade Modules'}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(isHindi ? item.subjectsOrTradesHi : item.subjectsOrTrades).map((sub, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Entrance Examinations */}
              <div className="bg-[var(--color-surface-soft)]/50 rounded-xl p-5 border border-[var(--color-border-subtle)] space-y-3">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <Award className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    {isHindi ? 'प्रमुख प्रवेश परीक्षाएं' : 'Top Entrance Examinations'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.keyEntranceExams.map((exam, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] shadow-2xs"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Higher Education Degrees */}
            <div className="bg-[var(--color-surface-soft)]/50 rounded-xl p-5 border border-[var(--color-border-subtle)] space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {isHindi ? 'उच्च शिक्षा एवं डिग्री विकल्प (आगे की पढ़ाई)' : 'Higher Education & Degree Pathways'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(isHindi ? item.higherEducationDegreesHi : item.higherEducationDegrees).map((deg, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{deg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Outcomes & Roles */}
            <div className="bg-[var(--color-surface-soft)]/50 rounded-xl p-5 border border-[var(--color-border-subtle)] space-y-3">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {isHindi ? 'भविष्य के प्रमुख रोजगार एवं पद' : 'Career Destinations & Job Roles'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(isHindi ? item.careerRolesHi : item.careerRoles).map((role, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--color-surface)] border border-cyan-500/20 text-[var(--color-text-primary)] shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span>{role}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Growth & Future Insight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent border border-indigo-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {isHindi ? 'उद्योग परिदृश्य एवं भविष्य' : 'Industry Horizon & Future Outlook'}
                </h4>
                <p className="text-xs text-[var(--color-text-primary)] mt-1 leading-relaxed">
                  {isHindi ? item.growthHighlightsHi : item.growthHighlights}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {isHindi ? 'सार्वभौमिक एवं मानक करियर मार्गदर्शन' : 'Universal standard pathway guidance across boards'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs cursor-pointer"
            >
              {isHindi ? 'बंद करें' : 'Done'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
