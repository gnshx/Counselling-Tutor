'use client';

import React from 'react';
import {
  Sparkles,
  Printer,
  Compass,
  Brain,
  MessageSquareCheck,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export interface StudentSummaryProps {
  student: {
    id: string;
    name: string;
    classGrade: string;
    school?: string | null;
    dob: string | Date;
    accessCode: string;
    parentJob?: string | null;
    familyIncome?: string | null;
    questionnaireStatus: string;
    assessmentStatus: string;
    feedbackStatus: string;
    questionnaireResponse?: { responses: { questionId: string; answer: unknown }[] } | null;
    assessmentResponse?: {
      score: number;
      totalQuestions: number;
      responses: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
    } | null;
    teacherFeedback?: {
      ratings: { questionId: string; rating: number | 'N/O' }[];
      strongestAreas?: string[];
      interestedAreas?: string[];
      workingStyle?: string | null;
      comment?: string | null;
    } | null;
  };
}

export function StudentSummaryCard({ student }: StudentSummaryProps) {
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  // Format DOB
  const formattedDob = new Date(student.dob).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Score metrics
  const assessment = student.assessmentResponse;
  const score = assessment?.score ?? 0;
  const totalQuestions = assessment?.totalQuestions ?? 15;
  const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Aptitude tier
  let aptitudeTierHi = 'सामान्य समझ';
  let aptitudeTierEn = 'Developing Aptitude';
  let aptitudeBadgeColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60';

  if (scorePercent >= 70) {
    aptitudeTierHi = 'उत्कृष्ट तार्किक चिंतन';
    aptitudeTierEn = 'High Analytical & Logic';
    aptitudeBadgeColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
  } else if (scorePercent >= 50) {
    aptitudeTierHi = 'सशक्त व्यावहारिक समझ';
    aptitudeTierEn = 'Proficient Problem Solving';
    aptitudeBadgeColor = 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60';
  }

  // Teacher feedback summary
  const feedback = student.teacherFeedback;
  const teacherStrongest = feedback?.strongestAreas || [];
  const teacherInterested = feedback?.interestedAreas || [];
  const workingStyle = feedback?.workingStyle || '';
  const comment = feedback?.comment || '';

  // Calculate average rating
  const ratings = feedback?.ratings || [];
  const validRatings = ratings.filter((r) => typeof r.rating === 'number') as { questionId: string; rating: number }[];
  const avgRating = validRatings.length > 0
    ? (validRatings.reduce((acc, r) => acc + r.rating, 0) / validRatings.length).toFixed(1)
    : null;

  // Extract questionnaire answers
  const qResponses = student.questionnaireResponse?.responses || [];
  const getQAnswer = (qId: string): unknown => {
    const item = qResponses.find((r) => r.questionId === qId);
    return item?.answer;
  };

  const favoriteSubjects = Array.isArray(getQAnswer('q1')) ? (getQAnswer('q1') as string[]) : [];
  const activities = Array.isArray(getQAnswer('q2')) ? (getQAnswer('q2') as string[]) : [];
  const strengths = Array.isArray(getQAnswer('q3')) ? (getQAnswer('q3') as string[]) : [];

  // Stream recommendations inference
  const streamSuggestions: { title: string; desc: string; icon: typeof TrendingUp }[] = [];

  const hasMathScience = favoriteSubjects.some((s) => /math|science|गणित|विज्ञान|भौतिक|रसायन|जीव/i.test(s));
  const hasCreativity = activities.some((a) => /कला|चित्र|art|craft|design|music|संगीत/i.test(a));
  const hasCommerceBusiness = activities.some((a) => /व्यापार|business|हिसाब|money|दुकान/i.test(a));

  if (scorePercent >= 60 || hasMathScience) {
    streamSuggestions.push({
      title: isHindi ? 'विज्ञान एवं तकनीकी संकाय (Science - PCM/PCB)' : 'Science & Technology (PCM/PCB)',
      desc: isHindi
        ? 'तार्किक क्षमता और विज्ञान में रुचि इंजीनियरिंग, चिकित्सा, कृषि विज्ञान और तकनीकी नवाचार के लिए उपयुक्त है।'
        : 'Strong logical foundation and curiosity suitable for Engineering, Medicine, Agricultural Tech, and Applied Sciences.',
      icon: Brain,
    });
  }

  if (hasCommerceBusiness || scorePercent >= 45) {
    streamSuggestions.push({
      title: isHindi ? 'वाणिज्य एवं वित्तीय प्रबंधन (Commerce / Business)' : 'Commerce & Financial Management',
      desc: isHindi
        ? 'व्यावहारिक समझ और संगठनात्मक कौशल लेखांकन, बैंकिंग, उद्यमिता और प्रबंधन के लिए अनुकूल हैं।'
        : 'Practical orientation and organizational strengths fit for Banking, Accounting, Entrepreneurship, and Analytics.',
      icon: TrendingUp,
    });
  }

  if (hasCreativity || streamSuggestions.length < 2) {
    streamSuggestions.push({
      title: isHindi ? 'कला, मानविकी एवं डिजाइन (Humanities / Creative Arts)' : 'Humanities, Design & Civil Services',
      desc: isHindi
        ? 'रचनात्मक अभिव्यक्ति, सामाजिक समझ और जनसंपर्क सिविल सेवा, पत्रकारिता, डिजाइन और शिक्षण के अवसर खोलते हैं।'
        : 'Creative expression and communication well-aligned with Civil Services, Media, Design, and Social Sciences.',
      icon: Award,
    });
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors print:border-none print:shadow-none print:p-0">
      {/* Top Banner & Print Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
              {isHindi ? 'विद्यार्थी समग्र सारांश (Executive Summary)' : 'Student Comprehensive Summary'}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {isHindi ? 'खोज यात्रा, चिंतन क्षमता एवं शिक्षक टिप्पणियों का एकीकृत विश्लेषण' : 'Integrated synthesis of student discovery, cognitive metrics & educator inputs'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-soft)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] transition-colors cursor-pointer self-start sm:self-center print:hidden"
        >
          <Printer className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{isHindi ? 'प्रिंट सारांश' : 'Print Summary'}</span>
        </button>
      </div>

      {/* Student Overview Header */}
      <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800/40">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--color-text-primary)]">{student.name}</div>
            <div className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-2 mt-0.5">
              <span>{isHindi ? 'कक्षा:' : 'Class:'} <strong className="text-[var(--color-text-primary)]">{student.classGrade}</strong></span>
              <span>•</span>
              <span>{isHindi ? 'जन्म:' : 'DOB:'} {formattedDob}</span>
              {student.school && (
                <>
                  <span>•</span>
                  <span>{student.school}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-bold text-[var(--color-primary)]">
            {student.accessCode}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${aptitudeBadgeColor}`}>
            {isHindi ? aptitudeTierHi : aptitudeTierEn}
          </span>
        </div>
      </div>

      {/* 3 Pillar Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Student Passions */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>{isHindi ? 'स्व-घोषित रुचियां' : 'Student Interests'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-[var(--color-text-secondary)] block font-medium mb-1">
                {isHindi ? 'पसंदीदा विषय:' : 'Favorite Subjects:'}
              </span>
              {favoriteSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {favoriteSubjects.slice(0, 4).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-medium text-[11px]">
                      {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[var(--color-text-muted)] italic text-[11px]">{isHindi ? 'प्रतीक्षारत' : 'Pending'}</span>
              )}
            </div>

            <div>
              <span className="text-[11px] text-[var(--color-text-secondary)] block font-medium mb-1">
                {isHindi ? 'पसंदीदा गतिविधियां:' : 'Key Activities:'}
              </span>
              {activities.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {activities.slice(0, 3).map((act, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-[11px]">
                      {act}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[var(--color-text-muted)] italic text-[11px]">{isHindi ? 'प्रतीक्षारत' : 'Pending'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Pillar 2: Cognitive Aptitude */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>{isHindi ? 'चिंतन चुनौती स्कोर' : 'Cognitive Challenge'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                {score} <span className="text-sm font-normal text-[var(--color-text-secondary)]">/ {totalQuestions}</span>
              </span>
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                ({scorePercent}%)
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-[var(--color-border-subtle)] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              {student.assessmentStatus === 'completed'
                ? isHindi
                  ? `विद्यार्थी ने 15 तार्किक एवं समस्या-समाधान प्रश्नों में से ${score} का सही उत्तर दिया।`
                  : `Solved ${score} of ${totalQuestions} logic and reasoning challenges successfully.`
                : isHindi
                ? 'चिंतन चुनौती अभी पूरी नहीं हुई है।'
                : 'Thinking challenge not yet completed.'}
            </p>
          </div>
        </div>

        {/* Pillar 3: Educator Evaluation */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <MessageSquareCheck className="w-4 h-4" />
            <span>{isHindi ? 'शिक्षक अवलोकन' : 'Educator Insight'}</span>
          </div>

          <div className="space-y-2 text-xs">
            {student.feedbackStatus === 'completed' ? (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-secondary)]">{isHindi ? 'औसत रेटिंग:' : 'Avg Rating:'}</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{avgRating ? `${avgRating} / 5.0` : 'दर्ज'}</span>
                </div>

                {workingStyle && (
                  <div className="text-[11px]">
                    <span className="text-[var(--color-text-secondary)] block font-medium mb-0.5">{isHindi ? 'कार्य शैली:' : 'Working Style:'}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800/60 inline-block text-[11px]">
                      {workingStyle}
                    </span>
                  </div>
                )}

                {comment && (
                  <p className="text-[11px] text-[var(--color-text-secondary)] italic line-clamp-2">
                    &quot;{comment}&quot;
                  </p>
                )}
              </>
            ) : (
              <p className="text-[11px] text-[var(--color-text-muted)] italic">
                {isHindi ? 'शिक्षक अवलोकन अभी दर्ज नहीं किया गया है।' : 'Educator feedback pending submission.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stream & Career Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" />
          <span>{isHindi ? 'करियर एवं संकाय मार्गदर्शन (Career & Stream Pathways)' : 'Recommended Career & Stream Pathways'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {streamSuggestions.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-[var(--color-text-primary)]">
                  <Icon className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                  <span>{rec.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                  {rec.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
