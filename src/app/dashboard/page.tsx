'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/teacher/Header';
import { DashboardCards } from '@/components/teacher/DashboardCards';
import { StudentTable, StudentListItem } from '@/components/teacher/StudentTable';
import { Plus, Search, Filter, RefreshCw, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<{ name: string; school?: string } | null>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const router = useRouter();

  const fetchTeacherAndStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Auth check
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }
      const authData = await authRes.json();
      setTeacher(authData.teacher);

      // Fetch students
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedClass) params.set('class', selectedClass);

      const studentsRes = await fetch(`/api/students?${params.toString()}`);
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }
    } catch {
      console.error('Error fetching dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [router, search, selectedClass]);

  useEffect(() => {
    fetchTeacherAndStudents();
  }, [fetchTeacherAndStudents]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Metrics computation
  const totalStudents = students.length;
  const questionnaireCompleted = students.filter((s) => s.questionnaireStatus === 'completed').length;
  const assessmentCompleted = students.filter((s) => s.assessmentStatus === 'completed').length;
  const pendingFeedback = students.filter(
    (s) => s.questionnaireStatus === 'completed' && s.assessmentStatus === 'completed' && s.feedbackStatus !== 'completed'
  ).length;
  const allCompleted = students.filter(
    (s) => s.questionnaireStatus === 'completed' && s.assessmentStatus === 'completed' && s.feedbackStatus === 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header
        teacherName={teacher?.name || 'Teacher'}
        schoolName={teacher?.school || 'Demo School'}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Good Morning, {teacher?.name || 'Teacher'} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your students&apos; career discovery progress and submit observation feedback.
            </p>
          </div>

          <Link
            href="/dashboard/students/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Student</span>
          </Link>
        </div>

        {/* Top Metrics Cards */}
        <DashboardCards
          totalStudents={totalStudents}
          questionnaireCompleted={questionnaireCompleted}
          assessmentCompleted={assessmentCompleted}
          pendingFeedback={pendingFeedback}
          allCompleted={allCompleted}
        />

        {/* Filters & Search Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Class Filter */}
            <div className="relative w-full sm:w-40">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Classes</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => fetchTeacherAndStudents()}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh student list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing {students.length} student{students.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Student Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading student roster...</p>
          </div>
        ) : (
          <StudentTable students={students} />
        )}
      </main>
    </div>
  );
}
