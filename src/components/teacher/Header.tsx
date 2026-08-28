'use client';

import React from 'react';
import { LogOut, UserCheck, GraduationCap } from 'lucide-react';

interface HeaderProps {
  teacherName?: string;
  schoolName?: string;
  onLogout?: () => void;
}

export function Header({ teacherName = 'Teacher', schoolName, onLogout }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-inner">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
              Career Discovery <span className="text-indigo-400 font-normal">| Teacher Portal</span>
            </h1>
            {schoolName && <p className="text-xs text-slate-400">{schoolName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Logged in as <strong className="text-white font-semibold">{teacherName}</strong></span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
