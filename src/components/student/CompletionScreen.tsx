'use client';

import React from 'react';
import { Sparkles, Trophy, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompletionScreenProps {
  studentName?: string;
  onNextJourney?: () => void;
  nextJourneyTitle?: string;
  isAllCompleted?: boolean;
}

export function CompletionScreen({
  studentName = 'Friend',
  onNextJourney,
  nextJourneyTitle,
  isAllCompleted = false,
}: CompletionScreenProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-pink-100/50 dark:shadow-none text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 flex items-center justify-center text-4xl shadow-xl shadow-pink-200 dark:shadow-none mx-auto animate-bounce">
          🎉
        </div>
        <div className="absolute -top-2 -right-2 p-2 bg-yellow-300 rounded-full text-slate-900 shadow-md">
          <Sparkles className="w-5 h-5 fill-yellow-300" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          Great Job, {studentName}!
        </h2>
        <p className="text-base sm:text-lg font-semibold text-violet-600 dark:text-violet-400">
          You have finished this step of your journey! 🌟
        </p>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
        Thank you for sharing your thoughts, interests, and doing your best on the Brain Challenge. Your responses have been saved safely.
      </p>

      {onNextJourney && nextJourneyTitle ? (
        <button
          onClick={onNextJourney}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-extrabold text-lg shadow-lg shadow-pink-200 dark:shadow-none hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Continue to {nextJourneyTitle}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : isAllCompleted ? (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>All steps completed! You are awesome!</span>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Return to Student Portal Home</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
