'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';

export interface BarDataPoint {
  id: string;
  label: string;
  labelHi?: string;
  count: number;
  percent: number;
  color?: string;
}

interface ChartBarVerticalProps {
  title: string;
  subtitle?: string;
  figureNumber?: string;
  data: BarDataPoint[];
  totalCohort?: number;
}

export function ChartBarVertical({
  title,
  subtitle,
  figureNumber,
  data,
  totalCohort,
}: ChartBarVerticalProps) {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'count' | 'percent'>('count');

  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-8 text-center text-xs text-[var(--color-text-muted)]">
        {language === 'hi' ? 'कोई डेटा उपलब्ध नहीं है' : 'No data available'}
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => (viewMode === 'count' ? d.count : d.percent)), 1);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs transition-all space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            {figureNumber && (
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase">
                {figureNumber}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('count')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'count'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {language === 'hi' ? 'संख्या (Count)' : 'Count'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('percent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'percent'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {language === 'hi' ? 'प्रतिशत (%)' : 'Percent (%)'}
          </button>
        </div>
      </div>

      {/* Vertical Bars Visualization Container */}
      <div className="relative pt-6 pb-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-x-0 top-6 bottom-16 flex flex-col justify-between pointer-events-none opacity-25">
          <div className="border-b border-[var(--color-border-subtle)] w-full" />
          <div className="border-b border-[var(--color-border-subtle)] w-full" />
          <div className="border-b border-[var(--color-border-subtle)] w-full" />
        </div>

        {/* Bars Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 items-end h-68 sm:h-76">
          {data.map((item, idx) => {
            const currentVal = viewMode === 'count' ? item.count : item.percent;
            const heightPercent = Math.max(Math.round((currentVal / maxVal) * 100), 8);
            const isHovered = hoveredIndex === idx;
            const barBg = item.color || '#4f46e5';

            return (
              <div
                key={item.id}
                className="flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 px-3.5 py-2 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] shadow-xl text-center whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-xs font-bold text-[var(--color-text-primary)]">
                      {item.count} {language === 'hi' ? 'विद्यार्थी' : 'students'} ({item.percent}%)
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[160px] mt-0.5">
                      {language === 'hi' && item.labelHi ? item.labelHi : item.label}
                    </div>
                  </div>
                )}

                {/* Value on top of bar */}
                <div
                  className={`text-xs font-bold mb-2 transition-transform ${
                    isHovered
                      ? 'text-indigo-600 dark:text-indigo-400 scale-110'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {viewMode === 'count' ? item.count : `${item.percent}%`}
                </div>

                {/* Animated Bar with clean track */}
                <div className="w-full max-w-[44px] sm:max-w-[50px] bg-[var(--color-surface-soft)] rounded-xl overflow-hidden flex items-end h-full p-1 border border-[var(--color-border-subtle)]">
                  <div
                    className="w-full rounded-lg transition-all duration-500 ease-out relative shadow-sm"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: barBg,
                      opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1,
                      transform: isHovered ? 'scaleY(1.02)' : 'none',
                      transformOrigin: 'bottom',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20 rounded-lg pointer-events-none" />
                  </div>
                </div>

                {/* X-Axis Label */}
                <div className="mt-3 text-center w-full px-1">
                  <p
                    className={`text-[11px] leading-snug font-medium transition-colors line-clamp-2 ${
                      isHovered
                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                    title={language === 'hi' && item.labelHi ? item.labelHi : item.label}
                  >
                    {language === 'hi' && item.labelHi ? item.labelHi : item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>
          {language === 'hi'
            ? `कुल विद्यार्थी: ${totalCohort || data.reduce((a, b) => Math.max(a, b.count), 0)} (बहु-विकल्प चयन)`
            : `Cohort N = ${totalCohort || data.reduce((a, b) => Math.max(a, b.count), 0)} (Multi-Select Distribution)`}
        </span>
        <span className="font-medium">
          {language === 'hi' ? 'उच्चतम आवृत्ति अनुसार क्रमबद्ध' : 'Ranked by frequency'}
        </span>
      </div>
    </div>
  );
}
