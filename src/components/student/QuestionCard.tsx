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
  // Determine if selected option has a proof/example prompt
  let selectedOptionProofPrompt: string | null = null;
  if (question.type === 'single-select' && typeof value === 'string') {
    const selectedOpt = question.options.find((opt) => opt.value === value);
    if (selectedOpt?.proofPrompt) {
      selectedOptionProofPrompt = selectedOpt.proofPrompt;
    } else if (question.proofPrompt) {
      selectedOptionProofPrompt = question.proofPrompt;
    }
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border-subtle)] shadow-2xs space-y-5 transition-colors text-center max-w-2xl mx-auto">
      
      {/* Header / Category & Question */}
      <div className="flex flex-col items-center gap-1.5">
        {question.icon && (
          <div className="text-2xl sm:text-3xl mb-0.5">
            {question.icon}
          </div>
        )}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-2.5 py-0.5 rounded-full">
            {question.category.replace('_', ' ')}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Render input by question type with compact spacing */}
      <div className="pt-1 w-full mx-auto text-left">
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
          <div className="space-y-3">
            <RadioGroup
              options={question.options}
              selectedValue={typeof value === 'string' ? value : null}
              onChange={onChange}
              colorTheme="indigo"
            />

            {/* Proof/Example input when selected option asks for proof */}
            {selectedOptionProofPrompt && (
              <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-2 mt-2">
                <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{selectedOptionProofPrompt}</span>
                </label>
                <Input
                  value={followUpValue}
                  onChange={(e) => onFollowUpChange && onFollowUpChange(e.target.value)}
                  placeholder="e.g. Science project with 3 friends / Solved 10 math puzzles on my own..."
                  maxLength={150}
                  required
                />
              </div>
            )}
          </div>
        )}

        {question.type === 'scale' && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-3 rounded-xl border text-center font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-blue-500 dark:border-blue-400 font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50/40 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                  } active:scale-[0.99]`}
                >
                  {opt.icon && <span className="text-xl">{opt.icon}</span>}
                  <span className="text-xs font-semibold leading-snug">{opt.label}</span>
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
              colorTheme="indigo"
            />

            {question.followUp && value === question.followUp.triggerValue && (
              <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-2">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{question.followUp.question.question}</span>
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
