'use client';

import React from 'react';
import {
  GraduationCap,
  Cpu,
  Wrench,
  HeartPulse,
  Briefcase,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerStreamOption, CAREER_ROADMAP_ITEMS } from '@/lib/data/career-roadmap-data';
import { useLanguage } from '@/lib/context/LanguageContext';

interface RoadmapTreeViewProps {
  onSelectItem: (item: CareerStreamOption) => void;
}

export function RoadmapTreeView({ onSelectItem }: RoadmapTreeViewProps) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const intermediateItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'intermediate');
  const polytechnicItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'polytechnic');
  const itiItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'iti');
  const paramedicalItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'paramedical');
  const vocationalItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'vocational');
  const defenseItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'defense');
  const otherItems = CAREER_ROADMAP_ITEMS.filter((i) => i.category === 'agriculture' || i.category === 'design');

  const branches = [
    {
      id: 'inter',
      title: isHindi ? 'इंटरमीडिएट (10+2)' : 'INTERMEDIATE (+2)',
      subtitle: isHindi ? '2 वर्ष उच्चतर माध्यमिक' : '2 Years Pre-University',
      icon: GraduationCap,
      color: 'indigo',
      borderClass: 'border-indigo-500/30 hover:border-indigo-500',
      badgeBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
      lineClass: 'from-indigo-500/30 via-indigo-500 to-indigo-500/30',
      items: intermediateItems,
    },
    {
      id: 'poly',
      title: isHindi ? 'पॉलिटेक्निक डिप्लोमा' : 'POLYTECHNIC DIPLOMA',
      subtitle: isHindi ? '3 वर्ष तकनीकी इंजीनियरिंग' : '3 Years Technical Engg',
      icon: Cpu,
      color: 'cyan',
      borderClass: 'border-cyan-500/30 hover:border-cyan-500',
      badgeBg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      lineClass: 'from-cyan-500/30 via-cyan-500 to-cyan-500/30',
      items: polytechnicItems,
    },
    {
      id: 'paramedical',
      title: isHindi ? 'पैरामेडिकल डिप्लोमा' : 'PARAMEDICAL DIPLOMA',
      subtitle: isHindi ? '2-3 वर्ष अस्पताल स्वास्थ्य तकनीक' : '2-3 Years Hospital Tech',
      icon: HeartPulse,
      color: 'emerald',
      borderClass: 'border-emerald-500/30 hover:border-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      lineClass: 'from-emerald-500/30 via-emerald-500 to-emerald-500/30',
      items: paramedicalItems,
    },
    {
      id: 'iti',
      title: isHindi ? 'आईटीआई ट्रेड्स' : 'ITI CRAFTSMAN TRADES',
      subtitle: isHindi ? '1-2 वर्ष तकनीकी व गैर-इंजीनियरिंग' : '1-2 Years Skilled Trades',
      icon: Wrench,
      color: 'amber',
      borderClass: 'border-amber-500/30 hover:border-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      lineClass: 'from-amber-500/30 via-amber-500 to-amber-500/30',
      items: itiItems,
    },
    {
      id: 'voc',
      title: isHindi ? 'व्यावसायिक इंटरमीडिएट' : 'VOCATIONAL INTERMEDIATE',
      subtitle: isHindi ? '2 वर्ष जॉब-ओरिएंटेड स्किल्स' : '2 Years Applied Skills',
      icon: Briefcase,
      color: 'violet',
      borderClass: 'border-violet-500/30 hover:border-violet-500',
      badgeBg: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
      lineClass: 'from-violet-500/30 via-violet-500 to-violet-500/30',
      items: vocationalItems,
    },
    {
      id: 'defense',
      title: isHindi ? 'रक्षा एवं वर्दीधारी सेवाएं' : 'DEFENSE & UNIFORMED',
      subtitle: isHindi ? 'सीधा चयन व अधिकारी कमीशन' : 'Direct Entry & Commissions',
      icon: Shield,
      color: 'rose',
      borderClass: 'border-rose-500/30 hover:border-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      lineClass: 'from-rose-500/30 via-rose-500 to-rose-500/30',
      items: defenseItems,
    },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Visual Root Anchor */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative px-8 py-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-500/20 border-2 border-indigo-400/40 inline-flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-200">
              {isHindi ? 'प्रारंभिक प्रस्थान बिंदु' : 'CENTRAL FOUNDATION MILESTONE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-[var(--font-heading)] font-extrabold tracking-tight">
            {isHindi ? '10वीं कक्षा के बाद (AFTER 10TH CLASS)' : 'AFTER 10TH CLASS ROADMAP'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-lg">
            {isHindi
              ? 'सभी 6 प्रमुख मुख्य शैक्षणिक एवं तकनीकी मार्ग — किसी भी विकल्प पर क्लिक करके पूरी जानकारी देखें'
              : 'Choose your destination across 6 principal streams — click any card to inspect full details'}
          </p>

          {/* Connected Trunk Line Downwards */}
          <div className="w-1 h-8 bg-gradient-to-b from-white/80 to-indigo-500 rounded-full mt-4 -mb-9 z-10" />
        </motion.div>

        {/* Horizontal Distribution Rail */}
        <div className="w-full max-w-6xl hidden lg:block h-6 border-b-2 border-l-2 border-r-2 border-indigo-500/30 rounded-b-3xl mt-4" />
      </div>

      {/* Main Flowchart Columns / Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
        {branches.map((branch, branchIdx) => {
          const Icon = branch.icon;
          return (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: branchIdx * 0.08 }}
              className={`rounded-2xl bg-[var(--color-surface)] border ${branch.borderClass} p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-all relative overflow-hidden`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${branch.lineClass}`} />

              {/* Branch Header Node */}
              <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${branch.badgeBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-[var(--font-heading)] font-bold text-sm sm:text-base text-[var(--color-text-primary)] leading-snug">
                    {branch.title}
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    {branch.subtitle}
                  </span>
                </div>
              </div>

              {/* Sub-Courses / Groups List inside this branch */}
              <div className="space-y-3 flex-1">
                {branch.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item)}
                    className="w-full text-left p-3.5 rounded-xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col gap-2 relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {isHindi ? item.nameHi : item.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>

                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {isHindi ? item.shortDescHi : item.shortDesc}
                    </p>

                    {/* Quick Micro-Badges for Exams / Degrees */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.keyEntranceExams.slice(0, 2).map((exam, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]"
                        >
                          {exam.split('(')[0].trim()}
                        </span>
                      ))}
                      {item.keyEntranceExams.length > 2 && (
                        <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                          +{item.keyEntranceExams.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Branch Quick Note */}
              <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>{branch.items.length} {isHindi ? 'विस्तृत विकल्प' : 'core pathways'}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {isHindi ? 'क्लिक कर विवरण देखें' : 'Click to inspect'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Emerging Pathways Row: Agriculture, Design & Media */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-violet-500/10 to-indigo-500/10 border border-[var(--color-border-subtle)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-[var(--font-heading)] font-bold text-base text-[var(--color-text-primary)]">
                {isHindi ? 'अतिरिक्त विशिष्ट मार्ग: कृषि, रचनात्मक डिजाइन एवं मीडिया' : 'Specialized Pathways: AgriTech, Design & Media'}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isHindi
                  ? 'पारंपरिक पाठ्यक्रमों से हटकर आधुनिक तकनीक, जैविक कृषि और रचनात्मक कलाओं के अवसर'
                  : 'Beyond conventional streams: High-growth creative design, smart agriculture, and media opportunities'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {otherItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-indigo-500/40 text-left transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 mb-1.5">
                  {item.badge}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {isHindi ? item.nameHi : item.name}
                </h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                  {isHindi ? item.shortDescHi : item.shortDesc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
