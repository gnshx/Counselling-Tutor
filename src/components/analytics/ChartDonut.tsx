'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';

export interface DonutDataPoint {
  id: string;
  label: string;
  labelHi?: string;
  count: number;
  percent: number;
  color: string;
}

interface ChartDonutProps {
  title: string;
  subtitle?: string;
  figureNumber?: string;
  data: DonutDataPoint[];
  totalCohort?: number;
}

export function ChartDonut({
  title,
  subtitle,
  figureNumber,
  data,
  totalCohort,
}: ChartDonutProps) {
  const { language } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0) || totalCohort || 1;

  // SVG Donut geometry
  const size = 220;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((item, idx) => {
    const previousSum = data.slice(0, idx).reduce((acc, curr) => acc + curr.count, 0);
    const strokeDasharray = `${(item.count / total) * circumference} ${circumference}`;
    const strokeDashoffset = -(previousSum / total) * circumference;
    return {
      ...item,
      idx,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-7 shadow-xs transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            {figureNumber && (
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
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
      </div>

      {/* Content: Chart + Legend */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-3">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {segments.map((item) => {
              const isHovered = hoveredIdx === item.idx;

              return (
                <circle
                  key={item.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    opacity: hoveredIdx !== null && !isHovered ? 0.35 : 1,
                  }}
                  onMouseEnter={() => setHoveredIdx(item.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {hoveredIdx !== null && data[hoveredIdx] ? (
              <>
                <span className="text-3xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] leading-none">
                  {data[hoveredIdx].percent}%
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] mt-1.5 truncate max-w-[120px]">
                  {data[hoveredIdx].count} {language === 'hi' ? 'विद्यार्थी' : 'students'}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] leading-none">
                  {total}
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-muted)] mt-1.5">
                  {language === 'hi' ? 'कुल प्रतिक्रियाएँ' : 'Responses'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-3 max-w-md">
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-[var(--color-surface-soft)] border-indigo-500/40 shadow-xs scale-[1.01]'
                    : 'bg-[var(--color-surface)] border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-soft)]/60'
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-md shrink-0 transition-transform shadow-xs"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.2)' : 'none',
                    }}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {language === 'hi' && item.labelHi ? item.labelHi : item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                    {item.count}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-soft)] text-xs font-bold text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
                    {item.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
