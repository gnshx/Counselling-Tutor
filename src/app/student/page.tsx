'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GraduationCap, Sparkles, FileQuestion, Brain, ArrowRight, CheckCircle2, LogOut, Sun } from 'lucide-react';

interface StudentSession {
  id: string;
  name: string;
  classGrade: string;
  questionnaireStatus: string;
  assessmentStatus: string;
}

export default function StudentPortalPage() {
  const [student, setStudent] = useState<StudentSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionStr = localStorage.getItem('student_session');
    if (!sessionStr) {
      router.push('/');
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      setStudent(parsed);
    } catch {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('student_session');
    router.push('/');
  };

  if (!student) return null;

  const isQuestionnaireDone = student.questionnaireStatus === 'completed';
  const isAssessmentDone = student.assessmentStatus === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/3 w-[30rem] h-[30rem] bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[30rem] h-[30rem] bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-md shadow-pink-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Student<span className="text-pink-600 dark:text-pink-400">Portal</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center space-y-6 z-10">
        {/* Welcome Header */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-violet-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-10 text-center space-y-3 backdrop-blur-xl shadow-xl shadow-indigo-100/50 dark:shadow-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 text-xs font-black uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Welcome, {student.name}!</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Discover Your Unique <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">Strengths & Future</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            This platform is dedicated to highlighting your positive talents, aspirations, and growth opportunities!
          </p>
        </div>

        {/* Step 1: Questionnaire Card */}
        <div className={`p-6 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isQuestionnaireDone
            ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/60'
            : 'bg-white/90 dark:bg-slate-900/80 border-violet-100 dark:border-slate-800 hover:border-violet-300 shadow-lg shadow-violet-100/40 dark:shadow-none'
        }`}>
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isQuestionnaireDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
            }`}>
              {isQuestionnaireDone ? <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> : <FileQuestion className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider">Step 1</span>
                <StatusBadge status={student.questionnaireStatus} size="sm" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Student Questionnaire</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Explore your passions, talents & aspirations (10 positive questions)</p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {isQuestionnaireDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                Questionnaire Completed ✅
              </span>
            ) : (
              <Link
                href="/student/questionnaire"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-violet-200 dark:shadow-none transition-all active:scale-95"
              >
                <span>Start Questionnaire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Step 2: Assessment Card */}
        <div className={`p-6 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isAssessmentDone
            ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/60'
            : 'bg-white/90 dark:bg-slate-900/80 border-purple-100 dark:border-slate-800 hover:border-purple-300 shadow-lg shadow-purple-100/40 dark:shadow-none'
        }`}>
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isAssessmentDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            }`}>
              {isAssessmentDone ? <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> : <Brain className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Step 2</span>
                <StatusBadge status={student.assessmentStatus} size="sm" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Brain & Life Challenge</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">15 fun challenges on general awareness & aptitude</p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {isAssessmentDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                Brain Challenge Completed ✅
              </span>
            ) : (
              <Link
                href="/student/assessment"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all active:scale-95 ${
                  isQuestionnaireDone
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 shadow-lg shadow-purple-200 dark:shadow-none'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Start Brain Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs font-medium text-slate-500">
        Student Career Discovery • Focus on Strengths & Positive Growth ✨
      </footer>
    </div>
  );
}
