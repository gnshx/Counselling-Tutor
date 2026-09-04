'use client';

import React from 'react';
import { Check, AlertCircle, Circle } from 'lucide-react';

export interface QuestionStatus {
  id: string;
  isAnswered: boolean;
  isIncomplete?: boolean; // Answered option but missing required proof/followup
}

interface QuestionPaletteProps {
  questionsStatus: QuestionStatus[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  title?: string;
}

export function QuestionPalette({
  questionsStatus,
  currentIndex,
  onSelectQuestion,
  title = 'Question Navigation',
}: QuestionPaletteProps) {
  const total = questionsStatus.length;
  const answeredCount = questionsStatus.filter((q) => q.isAnswered).length;
  const incompleteCount = questionsStatus.filter((q) => q.isIncomplete && !q.isAnswered).length;
  const unansweredCount = total - answeredCount - incompleteCount;

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-subtle)] shadow-2xs space-y-3 mb-4">
      {/* Header & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {title}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800">
            {answeredCount} / {total} Answered
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Answered ({answeredCount})</span>
          </div>
          {incompleteCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Needs Proof ({incompleteCount})</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block border border-slate-400 dark:border-slate-600"></span>
            <span>Unanswered ({unansweredCount})</span>
          </div>
        </div>
      </div>

      {/* Number Buttons Grid */}
      <div className="flex flex-wrap gap-2 pt-1">
        {questionsStatus.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = q.isAnswered;
          const isIncomplete = q.isIncomplete && !q.isAnswered;

          let btnStyle = 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-blue-400';
          
          if (isAnswered) {
            btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-700 dark:bg-emerald-500 dark:border-emerald-600 shadow-2xs';
          } else if (isIncomplete) {
            btnStyle = 'bg-amber-500 text-white font-bold border-amber-600 dark:bg-amber-600 shadow-2xs';
          }

          if (isCurrent) {
            btnStyle += ' ring-2 ring-blue-500 ring-offset-2 ring-offset-[var(--color-surface)] font-black scale-105';
          }

          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              title={`Go to Question ${idx + 1}${isAnswered ? ' (Answered)' : isIncomplete ? ' (Needs Proof Example)' : ' (Unanswered)'}`}
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
            >
              <span>{idx + 1}</span>
              {isAnswered && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              {isIncomplete && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[9px] shadow-2xs">
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
