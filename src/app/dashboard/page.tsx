'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/teacher/Header';
import { DashboardCards } from '@/components/teacher/DashboardCards';
import { StudentTable, StudentListItem } from '@/components/teacher/StudentTable';
import { Plus, Search, Filter, RefreshCw, BarChart3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function TeacherDashboard() {
  const { language } = useLanguage();
  const [teacher, setTeacher] = useState<{ name: string; school?: string } | null>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const router = useRouter();

  const fetchTeacherAndStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedClass) params.set('class', selectedClass);

      // Concurrently fetch auth and student list in parallel to eliminate waterfall
      const [authRes, studentsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/students?${params.toString()}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }
      const authData = await authRes.json();
      setTeacher(authData.teacher);

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
        teacherName={teacher?.name || (language === 'hi' ? 'शिक्षक' : 'Educator')}
        schoolName={teacher?.school || (language === 'hi' ? 'विद्यालय डैशबोर्ड' : 'School Dashboard')}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] shadow-xs transition-colors">
          <div>
            <h1 className="text-xl sm:text-2xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
              {language === 'hi'
                ? `स्वागत है, ${teacher?.name || 'शिक्षक'}`
                : `Welcome, ${teacher?.name || 'Educator'}`}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {language === 'hi'
                ? 'विद्यार्थी की खोज प्रगति ट्रैक करें, उत्तरों की समीक्षा करें और शिक्षक अवलोकन दर्ज करें।'
                : 'Track student discovery progress, review responses, and submit educator observations.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/dashboard/students/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'hi' ? 'विद्यार्थी जोड़ें' : 'Add Student'}</span>
            </Link>
          </div>
        </div>

        {/* Cohort Analytics Quick Access Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {language === 'hi' ? 'डेटा विश्लेषण केंद्र' : 'Live Cohort Intelligence'}
              </span>
              <span className="text-xs text-indigo-200">
                {language === 'hi' ? '7 मुख्य चार्ट्स एवं संकाय अनुशंसा' : '7 Publication Figures & Stream Guidance'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-[var(--font-heading)] font-bold text-white">
              {language === 'hi'
                ? 'कक्षा समूह विश्लेषण एवं विज़ुअलाइज़ेशन'
                : 'Cohort Analytics & Visual Charts'}
            </h2>
            <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'लोकल मशीन पर स्क्रिप्ट चलाए बिना, सीधे वेबसाइट पर विषयगत जिज्ञासा, 100% अभिरुचि अंक वितरण, व्यावहारिक नवाचार और 11वीं संकाय मार्गदर्शन देखें।'
                : 'Interactive cohort analytics, cognitive score distributions, empirical innovations, and senior secondary stream recommendations in one clean view.'}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all active:scale-[0.98]"
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>{language === 'hi' ? 'एनालिटिक्स और चार्ट्स देखें' : 'Explore Analytics & Charts'}</span>
            </Link>
          </div>
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
                placeholder={language === 'hi' ? 'विद्यार्थी खोजें...' : 'Search students...'}
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
                <option value="">{language === 'hi' ? 'सभी कक्षाएं' : 'All Classes'}</option>
                <option value="8">{language === 'hi' ? 'कक्षा 8' : 'Class 8'}</option>
                <option value="9">{language === 'hi' ? 'कक्षा 9' : 'Class 9'}</option>
                <option value="10">{language === 'hi' ? 'कक्षा 10' : 'Class 10'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => fetchTeacherAndStudents()}
              className="p-2.5 rounded-xl border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
              title={language === 'hi' ? 'सूची रीफ़्रेश करें' : 'Refresh list'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              {language === 'hi'
                ? `${students.length} विद्यार्थी प्रदर्शित`
                : `Showing ${students.length} student${students.length === 1 ? '' : 's'}`}
            </span>
          </div>
        </div>

        {/* Student Table */}
        {isLoading ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-12 text-center text-[var(--color-text-secondary)]">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium">
              {language === 'hi' ? 'विद्यार्थी डेटा लोड हो रहा है...' : 'Loading student data...'}
            </p>
          </div>
        ) : (
          <StudentTable
            students={students}
            onStudentDeleted={(deletedId) =>
              setStudents((prev) => prev.filter((s) => s.id !== deletedId))
            }
          />
        )}
      </main>
    </div>
  );
}
