'use client';

import React from 'react';
import { QuestionnaireQuestion } from '@/lib/data/questionnaire';
import { MultiSelect } from '../ui/MultiSelect';
import { RadioGroup } from '../ui/RadioGroup';
import { Input } from '../ui/Input';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface QuestionCardProps {
  question: QuestionnaireQuestion;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
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
  const { language } = useLanguage();

  // Determine if selected option has a proof/example prompt
  let selectedOptionProofPrompt: string | null = null;
  if (question.type === 'single-select' && typeof value === 'string') {
    const selectedOpt = question.options.find((opt) => opt.value === value);
    if (language === 'hi') {
      selectedOptionProofPrompt =
        selectedOpt?.proofPromptHi ||
        question.proofPromptHi ||
        selectedOpt?.proofPrompt ||
        question.proofPrompt ||
        null;
    } else {
      selectedOptionProofPrompt =
        selectedOpt?.proofPrompt ||
        question.proofPrompt ||
        null;
    }
  }

  const categoryLabel =
    language === 'hi' && question.categoryHi
      ? question.categoryHi
      : question.category.replace(/_/g, ' ');

  const questionTitle =
    language === 'hi' && question.questionHi ? question.questionHi : question.question;

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 sm:p-8 border border-[var(--color-border-subtle)] space-y-6 transition-colors text-center max-w-2xl mx-auto">
      
      {/* Header / Category & Question */}
      <div className="flex flex-col items-center gap-3">
        {question.icon && (
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center text-2xl">
            {question.icon}
          </div>
        )}
        <div className="space-y-2">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
          <h2 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)] leading-snug">
            {questionTitle}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            {language === 'hi'
              ? 'यहाँ कोई सही या गलत उत्तर नहीं है। वही चुनें जो आपको सबसे सही लगे।'
              : 'There are no right or wrong answers. Choose what feels most like you.'}
          </p>
        </div>
      </div>

      {/* Render input by question type */}
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
          <div className="space-y-4">
            <RadioGroup
              options={question.options}
              selectedValue={typeof value === 'string' ? value : null}
              onChange={onChange}
              colorTheme="indigo"
            />

            {/* Proof/Example input when selected option asks for proof */}
            {selectedOptionProofPrompt && (
              <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-2.5 mt-2">
                <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{selectedOptionProofPrompt}</span>
                </label>
                <Input
                  value={followUpValue}
                  onChange={(e) => onFollowUpChange && onFollowUpChange(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. 3 दोस्तों के साथ विज्ञान प्रोजेक्ट / अकेले 10 गणित पहेलियाँ हल कीं...'
                      : 'e.g. Science project with 3 friends / Solved 10 math puzzles on my own...'
                  }
                  maxLength={150}
                  required
                />
              </div>
            )}
          </div>
        )}

        {question.type === 'scale' && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {question.options.map((opt) => {
              const isSelected = value === opt.value;
              const displayLabel = language === 'hi' && opt.labelHi ? opt.labelHi : opt.label;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-3.5 rounded-xl border text-center font-medium transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] border-[var(--color-primary)] font-semibold shadow-sm'
                      : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-primary-soft)] hover:border-[var(--color-primary)]/40'
                  } active:scale-[0.98]`}
                >
                  {opt.icon && <span className="text-xl">{opt.icon}</span>}
                  <span className="text-xs font-semibold leading-snug">{displayLabel}</span>
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
              <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-2.5">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>
                    {language === 'hi' && question.followUp.question.questionHi
                      ? question.followUp.question.questionHi
                      : question.followUp.question.question}
                  </span>
                </label>
                <Input
                  value={followUpValue}
                  onChange={(e) => onFollowUpChange && onFollowUpChange(e.target.value)}
                  placeholder={
                    language === 'hi' && question.followUp.question.placeholderHi
                      ? question.followUp.question.placeholderHi
                      : question.followUp.question.placeholder
                  }
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
            placeholder={
              language === 'hi' && question.placeholderHi
                ? question.placeholderHi
                : question.placeholder
            }
            maxLength={question.maxLength}
          />
        )}
      </div>
    </div>
  );
}

