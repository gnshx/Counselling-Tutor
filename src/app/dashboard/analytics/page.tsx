'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  BarChart3,
  FileText,
  Download,
  Printer,
  RefreshCw,
  Filter,
  Users,
  Brain,
  Award,
  Sparkles,
  ArrowLeft,
  Target,
  Compass,
} from 'lucide-react';
import { ChartBarVertical } from '@/components/analytics/ChartBarVertical';
import { ChartBarHorizontal } from '@/components/analytics/ChartBarHorizontal';
import { ChartDonut } from '@/components/analytics/ChartDonut';
import { ScoreDistributionChart } from '@/components/analytics/ScoreDistributionChart';
import { StudentInnovationsShowcase } from '@/components/analytics/StudentInnovationsShowcase';
import { StreamRecommendationsTable } from '@/components/analytics/StreamRecommendationsTable';

export default function CohortAnalyticsPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [teacher, setTeacher] = useState<{ name: string; school?: string } | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('');

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [authRes, dataRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/analytics${selectedClass ? `?class=${selectedClass}` : ''}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }
      const authData = await authRes.json();
      setTeacher(authData.teacher);

      if (dataRes.ok) {
        const data = await dataRes.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router, selectedClass]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const cohort = analyticsData?.cohort || {};
  const charts = analyticsData?.charts || {};
  const innovations = analyticsData?.innovations || [];
  const roster = analyticsData?.roster || [];
  const hasDocxReport = analyticsData?.hasDocxReport;

  // Extract top items for executive tiles
  const topPassion = charts.subjectPassions?.[0]?.label || 'Science & Discovery';
  const topPower = charts.superpowers?.[0]?.label || 'Creative Problem Solving';
  const topCareer = charts.careerTrajectories?.[0]?.label || 'Agriculture & Ecology';

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      <Header
        teacherName={teacher?.name || (language === 'hi' ? 'शिक्षक' : 'Educator')}
        schoolName={teacher?.school || (language === 'hi' ? 'विद्यालय डैशबोर्ड' : 'School Dashboard')}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'विद्यार्थी सूची' : 'Student Roster'}</span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              {language === 'hi' ? 'डेटा विश्लेषण और विज़ुअलाइज़ेशन' : 'Data Analysis & Visualizations'}
            </span>
          </div>

          {/* Action Buttons: Report & Print */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <Link
              href="/dashboard/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'संपूर्ण अकादमिक रिपोर्ट' : 'Full Academic Report'}</span>
            </Link>

            {hasDocxReport && (
              <a
                href="/api/reports/download"
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                title={language === 'hi' ? 'Word रिपोर्ट (.docx) डाउनलोड करें' : 'Download Word Report (.docx)'}
              >
                <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">.docx</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title={language === 'hi' ? 'प्रिंट / PDF के रूप में सहेजें' : 'Print / Save PDF'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Welcome Analytical Header */}
        <div className="bg-[var(--color-surface)] p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {language === 'hi' ? 'अकादमिक अंतर्दृष्टि केंद्र' : 'Cohort Intelligence Center'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {language === 'hi'
                ? `${teacher?.name || 'शिक्षक'} — कक्षा समूह डेटा विश्लेषण एवं रिपोर्ट`
                : `${teacher?.name || 'Educator'} — Class Cohort Analysis & Insights`}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
              {language === 'hi'
                ? 'सभी 7 मुख्य विज़ुअलाइज़ेशन चार्ट्स, संज्ञानात्मक स्कोर वितरण, वास्तविक प्रयोगात्मक नवाचार और व्यक्तिगत 11वीं संकाय (Stream) मार्गदर्शन का लाइव विश्लेषण।'
                : 'Interactive synthesis of academic curiosities, cognitive assessment distributions, student empirical project proofs, and recommended senior secondary streams.'}
            </p>
          </div>

          {/* Class Grade Filter Toolbar */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-3" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">{language === 'hi' ? 'सभी कक्षाएं (All)' : 'All Classes'}</option>
                <option value="8">{language === 'hi' ? 'कक्षा 8 (Class 8)' : 'Class 8'}</option>
                <option value="9">{language === 'hi' ? 'कक्षा 9 (Class 9)' : 'Class 9'}</option>
                <option value="10">{language === 'hi' ? 'कक्षा 10 (Class 10)' : 'Class 10'}</option>
              </select>
            </div>

            <button
              onClick={() => fetchAnalytics()}
              className="p-2 rounded-xl border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
              title={language === 'hi' ? 'रीफ़्रेश करें' : 'Refresh analytics'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-12 text-center text-[var(--color-text-secondary)]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium">
              {language === 'hi' ? 'डेटा विश्लेषण और विज़ुअलाइज़ेशन तैयार हो रहे हैं...' : 'Computing cohort analytics and charts...'}
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Executive KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'hi' ? 'कुल विद्यार्थी' : 'Cohort Size'}</span>
                </div>
                <div className="mt-1.5 text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {cohort.totalStudents || 0}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  100% {language === 'hi' ? 'सक्रिय' : 'Participated'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Brain className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'hi' ? 'औसत अभिरुचि' : 'Cognitive Avg'}</span>
                </div>
                <div className="mt-1.5 text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {cohort.averageScore || 0} <span className="text-xs font-normal text-[var(--color-text-muted)]">/ 15</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  {Math.round(((cohort.averageScore || 0) / 15) * 100)}% {language === 'hi' ? 'स्कोर' : 'Benchmark'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'hi' ? '100% सटीक स्कोर' : 'Flawless 15/15'}</span>
                </div>
                <div className="mt-1.5 text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {cohort.flawlessScoreCount || 0}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  {cohort.highAptitudePercent || 0}% {language === 'hi' ? 'छात्र' : 'of cohort'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'hi' ? 'शीर्ष विषय रुचि' : 'Top Passion'}</span>
                </div>
                <div className="mt-1.5 text-sm font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] truncate">
                  {topPassion}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  {charts.subjectPassions?.[0]?.count || 0} {language === 'hi' ? 'चयन' : 'selections'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Target className="w-3.5 h-3.5 text-violet-500" />
                  <span>{language === 'hi' ? 'प्रमुख शक्ति' : 'Top Superpower'}</span>
                </div>
                <div className="mt-1.5 text-sm font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] truncate">
                  {topPower}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  {charts.superpowers?.[0]?.count || 0} {language === 'hi' ? 'चयन' : 'selections'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                  <Compass className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'hi' ? 'शीर्ष करियर क्षेत्र' : 'Top Trajectory'}</span>
                </div>
                <div className="mt-1.5 text-sm font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] truncate">
                  {topCareer}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  {charts.careerTrajectories?.[0]?.count || 0} {language === 'hi' ? 'चयन' : 'aspirants'}
                </div>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="space-y-6">
              {/* Figure 1: Subject Curiosities & Passions */}
              <ChartBarVertical
                figureNumber="Figure 1"
                title={
                  language === 'hi'
                    ? 'विषयगत जिज्ञासा एवं शैक्षणिक उत्साह (प्रश्न 1)'
                    : 'Academic Curiosities & Subject Enthusiasm (Question 1)'
                }
                subtitle={
                  language === 'hi'
                    ? 'विज्ञान, गणित, तकनीक एवं अन्य विषयों में विद्यार्थियों का स्वाभाविक झुकाव'
                    : 'Direct student indications of academic subjects that spark spontaneous engagement'
                }
                data={charts.subjectPassions || []}
                totalCohort={cohort.totalStudents}
              />

              {/* Row 2: Joyful Activities (Figure 2) & Superpowers (Figure 3) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartBarHorizontal
                  figureNumber="Figure 2"
                  title={
                    language === 'hi'
                      ? 'आनंददायक गतिविधियाँ एवं रुचियाँ (प्रश्न 2)'
                      : 'Fulfilling Activities & Extracurricular Pursuits (Question 2)'
                  }
                  subtitle={
                    language === 'hi'
                      ? 'पहेलियाँ हल करना, प्रकृति का अध्ययन, खेल-कूद और निर्माण कार्य'
                      : 'Self-selected activities where students experience high flow state and fulfillment'
                  }
                  data={charts.joyfulActivities || []}
                  barColor="#059669"
                  totalCohort={cohort.totalStudents}
                />

                <ChartBarHorizontal
                  figureNumber="Figure 3"
                  title={
                    language === 'hi'
                      ? 'विशिष्ट खूबियाँ एवं स्वाभाविक क्षमताएँ (प्रश्न 3)'
                      : 'Natural Strengths & Unique Superpowers (Question 3)'
                  }
                  subtitle={
                    language === 'hi'
                      ? 'समस्या समाधान, नेतृत्व, तकनीकी कौशल और सहानुभूति'
                      : 'Core self-identified competencies and cognitive or interpersonal strengths'
                  }
                  data={charts.superpowers || []}
                  barColor="#7c3aed"
                  totalCohort={cohort.totalStudents}
                />
              </div>

              {/* Row 3: Work Environment (Figure 4) & Career Trajectories (Figure 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartDonut
                  figureNumber="Figure 4"
                  title={
                    language === 'hi'
                      ? 'पसंदीदा कार्य वातावरण एवं टीम सहयोग (प्रश्न 4)'
                      : 'Preferred Work Environment & Collaboration Dynamics (Question 4)'
                  }
                  subtitle={
                    language === 'hi'
                      ? 'समूह कार्य, स्वतंत्र कार्य अथवा दोनों का संतुलित मिश्रण'
                      : 'Workplace modality preference demonstrating social collaboration dynamics'
                  }
                  data={charts.workEnvironment || []}
                  totalCohort={cohort.totalStudents}
                />

                <ChartBarHorizontal
                  figureNumber="Figure 5"
                  title={
                    language === 'hi'
                      ? 'भावी करियर क्षेत्र एवं संभावनाएँ (प्रश्न 6)'
                      : 'Career Trajectories Selected for Further Exploration (Question 6)'
                  }
                  subtitle={
                    language === 'hi'
                      ? 'कृषि, व्यवसाय, तकनीक, इंजीनियरिंग और सामाजिक सेवा'
                      : 'Broad professional disciplines targeted by students for vocational exploration'
                  }
                  data={charts.careerTrajectories || []}
                  barColor="#e11d48"
                  totalCohort={cohort.totalStudents}
                />
              </div>

              {/* Figure 6: Cognitive Aptitude Assessment Distribution */}
              <ScoreDistributionChart
                distribution={charts.scoreDistribution?.distribution || []}
                categoryPerformance={charts.scoreDistribution?.categoryPerformance || []}
                averageScore={cohort.averageScore || 0}
                maxScore={charts.scoreDistribution?.maxScore || 15}
                minScore={charts.scoreDistribution?.minScore || 0}
                totalStudents={cohort.totalStudents || 0}
              />

              {/* Figure 7: Support & Mentorship Needs (Q10) */}
              <ChartBarHorizontal
                figureNumber="Figure 7"
                title={
                  language === 'hi'
                    ? 'विद्यार्थियों द्वारा वांछित मार्गदर्शन एवं विकास अवसर (प्रश्न 10)'
                    : 'Priority Growth Opportunities & Mentorship Desired by Students (Question 10)'
                }
                subtitle={
                  language === 'hi'
                    ? 'कोडिंग तकनीक, उद्योग विशेषज्ञों से सलाह, प्रयोगशाला कार्य और कार्यशालाएं'
                    : 'Targeted institutional supports requested by learners to unlock their highest potential'
                }
                data={charts.growthNeeds || []}
                barColor="#0284c7"
                totalCohort={cohort.totalStudents}
              />

              {/* Teacher Competency Feedback Ratings (if submitted) */}
              {charts.teacherRatings && charts.teacherRatings.length > 0 && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold tracking-wide uppercase">
                      Educator Insights
                    </span>
                    <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
                      {language === 'hi'
                        ? 'शिक्षक मूल्यांकन एवं दक्षता रेटिंग (Part III)'
                        : 'Educator Evaluation Competency Ratings (Part III)'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {charts.teacherRatings.map((rating: any) => (
                      <div
                        key={rating.id}
                        className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                            {language === 'hi' ? rating.labelHi : rating.label}
                          </p>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {rating.responseCount} {language === 'hi' ? 'मूल्यांकन' : 'evaluations'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-lg font-bold font-[var(--font-heading)] text-purple-600 dark:text-purple-400">
                            {rating.averageRating}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">/ 5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Practical Innovations Showcase */}
              <StudentInnovationsShowcase innovations={innovations} />

              {/* Individualized Stream & Career Counseling Matrix */}
              <StreamRecommendationsTable roster={roster} />
            </div>

            {/* Footer Bottom Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-bold">
                  {language === 'hi' ? 'अकादमिक रिपोर्ट की समीक्षा करें' : 'Review Institutional Report'}
                </h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                  {language === 'hi'
                    ? 'सभी 26 विद्यार्थियों के व्यक्तिगत विवरण, प्रश्नवार उत्तर, 100% सटीक स्कोर और संकाय मार्गदर्शन के साथ पूर्ण औपचारिक दस्तावेज।'
                    : 'Inspect full student profiles, question-by-question scoring, and comprehensive stream recommendations in publication-standard format.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/dashboard/report"
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all active:scale-95"
                >
                  {language === 'hi' ? 'पूर्ण रिपोर्ट खोलें' : 'Open Full Report'}
                </Link>
                {hasDocxReport && (
                  <a
                    href="/api/reports/download"
                    download
                    className="px-4 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 border border-indigo-700 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word (.docx)</span>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
