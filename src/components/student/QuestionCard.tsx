'use client';

import React from 'react';
import { QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { MultiSelect } from '../ui/MultiSelect';
import { RadioGroup } from '../ui/RadioGroup';
import { Input } from '../ui/Input';

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
    <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-10 border border-[var(--color-border-subtle)] shadow-2xs space-y-8 transition-colors text-center">
      
      {/* Header / Category & Question */}
      <div className="flex flex-col items-center gap-3">
        {question.icon && (
          <div className="text-3xl mb-1">
            {question.icon}
          </div>
        )}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {question.category.replace('_', ' ')}
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Render input by question type with generous spacing */}
      <div className="pt-2 max-w-xl mx-auto text-left">
        {question.type === 'multi-select' && (
          <MultiSelect
            options={question.options}
            selectedValues={Array.isArray(value) ? value : []}
            onChange={onChange}
            maxSelections={question.maxSelections}
            colorTheme="indigo"
          />
        )}

        {question.type === 'single-select' && (
          <RadioGroup
            options={question.options}
            selectedValue={typeof value === 'string' ? value : null}
            onChange={onChange}
            colorTheme="indigo"
          />
        )}

        {question.type === 'scale' && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-4 rounded-xl border text-center font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/40 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                  } active:scale-[0.99]`}
                >
                  <span className="text-sm font-semibold leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'conditional' && (
          <div className="space-y-5">
            <RadioGroup
              options={question.options}
              selectedValue={typeof value === 'string' ? value : null}
              onChange={onChange}
              colorTheme="indigo"
            />

            {question.followUp && value === question.followUp.triggerValue && (
              <div className="pt-5 border-t border-[var(--color-border-subtle)] space-y-3">
                <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
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
