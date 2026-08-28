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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      {/* Header / Category */}
      <div className="flex items-center gap-3">
        {question.icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {question.icon}
          </div>
        )}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            {question.category.replace('_', ' ')}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Render input by question type */}
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
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-4 rounded-2xl border text-center font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-violet-600 to-indigo-600 text-white border-violet-600 shadow-lg shadow-violet-200 dark:shadow-none scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'conditional' && (
          <div className="space-y-4">
            <RadioGroup
              options={question.options}
              selectedValue={typeof value === 'string' ? value : null}
              onChange={onChange}
              colorTheme="violet"
            />

            {question.followUp && value === question.followUp.triggerValue && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fadeIn">
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
