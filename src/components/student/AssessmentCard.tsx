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
    <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-12 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] max-w-2xl mx-auto space-y-10 transition-all text-center">
      {/* Encouraging Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-cyan-soft)] text-[var(--color-cyan)] text-sm font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Brain & Life Challenge</span>
        </div>
      </div>

      {/* Challenge Number & Category */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
        <span className="text-sm font-bold text-[var(--color-text-secondary)]">
          {question.categoryLabel}
        </span>
      </div>

      {/* Question Content */}
      <div className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] leading-snug">
          {mainQuestion}
        </h2>
        {subContent && (
          <div className="inline-block bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] rounded-2xl px-6 py-4 text-xl sm:text-2xl font-mono font-bold text-[var(--color-text-primary)] shadow-sm">
            {subContent}
          </div>
        )}
        {question.hint && (
          <p className="text-sm italic text-[var(--color-text-muted)]">{question.hint}</p>
        )}
      </div>

      {/* 2x2 Grid of Large Touch Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const label = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelectAnswer(option)}
              className={`p-5 sm:p-6 rounded-2xl border text-center font-bold text-base sm:text-lg transition-all cursor-pointer flex items-center justify-center gap-4 ${
                isSelected
                  ? 'bg-[var(--color-cyan-soft)] text-[var(--color-cyan)] border-[var(--color-cyan)] shadow-sm scale-[1.02] ring-2 ring-[var(--color-cyan-soft)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-surface-soft)]'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isSelected 
                  ? 'bg-[#0891b2] text-white border-[#0891b2]' 
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]'
              }`}>
                {label}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
