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

  const getStreamBadge = (stream: string) => {
    const s = stream.toLowerCase();
    if (s.includes('pcm') || s.includes('math')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    if (s.includes('pcb') || s.includes('bio') || s.includes('medical')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (s.includes('agri') || s.includes('tech') || s.includes('krishi')) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    if (s.includes('commerce') || s.includes('business')) {
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
    if (s.includes('polytechnic') || s.includes('diploma')) {
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    }
    return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {language === 'hi' ? 'संकाय अनुशंसा' : 'Stream Alignment'}
            </span>
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {language === 'hi'
                ? 'व्यक्तिगत करियर एवं संकाय (Stream) मार्गदर्शन तालिका'
                : 'Individualized Academic Stream & Career Counseling Matrix'}
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            {language === 'hi'
              ? 'रुचियों, तार्किक क्षमता (Part II स्कोर) और प्रोजेक्ट्स के आधार पर अनुशंसित 11वीं संकाय (PCM, PCB, कृषि, कॉमर्स, पॉलिटेक्निक)'
              : 'Synthesized high school stream trajectories based on empirical projects, cognitive logic, and expressed dream roles'}
          </p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] self-start sm:self-auto shrink-0">
          {filtered.length} / {roster.length} {language === 'hi' ? 'विद्यार्थी' : 'students'}
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Stream Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {streamOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setStreamFilter(opt)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                streamFilter === opt
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {opt === 'All' ? (language === 'hi' ? 'सभी संकाय' : 'All Streams') : opt}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'नाम या कोड खोजें...' : 'Search student or code...'}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 w-12">#</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'विद्यार्थी का नाम' : 'Student'}</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'कक्षा' : 'Class'}</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'सपनों का करियर' : 'Stated Dream / Aim'}</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'अभिरुचि स्कोर' : 'Aptitude Score'}</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'अनुशंसित संकाय' : 'Recommended Stream & Pathway'}</th>
              <th className="py-3.5 px-4">{language === 'hi' ? 'परामर्श नोट' : 'Counseling Note'}</th>
              <th className="py-3.5 px-4 text-right">{language === 'hi' ? 'कार्य' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filtered.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-[var(--color-surface-soft)]/60 transition-colors group"
              >
                <td className="py-4 px-4 font-semibold text-[var(--color-text-muted)] text-xs">
                  {student.serial}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-[var(--color-text-primary)] text-xs sm:text-sm">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
                    {student.accessCode}
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-[var(--color-text-secondary)] font-medium">
                  Grade {student.classGrade}
                </td>
                <td className="py-4 px-4 max-w-[170px]">
                  <span className="font-medium text-[var(--color-text-primary)] italic">
                    {student.dreamCareer}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {getScoreBadge(student.score, student.totalQuestions)}
                </td>
                <td className="py-4 px-4 min-w-[200px]">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStreamBadge(student.recommendedStream)} mb-1`}>
                    {student.recommendedStream}
                  </span>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {student.recommendedPathway}
                  </div>
                </td>
                <td className="py-4 px-4 max-w-[280px] text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {student.guidanceNote}
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-soft)] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 font-semibold transition-colors border border-[var(--color-border-subtle)] text-xs"
                  >
                    <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
