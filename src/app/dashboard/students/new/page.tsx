'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    classGrade: '10',
    school: '',
    parentJob: '',
    familyIncome: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdStudent, setCreatedStudent] = useState<{ name: string; accessCode: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.classGrade) {
      setError('Student name, date of birth, and class/grade are required.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create student');
        setIsLoading(false);
        return;
      }

      setCreatedStudent({
        name: data.student.name,
        accessCode: data.student.accessCode,
      });
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {createdStudent ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800/50 shadow-xl shadow-emerald-50 dark:shadow-none text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Student Created!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Provide this Access Code to <strong>{createdStudent.name}</strong> to begin their journey.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-amber-300 font-mono text-3xl font-black tracking-widest border border-slate-800 flex items-center justify-center gap-3">
              <KeyRound className="w-6 h-6 text-pink-400 shrink-0" />
              <span>{createdStudent.accessCode}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCreatedStudent(null);
                  setFormData({
                    name: '',
                    dob: '',
                    classGrade: '10',
                    school: '',
                    parentJob: '',
                    familyIncome: '',
                  });
                }}
              >
                Add Another Student
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Add New Student</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create a student profile to generate their journey access code</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Student Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Kumar"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />

                <div className="w-full space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Class / Grade <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              <Input
                label="School Name (Optional)"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g. Government Higher Secondary School"
              />

              <Input
                label="Parent / Guardian Job / Occupation"
                value={formData.parentJob}
                onChange={(e) => setFormData({ ...formData, parentJob: e.target.value })}
                placeholder="e.g. Teacher, Farmer, Engineer, Shopkeeper, Private Service..."
              />

              <div className="w-full space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Family Annual Income Range
                </label>
                <select
                  value={formData.familyIncome}
                  onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Income Range (Optional)</option>
                  <option value="Below ₹1 Lakh">Below ₹1 Lakh per year</option>
                  <option value="₹1 Lakh - ₹3 Lakhs">₹1 Lakh - ₹3 Lakhs per year</option>
                  <option value="₹3 Lakhs - ₹6 Lakhs">₹3 Lakhs - ₹6 Lakhs per year</option>
                  <option value="₹6 Lakhs - ₹10 Lakhs">₹6 Lakhs - ₹10 Lakhs per year</option>
                  <option value="Above ₹10 Lakhs">Above ₹10 Lakhs per year</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-1/2"
                  isLoading={isLoading}
                >
                  Create Student
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
