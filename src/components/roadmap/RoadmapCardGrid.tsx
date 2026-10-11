'use client';

import React from 'react';
import {
  Clock,
  Award,
  Briefcase,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerStreamOption } from '@/lib/data/career-roadmap-data';
import { useLanguage } from '@/lib/context/LanguageContext';

interface RoadmapCardGridProps {
  items: CareerStreamOption[];
  onSelectItem: (item: CareerStreamOption) => void;
}

export function RoadmapCardGrid({ items, onSelectItem }: RoadmapCardGridProps) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  if (items.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
        <Sparkles className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
        <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
          {isHindi ? 'कोई करियर मार्ग नहीं मिला' : 'No matching career pathways found'}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          {isHindi ? 'कृपया अपनी खोज या फ़िल्टर बदलकर पुनः प्रयास करें।' : 'Try adjusting your search keywords or stream filters.'}
        </p>
      </div>
    );
  }

  const colorStyles: Record<string, { border: string; pill: string; hover: string }> = {
    indigo: {
      border: 'hover:border-indigo-500/50',
      pill: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
      hover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
      hover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
      hover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      pill: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50',
      hover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    },
    violet: {
      border: 'hover:border-violet-500/50',
      pill: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50',
      hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      pill: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
      hover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => {
        const style = colorStyles[item.badgeColor] || colorStyles.indigo;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectItem(item)}
            className={`rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] ${style.border} p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`}
          >
            <div>
              {/* Badge & Duration Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.pill}`}>
                  {item.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)] font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{isHindi ? item.durationHi : item.duration}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className={`font-[var(--font-heading)] font-bold text-base sm:text-lg text-[var(--color-text-primary)] ${style.hover} transition-colors mb-2 leading-snug`}>
                {isHindi ? item.nameHi : item.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 mb-5">
                {isHindi ? item.shortDescHi : item.shortDesc}
              </p>

              {/* Subjects / Highlights Section */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isHindi ? 'मुख्य विषय / ट्रेड' : 'Core Focus / Trades'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(isHindi ? item.subjectsOrTradesHi : item.subjectsOrTrades).slice(0, 3).map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium"
                    >
                      {sub.split('(')[0].trim()}
                    </span>
                  ))}
                  {item.subjectsOrTrades.length > 3 && (
                    <span className="text-[10px] text-[var(--color-text-muted)] font-medium self-center">
                      +{item.subjectsOrTrades.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Entrance Exams */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-violet-500" />
                  <span>{isHindi ? 'प्रवेश परीक्षाएं' : 'Top Entrance Exams'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.keyEntranceExams.slice(0, 3).map((exam, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]"
                    >
                      {exam.split('(')[0].trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Outcomes Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{isHindi ? 'भविष्य के रोजगार' : 'Key Roles'}</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2">
                  {(isHindi ? item.careerRolesHi : item.careerRoles).slice(0, 3).join(', ')}
                </p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 mt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                <span>{isHindi ? 'विस्तृत विवरण देखें' : 'Explore Full Pathway'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
