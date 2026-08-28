'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TeacherLogin() {
  const [email, setEmail] = useState('teacher@school.com');
  const [password, setPassword] = useState('teacher123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Career<span className="text-indigo-400">Discovery</span>
            </span>
          </Link>

          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white">
            ← Student Access
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Teacher Login</h1>
            <p className="text-xs text-slate-400">Access the Teacher Portal to manage students and feedback</p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-xs text-indigo-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-indigo-300">
              <span>💡 Demo Credentials:</span>
            </p>
            <p>Email: <code className="text-amber-300 font-mono font-bold">teacher@school.com</code></p>
            <p>Password: <code className="text-amber-300 font-mono font-bold">teacher123</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Teacher Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Log In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-600">
        Teacher Portal Access • Secure Authentication
      </footer>
    </div>
  );
}
