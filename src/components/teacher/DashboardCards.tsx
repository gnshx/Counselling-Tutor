import React from 'react';
import { Users, FileQuestion, Brain, Clock, CheckCircle2 } from 'lucide-react';

interface StatsProps {
  totalStudents: number;
  questionnaireCompleted: number;
  assessmentCompleted: number;
  pendingFeedback: number;
  allCompleted: number;
}

export function DashboardCards({
  totalStudents,
  questionnaireCompleted,
  assessmentCompleted,
  pendingFeedback,
  allCompleted,
}: StatsProps) {
  const cards = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: <Users className="w-5 h-5 text-[var(--color-primary)]" />,
      bg: 'bg-[var(--color-primary-soft)] border-[var(--color-primary)]/20',
    },
    {
      label: 'Discovery Done',
      value: `${questionnaireCompleted}/${totalStudents}`,
      icon: <FileQuestion className="w-5 h-5 text-[var(--color-success)]" />,
      bg: 'bg-[var(--color-success-soft)] border-[var(--color-success)]/20',
    },
    {
      label: 'Challenge Done',
      value: `${assessmentCompleted}/${totalStudents}`,
      icon: <Brain className="w-5 h-5 text-[var(--color-cyan)]" />,
      bg: 'bg-[var(--color-cyan-soft)] border-[var(--color-cyan)]/20',
    },
    {
      label: 'Pending Feedback',
      value: pendingFeedback,
      icon: <Clock className="w-5 h-5 text-[var(--color-warm)]" />,
      bg: 'bg-[var(--color-warm-soft)] border-[var(--color-warm)]/20',
      highlight: pendingFeedback > 0,
    },
    {
      label: 'Fully Complete',
      value: allCompleted,
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />,
      bg: 'bg-[var(--color-surface)] border-[var(--color-border-subtle)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-[1.5rem] border shadow-sm transition-all flex flex-col justify-between h-32 ${card.bg} ${
            card.highlight ? 'ring-2 ring-[var(--color-warm)]' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{card.label}</span>
            <div className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm shrink-0">{card.icon}</div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
