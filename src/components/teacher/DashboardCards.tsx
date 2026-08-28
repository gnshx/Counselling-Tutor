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
      icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50',
    },
    {
      label: 'Questionnaire Done',
      value: `${questionnaireCompleted}/${totalStudents}`,
      icon: <FileQuestion className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50',
    },
    {
      label: 'Assessment Done',
      value: `${assessmentCompleted}/${totalStudents}`,
      icon: <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bg: 'bg-purple-50 border-purple-100 dark:bg-purple-950/40 dark:border-purple-900/50',
    },
    {
      label: 'Pending Feedback',
      value: pendingFeedback,
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50',
      highlight: pendingFeedback > 0,
    },
    {
      label: 'Fully Complete',
      value: allCompleted,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      bg: 'bg-teal-50 border-teal-100 dark:bg-teal-950/40 dark:border-teal-900/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border transition-all ${card.bg} ${
            card.highlight ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/50' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{card.label}</span>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-2xs">{card.icon}</div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
