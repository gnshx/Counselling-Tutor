'use client';

import React from 'react';
import { AssessmentQuestion } from '@/lib/data/assessment';
import { ProgressBar } from '../ui/ProgressBar';
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
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 border border-purple-100 dark:border-purple-950/60 shadow-2xl shadow-purple-100/50 dark:shadow-none max-w-2xl mx-auto space-y-8 transition-all">
      {/* Encouraging Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 dark:from-purple-950 dark:via-pink-950 dark:to-amber-950 border border-purple-200/60 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>BRAIN & LIFE CHALLENGE</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          Discover your problem-solving superpowers! There are no scary questions here.
        </p>
      </div>

      {/* Challenge Number & Category */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="text-sm font-black text-purple-700 dark:text-purple-400">
          Challenge {questionNumber} / {totalQuestions}
        </span>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {question.categoryLabel}
        </span>
      </div>

      {/* Question Content with Spacing */}
      <div className="text-center space-y-4 py-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
          {mainQuestion}
        </h2>
        {subContent && (
          <div className="inline-block bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-6 py-4 text-xl sm:text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 shadow-inner">
            {subContent}
          </div>
        )}
        {question.hint && (
          <p className="text-sm italic text-slate-500 dark:text-slate-400">{question.hint}</p>
        )}
      </div>

      {/* 2x2 Grid of Large Touch Buttons with Generous Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelectAnswer(option)}
              className={`p-5 sm:p-6 rounded-2xl border text-center font-bold text-base sm:text-lg transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white border-purple-600 shadow-xl shadow-purple-200 dark:shadow-none scale-[1.03] ring-2 ring-purple-400'
                  : 'bg-white/80 dark:bg-slate-900 text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="pt-4">
        <ProgressBar
          current={questionNumber}
          total={totalQuestions}
          showText={false}
          colorTheme="amber"
          height="lg"
        />
      </div>
    </div>
  );
}
