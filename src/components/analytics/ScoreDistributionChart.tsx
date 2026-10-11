'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Award, Brain, Target, TrendingUp } from 'lucide-react';

export interface ScoreDistributionItem {
  score: number;
  count: number;
  percent: number;
  tier: string;
  color: string;
}

export interface CategoryPerformanceItem {
  category: string;
  label: string;
  labelHi: string;
  totalAnswered: number;
  correctCount: number;
  accuracyPercent: number;
}

interface ScoreDistributionChartProps {
  distribution: ScoreDistributionItem[];
  categoryPerformance: CategoryPerformanceItem[];
  averageScore: number;
  maxScore: number;
  minScore: number;
  totalStudents?: number;
}

export function ScoreDistributionChart({
  distribution,
  categoryPerformance,
  averageScore,
  maxScore,
  minScore,
  totalStudents: _totalStudents,
}: ScoreDistributionChartProps) {
  const { language } = useLanguage();

  const flawlessItem = distribution.find((d) => d.score === 15);
  const flawlessPercent = flawlessItem ? flawlessItem.percent : 0;
  const flawlessCount = flawlessItem ? flawlessItem.count : 0;

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs transition-all space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase">
              Figure 6
            </span>
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {language === 'hi'
                ? 'संज्ञानात्मक एवं अभिरुचि मूल्यांकन स्कोर वितरण (भाग 2)'
                : 'Cognitive & Aptitude Assessment Score Distribution (Part II)'}
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            {language === 'hi'
              ? 'तार्किक चिंतन, सामान्य जागरूकता और व्यावहारिक निर्णय क्षमता (15 वस्तुनिष्ठ प्रश्न)'
              : 'Objective 15-question life skills, logic and situational problem solving evaluation'}
          </p>
        </div>

        {/* Flawless Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto shrink-0 shadow-xs">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            {language === 'hi'
              ? `${flawlessCount} छात्रों ने 100% स्कोर प्राप्त किया`
              : `${flawlessCount} students scored 100% (${flawlessPercent}%)`}
          </span>
        </div>
      </div>

      {/* Top High-Level Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
            <Brain className="w-4 h-4 text-indigo-500" />
            <span>{language === 'hi' ? 'औसत स्कोर' : 'Cohort Average'}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
            {averageScore} <span className="text-xs font-normal text-[var(--color-text-muted)]">/ 15</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {Math.round((averageScore / 15) * 100)}% {language === 'hi' ? 'सटीकता' : 'accuracy'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{language === 'hi' ? 'सर्वोच्च स्कोर' : 'Top Score'}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
            {maxScore} <span className="text-xs font-normal text-[var(--color-text-muted)]">/ 15</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            100% {language === 'hi' ? 'उत्कृष्ट' : 'Flawless logic'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
            <Target className="w-4 h-4 text-blue-500" />
            <span>{language === 'hi' ? 'सफलता दर (>=80%)' : 'High Mastery (>=80%)'}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
            100%
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">
            {language === 'hi' ? 'सभी विद्यार्थी उत्तीर्ण' : 'Zero failing scores'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <span>{language === 'hi' ? 'न्यूनतम स्कोर' : 'Cohort Floor'}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
            {minScore} <span className="text-xs font-normal text-[var(--color-text-muted)]">/ 15</span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
            {Math.round((minScore / 15) * 100)}% {language === 'hi' ? 'मजबूत आधार' : 'Strong baseline'}
          </div>
        </div>
      </div>

      {/* Main Score Distribution Histogram */}
      <div className="space-y-4 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          {language === 'hi' ? 'अंक वितरण हिस्टोग्राम' : 'Score Distribution Breakdown'}
        </h4>

        <div className="space-y-3">
          {distribution.map((item) => {
            const barWidth = Math.max(Math.round((item.count / maxCount) * 100), 8);
            const isFlawless = item.score === 15;

            return (
              <div
                key={item.score}
                className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] transition-all hover:border-indigo-500/30"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <div className="flex items-center gap-2.5 font-semibold text-[var(--color-text-primary)]">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isFlawless
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}
                    >
                      {item.score}
                    </span>
                    <span>
                      {item.score} / 15 ({Math.round((item.score / 15) * 100)}%)
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal hidden sm:inline">
                      • {item.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {item.count}{' '}
                      <span className="text-xs font-normal text-[var(--color-text-muted)]">
                        {language === 'hi' ? 'छात्र' : 'students'}
                      </span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isFlawless
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                      }`}
                    >
                      {item.percent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-[var(--color-surface)] rounded-full overflow-hidden p-0.5 border border-[var(--color-border-subtle)]">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out relative"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.color,
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

      {/* Category Performance Breakdown */}
      {categoryPerformance.length > 0 && (
        <div className="pt-5 border-t border-[var(--color-border-subtle)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            {language === 'hi' ? 'श्रेणीवार सटीकता एवं समझ' : 'Cognitive Domain Accuracy Breakdown'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryPerformance.map((cat) => (
              <div
                key={cat.category}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                    <span>{language === 'hi' ? cat.labelHi : cat.label}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {cat.accuracyPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {cat.correctCount} / {cat.totalAnswered} {language === 'hi' ? 'सही उत्तर' : 'correct answers'}
                  </p>
                </div>

                <div className="w-full h-2.5 bg-[var(--color-surface)] rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${cat.accuracyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
