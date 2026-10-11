'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  BarChart3,
  Printer,
  RefreshCw,
  Users,
  Brain,
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

  // Extract top items for executive tiles
  const topPassion = charts.subjectPassions?.[0]?.label || 'Science & Discovery';
  const topCareer = charts.careerTrajectories?.[0]?.label || 'Agriculture & Ecology';

  const classFilterOptions = [
    { label: language === 'hi' ? 'सभी कक्षाएं' : 'All Classes', value: '' },
    { label: language === 'hi' ? 'कक्षा 8' : 'Class 8', value: '8' },
    { label: language === 'hi' ? 'कक्षा 9' : 'Class 9', value: '9' },
    { label: language === 'hi' ? 'कक्षा 10' : 'Class 10', value: '10' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      <Header
        teacherName={teacher?.name || (language === 'hi' ? 'शिक्षक' : 'Educator')}
        schoolName={teacher?.school || (language === 'hi' ? 'विद्यालय डैशबोर्ड' : 'School Dashboard')}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* Top Action & Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-indigo-500/30 transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'विद्यार्थी सूची' : 'Student Roster'}</span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              {language === 'hi' ? 'कक्षा एनालिटिक्स' : 'Cohort Analytics'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Class Grade Segmented Pills */}
            <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
              {classFilterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedClass(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedClass === opt.value
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchAnalytics()}
              className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer shadow-xs"
              title={language === 'hi' ? 'डेटा रीफ़्रेश करें' : 'Refresh analytics'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title={language === 'hi' ? 'प्रिंट / PDF के रूप में सहेजें' : 'Print / Save PDF'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-[var(--color-surface)] p-7 sm:p-9 rounded-3xl border border-[var(--color-border-subtle)] shadow-xs transition-all space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {language === 'hi' ? 'लाइव अंतर्दृष्टि केंद्र' : 'Cohort Intelligence Center'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-[var(--font-heading)] font-bold text-[var(--color-text-primary)] tracking-tight">
            {language === 'hi'
              ? `${teacher?.name || 'शिक्षक'} — कक्षा समूह डेटा विश्लेषण एवं विज़ुअलाइज़ेशन`
              : `${teacher?.name || 'Educator'} — Class Cohort Analysis & Visualizations`}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            {language === 'hi'
              ? 'सभी 7 मुख्य विज़ुअलाइज़ेशन चार्ट्स, संज्ञानात्मक स्कोर वितरण, व्यावहारिक नवाचार और 11वीं संकाय (Stream) मार्गदर्शन का लाइव इंटरैक्टिव विश्लेषण।'
              : 'Interactive real-time visualization of academic curiosities, cognitive assessment distributions, student empirical project proofs, and recommended senior secondary streams.'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border-subtle)] p-16 text-center text-[var(--color-text-secondary)] space-y-3">
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">
              {language === 'hi' ? 'डेटा विश्लेषण और विज़ुअलाइज़ेशन तैयार हो रहे हैं...' : 'Computing cohort analytics and charts...'}
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Executive KPI Metric Cards (4 Spacious Tiles) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs transition-all space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-semibold">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>{language === 'hi' ? 'कुल विद्यार्थी समूह' : 'Cohort Size'}</span>
                </div>
                <div className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {cohort.totalStudents || 0}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {cohort.completionRate || 100}% {language === 'hi' ? 'सक्रिय सहभागिता' : 'Active Completion'}
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs transition-all space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-semibold">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>{language === 'hi' ? 'औसत तार्किक स्कोर' : 'Cognitive Baseline'}</span>
                </div>
                <div className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {cohort.averageScore || 0} <span className="text-sm font-normal text-[var(--color-text-muted)]">/ 15</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {cohort.flawlessScoreCount || 0} {language === 'hi' ? 'छात्रों ने 100% स्कोर किया' : 'students scored 100%'}
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs transition-all space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{language === 'hi' ? 'शीर्ष विषय रुचि' : 'Dominant Subject'}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] truncate">
                  {topPassion}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">
                  {charts.subjectPassions?.[0]?.count || 0} {language === 'hi' ? 'विद्यार्थियों की पहली पसंद' : 'student selections'}
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xs transition-all space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-semibold">
                  <Compass className="w-4 h-4 text-rose-500" />
                  <span>{language === 'hi' ? 'प्रमुख करियर क्षेत्र' : 'Top Career Path'}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] truncate">
                  {topCareer}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">
                  {charts.careerTrajectories?.[0]?.count || 0} {language === 'hi' ? 'विद्यार्थियों का लक्ष्य' : 'student aspirants'}
                </div>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="space-y-8 sm:space-y-10">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

              {/* Row 4: Support & Mentorship Needs (Figure 7) + Educator Ratings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                {charts.teacherRatings && charts.teacherRatings.length > 0 ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-border-subtle)]">
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wide uppercase">
                          Educator Ratings
                        </span>
                        <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
                          {language === 'hi'
                            ? 'शिक्षक मूल्यांकन एवं दक्षता रेटिंग (Part III)'
                            : 'Educator Evaluation Competency Ratings (Part III)'}
                        </h3>
                      </div>

                      <div className="space-y-3.5 mt-5">
                        {charts.teacherRatings.map((rating: any) => (
                          <div
                            key={rating.id}
                            className="p-3.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                {language === 'hi' ? rating.labelHi : rating.label}
                              </p>
                              <span className="text-xs text-[var(--color-text-muted)]">
                                {rating.responseCount} {language === 'hi' ? 'मूल्यांकन' : 'evaluations recorded'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xl font-bold font-[var(--font-heading)] text-purple-600 dark:text-purple-400">
                                {rating.averageRating}
                              </span>
                              <span className="text-xs text-[var(--color-text-muted)]">/ 5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                      {language === 'hi'
                        ? 'समस्त मूल्यांकन शिक्षकों द्वारा विद्यार्थियों के व्यक्तिगत व्यवहार व क्षमताओं पर आधारित हैं।'
                        : 'Competency marks reflect individualized teacher assessments based on observable student actions.'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-center items-center text-center space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] font-[var(--font-heading)]">
                      {language === 'hi' ? 'शिक्षक मूल्यांकन' : 'Educator Evaluations'}
                    </h4>
                    <p className="text-xs text-[var(--color-text-secondary)] max-w-sm">
                      {language === 'hi'
                        ? 'विद्यार्थी सूची से व्यक्तिगत प्रतिक्रिया दर्ज करने पर दक्षता रेटिंग्स यहाँ स्वतः प्रदर्शित होंगी।'
                        : 'Submit student evaluations from the student roster to see aggregate competency ratings here.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Student Practical Innovations Showcase */}
              <StudentInnovationsShowcase innovations={innovations} />

              {/* Individualized Stream & Career Counseling Matrix */}
              <StreamRecommendationsTable roster={roster} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
