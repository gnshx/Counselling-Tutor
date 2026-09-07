'use client';

import React from 'react';
import { AssessmentQuestion } from '@/lib/data/assessment';
import { Sparkles, Brain } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

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
  const { language } = useLanguage();

  const qText = language === 'hi' && question.questionHi ? question.questionHi : question.question;
  const parts = qText.split('\n');
  const mainQuestion = parts[0];
  const subContent = parts.slice(1).join('\n');

  const categoryLabel =
    language === 'hi' && question.categoryLabelHi ? question.categoryLabelHi : question.categoryLabel;
  const hint = language === 'hi' && question.hintHi ? question.hintHi : question.hint;

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-9 border border-[var(--color-border-subtle)] max-w-2xl mx-auto space-y-7 transition-colors text-center">
      {/* Header / Encouraging Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'अपनी सोच और क्षमताओं को जानें' : 'Explore How You Think'}</span>
        </div>
        <div className="block">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)] leading-snug">
          {mainQuestion}
        </h2>
        {subContent && (
          <div className="inline-block bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] rounded-xl px-5 py-3 text-lg sm:text-xl font-mono font-semibold text-[var(--color-text-primary)]">
            {subContent}
          </div>
        )}
        {hint && (
          <p className="text-xs italic text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>

      {/* 2x2 Grid of Touch Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {question.options.map((option, index) => {
          const isSelected =
            selectedAnswer === option ||
            (question.optionsHi && selectedAnswer === question.optionsHi[index]);
          const label = String.fromCharCode(65 + index); // A, B, C, D
          const displayOption =
            language === 'hi' && question.optionsHi?.[index] ? question.optionsHi[index] : option;

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelectAnswer(option)}
              className={`p-4 sm:p-5 rounded-xl border text-center font-medium text-sm sm:text-base transition-all cursor-pointer flex items-center justify-start gap-3.5 ${
                isSelected
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] border-[var(--color-primary)] font-semibold shadow-xs'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-primary-soft)] hover:border-[var(--color-primary)]/40'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {label}
              </span>
              <span className="leading-relaxed text-left">{displayOption}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
