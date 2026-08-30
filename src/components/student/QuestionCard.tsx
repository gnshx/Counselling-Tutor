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
    <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 sm:p-12 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] space-y-10 transition-all text-center">
      
      {/* Header / Category & Question */}
      <div className="flex flex-col items-center gap-4">
        {question.icon && (
          <div className="text-4xl mb-2">
            {question.icon}
          </div>
        )}
        <div className="space-y-4">
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {question.category.replace('_', ' ')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Render input by question type with generous spacing */}
      <div className="pt-4 max-w-xl mx-auto text-left">
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
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
      className={`p-4 rounded-xl border text-center font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
        isSelected
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm ring-2 ring-[var(--color-primary-soft)] scale-[1.02]'
          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-soft)]'
      }`}
                >
                  <span className="text-sm font-bold leading-snug">{opt.label}</span>
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
              <div className="pt-6 border-t border-[var(--color-border-subtle)] space-y-4 animate-fadeIn">
                <label className="block text-base font-bold text-[var(--color-text-primary)]">
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
