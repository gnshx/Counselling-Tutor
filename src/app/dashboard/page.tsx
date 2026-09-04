'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/teacher/Header';
import { DashboardCards } from '@/components/teacher/DashboardCards';
import { StudentTable, StudentListItem } from '@/components/teacher/StudentTable';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      <Header
        teacherName={teacher?.name || 'Educator'}
        schoolName={teacher?.school || 'School Dashboard'}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] shadow-xs transition-colors">
          <div>
            <h1 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
              Welcome, {teacher?.name || 'Educator'}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Track student discovery progress, review responses, and submit educator observations.
            </p>
          </div>

          <Link
            href="/dashboard/students/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
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
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border-subtle)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Class Filter */}
            <div className="relative w-full sm:w-36">
              <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3.5 top-3.5" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
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
              className="p-2.5 rounded-xl border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              Showing {students.length} student{students.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Student Table */}
        {isLoading ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-12 text-center text-[var(--color-text-secondary)]">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium">Loading student data...</p>
          </div>
        ) : (
          <StudentTable students={students} />
        )}
      </main>
    </div>
  );
}
