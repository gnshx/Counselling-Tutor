'use client';

import React from 'react';
import { QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { MultiSelect } from '../ui/MultiSelect';
import { RadioGroup } from '../ui/RadioGroup';
import { Input } from '../ui/Input';
import { Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionnaireQuestion;
  value: any;
  onChange: (value: any) => void;
  followUpValue?: string;
  onFollowUpChange?: (val: string) => void;
}

export function QuestionCard({
  question,
  value,
  onChange,
  followUpValue = '',
  onFollowUpChange,
}: QuestionCardProps) {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 border border-violet-100 dark:border-violet-950/60 shadow-2xl shadow-indigo-100/50 dark:shadow-none space-y-8 transition-all">
      {/* Positive Encouraging Banner */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-50 via-pink-50 to-amber-50 dark:from-violet-950/50 dark:via-pink-950/50 dark:to-amber-950/50 border border-violet-200/60 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>Positive Possibilities • Express Yourself</span>
      </div>

      {/* Header / Category & Question */}
      <div className="flex items-start gap-4">
        {question.icon && (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100 dark:from-violet-950 dark:via-pink-950 dark:to-amber-950 flex items-center justify-center text-3xl shadow-inner shrink-0 ring-4 ring-white dark:ring-slate-900">
            {question.icon}
          </div>
        )}
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {question.category.replace('_', ' ')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Render input by question type with generous spacing */}
      <div className="pt-2">
        {question.type === 'multi-select' && (
          <MultiSelect
            options={question.options}
            selectedValues={Array.isArray(value) ? value : []}
            onChange={onChange}
            maxSelections={question.maxSelections}
            colorTheme="violet"
          />
        )}

        {question.type === 'single-select' && (
          <RadioGroup
            options={question.options}
            selectedValue={typeof value === 'string' ? value : null}
            onChange={onChange}
            colorTheme="violet"
          />
        )}

        {question.type === 'scale' && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-4 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 text-white border-violet-600 shadow-xl shadow-pink-200 dark:shadow-none scale-[1.04] ring-2 ring-pink-400'
                      : 'bg-white/90 text-slate-800 border-slate-200/90 hover:border-violet-300 hover:bg-violet-50/60 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm font-black leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'conditional' && (
          <div className="space-y-6">
            <RadioGroup
              options={question.options}
              selectedValue={typeof value === 'string' ? value : null}
              onChange={onChange}
              colorTheme="violet"
            />

            {question.followUp && value === question.followUp.triggerValue && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  {question.followUp.question.question}
                </label>
                <Input
                  value={followUpValue}
                  onChange={(e) => onFollowUpChange && onFollowUpChange(e.target.value)}
                  placeholder={question.followUp.question.placeholder}
                  maxLength={question.followUp.question.maxLength}
                  required
                />
              </div>
            )}
          </div>
        )}

        {question.type === 'text' && (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
          />
        )}
      </div>
    </div>
  );
}
