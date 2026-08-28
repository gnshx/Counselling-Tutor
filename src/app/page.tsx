'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Sparkles, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStudentAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('Please enter your 8-character access code');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/student/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim().toUpperCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid code');
        setIsLoading(false);
        return;
      }

      // Store student session in localStorage
      localStorage.setItem('student_session', JSON.stringify(data.student));
      router.push('/student');
    } catch {
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Career<span className="text-pink-400">Discovery</span>
            </span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Teacher Login</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/80 border border-violet-800/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Student Career Discovery Platform MVP</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Discover Your <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Strengths & Future</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An interactive, friendly journey to explore your interests, strengths, and brain challenges. Created for students, guided by teachers.
        </p>

        {/* Access Code Box for Students */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 mb-2 text-pink-400 font-bold text-sm">
            <KeyRound className="w-4 h-4" />
            <span>STUDENT ACCESS</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2">Have an Access Code?</h2>
          <p className="text-xs text-slate-400 mb-6">Enter the 8-character code provided by your teacher to start your journey.</p>

          <form onSubmit={handleStudentAccess} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={8}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="e.g. 7A9B3F1D"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xl font-black tracking-widest text-amber-300 placeholder:text-slate-600 uppercase focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
              {error && <p className="text-xs text-rose-400 font-semibold mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>{isLoading ? 'Checking Code...' : 'Start My Journey'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Quick info badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-12 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <span className="text-base mb-1 block">🌱</span>
            <strong className="text-slate-200 block text-sm font-bold mb-1">Friendly Questions</strong>
            No right or wrong answers in the questionnaire. Just be yourself!
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <span className="text-base mb-1 block">🧠</span>
            <strong className="text-slate-200 block text-sm font-bold mb-1">Brain & Life Challenge</strong>
            15 fun, simple questions on awareness, numbers & practical choices.
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <span className="text-base mb-1 block">👩‍🏫</span>
            <strong className="text-slate-200 block text-sm font-bold mb-1">Teacher Dashboard</strong>
            Teachers track completion and add observation feedback.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Student Career Discovery Platform MVP • Designed for student data collection
      </footer>
    </div>
  );
}
