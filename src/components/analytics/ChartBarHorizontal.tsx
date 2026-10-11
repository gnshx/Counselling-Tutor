'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';

export interface HorizontalBarDataPoint {
  id: string;
  label: string;
  labelHi?: string;
  count: number;
  percent: number;
  color?: string;
}

interface ChartBarHorizontalProps {
  title: string;
  subtitle?: string;
  figureNumber?: string;
  data: HorizontalBarDataPoint[];
  barColor?: string;
  totalCohort?: number;
}

export function ChartBarHorizontal({
  title,
  subtitle,
  figureNumber,
  data,
  barColor = '#059669',
  totalCohort,
}: ChartBarHorizontalProps) {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 text-center text-xs text-[var(--color-text-muted)]">
        {language === 'hi' ? 'कोई डेटा उपलब्ध नहीं है' : 'No data available'}
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-7 shadow-xs transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            {figureNumber && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase">
                {figureNumber}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] font-medium self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-[var(--color-surface-soft)]">
          {totalCohort
            ? `${language === 'hi' ? 'कुल विद्यार्थी' : 'Cohort'}: ${totalCohort}`
            : ''}
        </div>
      </div>

      {/* Horizontal Bars List */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = Math.max(Math.round((item.count / maxCount) * 100), 6);
          const isHovered = hoveredId === item.id;
          const activeColor = item.color || barColor;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isHovered
                  ? 'bg-[var(--color-surface-soft)] shadow-xs scale-[1.005]'
                  : 'hover:bg-[var(--color-surface-soft)]/60'
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between gap-3 text-xs mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                      index < 3
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)] truncate text-xs sm:text-sm">
                    {language === 'hi' && item.labelHi ? item.labelHi : item.label}
                  </span>
                  {language === 'hi' && item.labelHi && item.label && (
                    <span className="hidden md:inline text-xs text-[var(--color-text-muted)] truncate">
                      ({item.label})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-bold text-[var(--color-text-primary)] text-xs sm:text-sm">
                    {item.count}{' '}
                    <span className="text-[10px] font-normal text-[var(--color-text-muted)]">
                      {language === 'hi' ? 'छात्र' : 'students'}
                    </span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)]">
                    {item.percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-3 bg-[var(--color-surface-soft)] rounded-full overflow-hidden p-0.5 border border-[var(--color-border-subtle)]/60">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: activeColor,
                    opacity: hoveredId !== null && !isHovered ? 0.6 : 1,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
