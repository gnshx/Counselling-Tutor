'use client';

import React from 'react';
import { AssessmentQuestion } from '@/lib/data/assessment';
import { Sparkles } from 'lucide-react';

interface AssessmentCardProps {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isSubmitting?: boolean;
}

export function AssessmentCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isSubmitting = false,
}: AssessmentCardProps) {
  const parts = question.question.split('\n');
  const mainQuestion = parts[0];
  const subContent = parts.slice(1).join('\n');

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-10 border border-[var(--color-border-subtle)] shadow-2xs max-w-2xl mx-auto space-y-8 transition-colors text-center">
      {/* Header / Encouraging Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brain & Life Challenge</span>
        </div>
      </div>

      {/* Challenge Category */}
      <div className="flex items-center justify-center border-b border-[var(--color-border-subtle)] pb-3">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {question.categoryLabel}
        </span>
      </div>

      {/* Question Content */}
      <div className="text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] leading-snug">
          {mainQuestion}
        </h2>
        {subContent && (
          <div className="inline-block bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] rounded-xl px-5 py-3 text-lg sm:text-xl font-mono font-semibold text-[var(--color-text-primary)]">
            {subContent}
          </div>
        )}
        {question.hint && (
          <p className="text-xs italic text-[var(--color-text-muted)]">{question.hint}</p>
        )}
      </div>

      {/* 2x2 Grid of Touch Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const label = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelectAnswer(option)}
              className={`p-4 sm:p-5 rounded-xl border text-center font-medium text-sm sm:text-base transition-all cursor-pointer flex items-center justify-start gap-3.5 ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/40 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-colors ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}>
                {label}
              </span>
              <span className="leading-relaxed text-left">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
