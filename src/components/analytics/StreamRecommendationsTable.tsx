'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Search, Compass, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface RosterStudentItem {
  serial: number;
  id: string;
  name: string;
  classGrade: string;
  accessCode: string;
  school: string;
  topPassions: string[];
  dreamCareer: string;
  score: number | null;
  totalQuestions: number;
  scorePercent: number | null;
  recommendedStream: string;
  recommendedPathway: string;
  guidanceNote: string;
  feedbackStatus: string;
}

interface StreamRecommendationsTableProps {
  roster: RosterStudentItem[];
}

export function StreamRecommendationsTable({ roster }: StreamRecommendationsTableProps) {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');

  if (!roster || roster.length === 0) {
    return null;
  }

  // Extract unique streams for filter
  const streamOptions = [
    'All',
    'Science-PCM',
    'Science-PCB',
    'Agricultural Sciences',
    'Polytechnic',
    'Commerce',
    'Humanities',
  ];

  const filtered = roster.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.accessCode.toLowerCase().includes(search.toLowerCase()) ||
      s.dreamCareer.toLowerCase().includes(search.toLowerCase()) ||
      s.recommendedStream.toLowerCase().includes(search.toLowerCase());

    const matchesStream =
      streamFilter === 'All' || s.recommendedStream.toLowerCase().includes(streamFilter.toLowerCase());

    return matchesSearch && matchesStream;
  });

  const getScoreBadge = (score: number | null, total: number) => {
    if (score === null) return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
    const isFlawless = score === 15;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
          isFlawless
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
        }`}
      >
        {score} / {total}
        <span className="text-[10px] font-normal opacity-80">({Math.round((score / total) * 100)}%)</span>
      </span>
    );
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
              <Compass className="w-3 h-3" />
              {language === 'hi' ? 'संकाय अनुशंसा' : 'Stream Alignment'}
            </span>
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {language === 'hi'
                ? 'व्यक्तिगत करियर एवं संकाय (Stream) मार्गदर्शन तालिका'
                : 'Individualized Academic Stream & Career Counseling Matrix'}
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {language === 'hi'
              ? 'रुचियों, तार्किक क्षमता (Part II स्कोर) और प्रोजेक्ट्स के आधार पर अनुशंसित 11वीं संकाय (PCM, PCB, कृषि, कॉमर्स, पॉलिटेक्निक)'
              : 'Synthesized high school stream trajectories based on empirical projects, cognitive logic, and expressed dream roles'}
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] self-start sm:self-auto">
          {filtered.length} / {roster.length} {language === 'hi' ? 'विद्यार्थी' : 'students'}
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {streamOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setStreamFilter(opt)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                streamFilter === opt
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {opt === 'All' ? (language === 'hi' ? 'सभी संकाय' : 'All Streams') : opt}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'नाम या कोड खोजें...' : 'Search student or code...'}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 w-10">#</th>
              <th className="py-3 px-3">{language === 'hi' ? 'विद्यार्थी का नाम' : 'Student'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'कक्षा' : 'Class'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'सपनों का करियर' : 'Stated Dream / Aim'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'अभिरुचि स्कोर' : 'Aptitude Score'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'अनुशंसित संकाय' : 'Recommended Stream & Pathway'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'परामर्श नोट' : 'Counseling Note'}</th>
              <th className="py-3 px-3 text-right">{language === 'hi' ? 'कार्य' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-[var(--color-surface-soft)]/50 transition-colors group"
              >
                <td className="py-3 px-3 font-semibold text-[var(--color-text-muted)] text-[11px]">
                  {student.serial}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-[var(--color-text-primary)]">
                    {student.name}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
                    {student.accessCode}
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap text-[var(--color-text-secondary)]">
                  Grade {student.classGrade}
                </td>
                <td className="py-3 px-3 max-w-[160px]">
                  <span className="font-medium text-[var(--color-text-primary)] italic">
                    {student.dreamCareer}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {getScoreBadge(student.score, student.totalQuestions)}
                </td>
                <td className="py-3 px-3 min-w-[180px]">
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {student.recommendedStream}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-secondary)]">
                    {student.recommendedPathway}
                  </div>
                </td>
                <td className="py-3 px-3 max-w-[260px] text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  {student.guidanceNote}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-soft)] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 font-semibold transition-colors border border-[var(--color-border-subtle)]"
                  >
                    <span>{language === 'hi' ? 'देखें' : 'View'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
