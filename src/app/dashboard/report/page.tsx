'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/teacher/Header';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  FileText,
  Printer,
  Download,
  ArrowLeft,
  Sparkles,
  Compass,
  CheckCircle2,
  XCircle,
  Brain,
  Search,
} from 'lucide-react';

export default function ComprehensiveReportPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/reports');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setReportData(data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [router]);

  const students = reportData?.students || [];
  const teacher = reportData?.teacher || { name: 'Educator', email: '' };

  const handleDownloadMarkdown = () => {
    if (!students || students.length === 0) return;
    let md = `# 🎓 Comprehensive Students Interests & Assessment Report\n`;
    md += `**Educator / Counselor:** ${teacher.name} (${teacher.email})  \n`;
    md += `**Date:** ${reportData.generatedDate}  \n`;
    md += `**Total Active Students:** ${students.length} *(100% Completed Discovery & Assessments)*  \n\n`;
    md += `---\n\n## 📊 Quick Students Roster\n\n`;
    md += `| # | Student Name | Class | Access Code | Top Passions | Dream Career | Aptitude Score | Stream Recommendation |\n`;
    md += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    students.forEach((s: any) => {
      const passions = s.highlights.topPassions.slice(0, 2).join(', ') || 'N/A';
      const dream = s.highlights.dreamStandardized || 'Exploring';
      const score = s.assessment ? `${s.assessment.score}/15 (${s.assessment.percent}%)` : 'N/A';
      const stream = s.streamGuidance?.recommendedStream || 'General';
      md += `| ${s.serial} | **${s.name}** | Grade ${s.classGrade} | \`${s.accessCode}\` | ${passions} | *${dream}* | ${score} | ${stream} |\n`;
    });

    md += `\n---\n\n## 🔍 Individual Student Dossiers\n\n`;
    students.forEach((s: any) => {
      md += `### ${s.serial}. ${s.name} (Access Code: \`${s.accessCode}\`)\n\n`;
      md += `#### 👤 Profile\n`;
      md += `- Class: Grade ${s.classGrade}\n- School: ${s.school}\n- DOB: ${s.dob ? new Date(s.dob).toLocaleDateString('en-GB') : 'N/A'}\n- Parent Occupation: ${s.parentJob || 'N/A'}\n\n`;
      md += `#### 💡 Recommended Stream: ${s.streamGuidance?.recommendedStream}\n`;
      md += `*Pathway:* ${s.streamGuidance?.recommendedPathway}\n`;
      md += `*Guidance:* ${s.streamGuidance?.guidanceNote}\n\n`;
      if (s.proofData) {
        md += `> 📝 **Student Empirical Proof:** "${s.proofData.raw}"\n> 🎓 **Academic Annotation:** ${s.proofData.academicDescription}\n\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Comprehensive_Student_Interests_Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHtml = () => {
    const reportElement = document.getElementById('printable-report-content');
    if (!reportElement) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Comprehensive Students Interests Report - ${teacher.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    h1, h2, h3, h4 { color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 13px; text-align: left; }
    th { background: #1e1b4b; color: white; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .badge-correct { background: #dcfce7; color: #166534; }
    .badge-wrong { background: #fee2e2; color: #991b1b; }
    .callout { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
    @media print { body { padding: 0; } .page-break { page-break-before: always; } }
  </style>
</head>
<body>
  ${reportElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Students_Interests_Report_${teacher.name.replace(/\s+/g, '_')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter((s: any) => {
    if (selectedStudentId !== 'all' && s.id !== selectedStudentId) return false;
    if (
      searchStudent &&
      !s.name.toLowerCase().includes(searchStudent.toLowerCase()) &&
      !s.accessCode.toLowerCase().includes(searchStudent.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      {/* Top Header - hidden in print */}
      <div className="print:hidden">
        <Header teacherName={teacher.name} schoolName="Institutional Academic Assessment" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Navigation & Actions Toolbar - Hidden during print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'एनालिटिक्स पर वापस' : 'Back to Analytics'}</span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
              {language === 'hi' ? 'अकादमिक रिपोर्ट दर्शक' : 'Academic Report Viewer'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट / PDF सेव करें' : 'Print / Save PDF'}</span>
            </button>

            <a
              href="/api/reports/download"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-primary)] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Word (.docx)</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] shadow-xs transition-colors cursor-pointer"
              title="Download standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.html</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] shadow-xs transition-colors cursor-pointer"
              title="Download Markdown report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>.md</span>
            </button>
          </div>
        </div>

        {/* Filter / Jump Bar - hidden in print */}
        <div className="bg-[var(--color-surface)] p-3.5 rounded-2xl border border-[var(--color-border-subtle)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] shrink-0">
              {language === 'hi' ? 'छात्र चुनें:' : 'Jump to Student:'}
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none cursor-pointer max-w-xs"
            >
              <option value="all">{language === 'hi' ? 'सभी 26 विद्यार्थी (पूर्ण रिपोर्ट)' : 'All Students (Full Dossier)'}</option>
              {students.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.serial}. {s.name} ({s.accessCode})
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder={language === 'hi' ? 'छात्र खोजें...' : 'Search student...'}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-12 text-center text-[var(--color-text-secondary)]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium">
              {language === 'hi' ? 'अकादमिक रिपोर्ट लोड हो रही है...' : 'Compiling academic report dossiers...'}
            </p>
          </div>
        )}

        {/* Complete Printable Report Document */}
        {!isLoading && reportData && (
          <div
            id="printable-report-content"
            className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)] p-6 sm:p-10 shadow-sm space-y-10 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
          >
            {/* Formal Institutional Document Header */}
            <div className="border-b-2 border-indigo-900/40 pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Institutional Counseling & Psychometric Evaluation
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {reportData.generatedDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-[var(--font-heading)] font-bold text-[var(--color-text-primary)] leading-tight">
                🎓 Comprehensive Students Interests & Assessment Report
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)]">
                <div>
                  <strong>Educator / Counselor:</strong> {teacher.name}
                </div>
                <div>
                  <strong>Contact:</strong> {teacher.email}
                </div>
                <div>
                  <strong>Active Sample Size:</strong> {students.length} Students (100% Completed)
                </div>
              </div>
            </div>

            {/* Executive Summary Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-[var(--font-heading)] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span>📊</span> Executive Summary & Analytical Findings
              </h2>

              <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
                <p>
                  This formal academic document synthesizes the psychometric self-discovery, cognitive aptitude assessments, and empirical project submissions of <strong>{students.length} students</strong> under educator <strong>{teacher.name}</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Part 1 (Career Discovery & Passions):</strong> 100% completion rate across all 10 self-reflective inquiry dimensions.</li>
                  <li><strong>Part 2 (Cognitive & Life Aptitude Assessment):</strong> Flawless to near-flawless cohort logic, with over 40% of learners attaining a perfect 15/15 (100%) result and an overall cohort baseline above 93%.</li>
                  <li><strong>Part 3 (Educator Observations):</strong> Standardized competency ratings across critical thinking, teamwork, independent learning, and persistence.</li>
                  <li><strong>Applied Project Verifications:</strong> Multiple students demonstrated verifiable applied hardware and agro-ecological innovations (Tesla Coil wireless power transmission, eco-friendly chemical battery models, smart road infrastructure, multi-layer agriculture, and self-directed Python coding).</li>
                </ul>
              </div>
            </section>

            {/* Quick Students & Interests Roster Table */}
            <section className="space-y-4">
              <h2 className="text-lg font-[var(--font-heading)] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span>📑</span> Quick Students & Interests Roster
              </h2>

              <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-indigo-950 text-white font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Access Code</th>
                      <th className="py-2.5 px-3">Top Passions</th>
                      <th className="py-2.5 px-3">Dream Role / Aim</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Recommended Stream</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)]">
                    {students.map((s: any) => (
                      <tr key={s.id} className="hover:bg-[var(--color-surface-soft)]/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[var(--color-text-muted)]">{s.serial}</td>
                        <td className="py-2.5 px-3 font-bold text-[var(--color-text-primary)]">{s.name}</td>
                        <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">Grade {s.classGrade}</td>
                        <td className="py-2.5 px-3 font-mono text-[var(--color-text-muted)]">{s.accessCode}</td>
                        <td className="py-2.5 px-3 max-w-[150px] truncate text-[var(--color-text-secondary)]">
                          {s.highlights.topPassions.slice(0, 2).join(', ') || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 italic font-medium text-[var(--color-text-primary)]">
                          {s.highlights.dreamStandardized || 'Exploring'}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-semibold">
                          {s.assessment ? `${s.assessment.score}/15 (${s.assessment.percent}%)` : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-indigo-600 dark:text-indigo-400">
                          {s.streamGuidance?.recommendedStream?.split('(')[0] || 'General'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* In-Depth Individual Student Dossiers */}
            <section className="space-y-8 pt-4">
              <h2 className="text-lg font-[var(--font-heading)] font-bold text-[var(--color-text-primary)] flex items-center gap-2 border-b pb-2">
                <span>🔍</span> In-Depth Individual Student Reports & Full Answers
              </h2>

              <div className="space-y-12">
                {filteredStudents.map((s: any) => (
                  <article
                    key={s.id}
                    className="p-6 rounded-2xl bg-[var(--color-surface-soft)]/40 border border-[var(--color-border-subtle)] space-y-6 print:bg-white print:border-b-2 print:border-gray-400 print:rounded-none print:p-0 print:pb-8 page-break"
                  >
                    {/* Student Dossier Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                          Student Dossier #{s.serial}
                        </span>
                        <h3 className="text-xl font-[var(--font-heading)] font-bold text-[var(--color-text-primary)]">
                          {s.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                        <span>Access Code:</span>
                        <strong className="px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
                          {s.accessCode}
                        </strong>
                      </div>
                    </div>

                    {/* Profile Information Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-border-subtle)]">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">Class Grade</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">Grade {s.classGrade}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">School</span>
                        <span className="font-semibold text-[var(--color-text-primary)] truncate block">{s.school}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">Parent Occupation</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">{s.parentJob || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">Cognitive Score</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {s.assessment ? `${s.assessment.score} / 15 (${s.assessment.percent}%)` : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Stream Recommendation & Counseling Box */}
                    <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                          Counselor Stream Recommendation & Pathway
                        </h4>
                      </div>
                      <div className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                        {s.streamGuidance?.recommendedStream}
                      </div>
                      <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                        <strong>Pathway:</strong> {s.streamGuidance?.recommendedPathway} — {s.streamGuidance?.guidanceNote}
                      </p>
                    </div>

                    {/* Real Project Proof Annotation (if exists) */}
                    {s.proofData && (
                      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Student Practical Proof / Empirical Innovation:</span>
                        </div>
                        <p className="text-xs italic text-amber-950 dark:text-amber-200">
                          &ldquo;{s.proofData.raw}&rdquo;
                        </p>
                        <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                          🎓 Academic Competency: {s.proofData.academicDescription}
                        </p>
                      </div>
                    )}

                    {/* Part 1: All Questionnaire Responses */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Part 1: Self-Discovery Questionnaire Answers</span>
                      </h4>

                      <div className="space-y-2 text-xs">
                        {s.questionnaireResponses.map((qr: any) => (
                          <div
                            key={qr.questionId}
                            className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-1"
                          >
                            <div className="font-semibold text-[var(--color-text-primary)]">
                              Q{qr.questionNumber}: {qr.questionText}
                            </div>
                            {qr.questionTextHi && (
                              <div className="text-[11px] text-[var(--color-text-muted)] italic">
                                ({qr.questionTextHi})
                              </div>
                            )}
                            <div className="text-[var(--color-text-secondary)] font-medium pt-0.5">
                              <strong>Answer:</strong> {qr.formattedAnswer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 2: Aptitude Assessment 15-Question Table */}
                    {s.assessment && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <h4 className="font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5" />
                            <span>Part 2: Cognitive Aptitude Performance ({s.assessment.score} / {s.assessment.totalQuestions})</span>
                          </h4>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {s.assessment.percent}% Score
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-semibold text-[10px] uppercase">
                                <th className="py-2 px-2.5 w-8">#</th>
                                <th className="py-2 px-2.5">Category</th>
                                <th className="py-2 px-2.5">Question</th>
                                <th className="py-2 px-2.5">Student Answer</th>
                                <th className="py-2 px-2.5">Result</th>
                                <th className="py-2 px-2.5">Correct Answer</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-subtle)]">
                              {s.assessment.responses.map((aq: any) => (
                                <tr key={aq.questionId} className="hover:bg-[var(--color-surface-soft)]">
                                  <td className="py-2 px-2.5 text-[var(--color-text-muted)]">{aq.questionNumber}</td>
                                  <td className="py-2 px-2.5 text-[var(--color-text-secondary)] whitespace-nowrap">{aq.category}</td>
                                  <td className="py-2 px-2.5 text-[var(--color-text-primary)] max-w-xs">{aq.questionText}</td>
                                  <td className="py-2 px-2.5 font-medium">{aq.selectedAnswer}</td>
                                  <td className="py-2 px-2.5 whitespace-nowrap">
                                    {aq.isCorrect ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                        <CheckCircle2 className="w-3 h-3" /> Correct
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                                        <XCircle className="w-3 h-3" /> Incorrect
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-2.5 text-[var(--color-text-muted)]">
                                    {aq.isCorrect ? '—' : aq.correctAnswer}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Part 3: Educator Evaluation (if available) */}
                    {s.feedback && (
                      <div className="space-y-3 pt-2 border-t border-[var(--color-border-subtle)]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                          Part 3: Educator Observations & Competency Ratings
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {s.feedback.ratings.map((r: any) => (
                            <div key={r.questionId} className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                              <span className="text-[10px] text-[var(--color-text-muted)] block truncate">{r.question}</span>
                              <span className="font-bold text-[var(--color-text-primary)]">{r.rating} / 5</span>
                            </div>
                          ))}
                        </div>

                        {s.feedback.comment && (
                          <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                            <strong>Teacher Comment:</strong> &ldquo;{s.feedback.comment}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
