'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GraduationCap, Sparkles, FileQuestion, Brain, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Student<span className="text-pink-400">Portal</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center space-y-6 z-10">
        {/* Welcome Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-3 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, {student.name}!</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Your Career Discovery Journey</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Complete the two quick steps below to help your teacher understand your interests, strengths, and goals.
          </p>
        </div>

        {/* Step 1: Questionnaire Card */}
        <div className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isQuestionnaireDone
            ? 'bg-emerald-950/30 border-emerald-800/60'
            : 'bg-slate-900/80 border-slate-800 hover:border-violet-600/50'
        }`}>
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isQuestionnaireDone ? 'bg-emerald-900 text-emerald-300' : 'bg-violet-950 text-violet-300'
            }`}>
              {isQuestionnaireDone ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <FileQuestion className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Step 1</span>
                <StatusBadge status={student.questionnaireStatus} size="sm" />
              </div>
              <h2 className="text-lg font-bold text-white">Student Questionnaire</h2>
              <p className="text-xs text-slate-400">Share your interests, activities, and career choices (10 questions)</p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {isQuestionnaireDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800">
                Questionnaire Completed ✅
              </span>
            ) : (
              <Link
                href="/student/questionnaire"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-95"
              >
                <span>Start Questionnaire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Step 2: Assessment Card */}
        <div className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isAssessmentDone
            ? 'bg-emerald-950/30 border-emerald-800/60'
            : 'bg-slate-900/80 border-slate-800 hover:border-purple-600/50'
        }`}>
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isAssessmentDone ? 'bg-emerald-900 text-emerald-300' : 'bg-purple-950 text-purple-300'
            }`}>
              {isAssessmentDone ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <Brain className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Step 2</span>
                <StatusBadge status={student.assessmentStatus} size="sm" />
              </div>
              <h2 className="text-lg font-bold text-white">Brain & Life Challenge</h2>
              <p className="text-xs text-slate-400">15 quick fun challenges on general awareness & aptitude</p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {isAssessmentDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800">
                Brain Challenge Completed ✅
              </span>
            ) : (
              <Link
                href="/student/assessment"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 ${
                  isQuestionnaireDone
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>Start Brain Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-600">
        Student Career Discovery Portal • Logged in as {student.name}
      </footer>
    </div>
  );
}
