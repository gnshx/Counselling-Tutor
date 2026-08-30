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
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans">
      <Header
        teacherName={teacher?.name || 'Educator'}
        schoolName={teacher?.school || 'School Dashboard'}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-8 rounded-[2rem] border border-[var(--color-border-subtle)] shadow-sm transition-colors">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
              Welcome, {teacher?.name || 'Educator'} 👋
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              Track student discovery progress and add your professional observations.
            </p>
          </div>

          <Link
            href="/dashboard/students/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5" />
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
        <div className="bg-[var(--color-surface)] p-4 rounded-[1.5rem] border border-[var(--color-border-subtle)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            {/* Class Filter */}
            <div className="relative w-full sm:w-40">
              <Filter className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-3.5" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all appearance-none cursor-pointer"
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
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-xs font-bold text-[var(--color-text-muted)]">
              Showing {students.length} student{students.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Student Table */}
        {isLoading ? (
          <div className="bg-[var(--color-surface)] rounded-[1.5rem] border border-[var(--color-border-subtle)] p-12 text-center text-[var(--color-text-secondary)]">
            <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading students...</p>
          </div>
        ) : (
          <StudentTable students={students} />
        )}
      </main>
    </div>
  );
}
