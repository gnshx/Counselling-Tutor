import React from 'react';
import { Users, FileQuestion, Brain, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      icon: <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60',
    },
    {
      label: 'Discovery Done',
      value: `${questionnaireCompleted}/${totalStudents}`,
      icon: <FileQuestion className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
    },
    {
      label: 'Challenge Done',
      value: `${assessmentCompleted}/${totalStudents}`,
      icon: <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
      iconBg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800/60',
    },
    {
      label: 'Pending Review',
      value: pendingFeedback,
      icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
      badge: pendingFeedback > 0 ? 'Action needed' : undefined,
    },
    {
      label: 'Fully Complete',
      value: allCompleted,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider truncate">
              {card.label}
            </span>
            <div className={`p-2 rounded-xl border shrink-0 ${card.iconBg}`}>{card.icon}</div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-2xl sm:text-3xl font-[var(--font-heading)] text-[var(--color-text-primary)] leading-none">
              {card.value}
            </p>
            {card.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                {card.badge}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
