import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthTeacher } from '@/lib/auth';
import { questionnaireQuestions } from '@/lib/data/questionnaire';
import { assessmentQuestions } from '@/lib/data/assessment';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';
import {
  getAcademicProof,
  getStandardizedDreamCareer,
  deduceRecommendedStream,
} from '@/lib/utils/academic-insights';
import fs from 'fs';
import path from 'path';

function getOption(qDef: any, val: string): { label: string; labelHi?: string; value: string } | undefined {
  if (!qDef || !Array.isArray(qDef.options)) return undefined;
  return qDef.options.find((o: any) => o.value === val);
}

export async function GET(request: NextRequest) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const classFilter = searchParams.get('class') || '';

  // Fetch all students for this teacher
  const where: Record<string, unknown> = { teacherId: teacher.teacherId };
  if (classFilter) {
    where.classGrade = classFilter;
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      questionnaireResponse: true,
      assessmentResponse: true,
      teacherFeedback: true,
    },
  });

  const totalStudents = students.length;
  if (totalStudents === 0) {
    return NextResponse.json({
      cohort: {
        totalStudents: 0,
        questionnairesCompleted: 0,
        assessmentsCompleted: 0,
        feedbacksCompleted: 0,
        completionRate: 0,
        averageScore: 0,
        flawlessScoreCount: 0,
        highAptitudePercent: 0,
      },
      charts: {
        subjectPassions: [],
        joyfulActivities: [],
        superpowers: [],
        workEnvironment: [],
        careerTrajectories: [],
        scoreDistribution: {
          distribution: [],
          categoryPerformance: [],
          averageScore: 0,
          maxScore: 0,
          minScore: 0,
        },
        growthNeeds: [],
        teacherRatings: [],
      },
      innovations: [],
      roster: [],
      hasDocxReport: false,
    });
  }

  // Question definitions map
  const qMap = new Map(questionnaireQuestions.map((q) => [q.id, q]));
  const aMap = new Map(assessmentQuestions.map((a) => [a.id, a]));
  const tfMap = new Map(teacherFeedbackQuestions.map((tf) => [tf.id, tf]));

  // 1. QUESTIONNAIRE AGGREGATIONS
  const q1Counts: Record<string, number> = {};
  const q2Counts: Record<string, number> = {};
  const q3Counts: Record<string, number> = {};
  const q4Counts: Record<string, number> = {};
  const q6Counts: Record<string, number> = {};
  const q10Counts: Record<string, number> = {};

  // Part 2: Assessment aggregations
  const scores: number[] = [];
  const scoreCounts: Record<number, number> = {};
  const categoryStats: Record<
    string,
    { label: string; labelHi: string; totalAnswered: number; correct: number }
  > = {
    general_awareness: { label: 'General Awareness', labelHi: 'सामान्य जागरूकता', totalAnswered: 0, correct: 0 },
    basic_aptitude: { label: 'Basic Aptitude', labelHi: 'बुनियादी अभिरुचि', totalAnswered: 0, correct: 0 },
    practical_decision_making: { label: 'Practical Decision Making', labelHi: 'व्यावहारिक निर्णय क्षमता', totalAnswered: 0, correct: 0 },
  };

  // Part 3: Feedback ratings aggregations
  const feedbackRatingSums: Record<string, { sum: number; count: number }> = {};

  // Student Innovations showcase list
  const innovations: Array<{
    studentId: string;
    studentName: string;
    accessCode: string;
    classGrade: string;
    rawProof: string;
    title: string;
    category: string;
    academicDescription: string;
  }> = [];

  // Roster with Stream Guidance
  const roster: Array<{
    serial: number;
    id: string;
    name: string;
    classGrade: string;
    accessCode: string;
    school: string;
    topPassions: string[];
    dreamCareer: string;
    score: number | null;
    totalQuestions: number;
    scorePercent: number | null;
    recommendedStream: string;
    recommendedPathway: string;
    guidanceNote: string;
    feedbackStatus: string;
  }> = [];

  let qCompletedCount = 0;
  let aCompletedCount = 0;
  let fCompletedCount = 0;

  students.forEach((student: any, idx: number) => {
    const qRes = student.questionnaireResponse;
    const aRes = student.assessmentResponse;
    const fRes = student.teacherFeedback;

    if (qRes && qRes.responses) qCompletedCount++;
    if (aRes && typeof aRes.score === 'number') aCompletedCount++;
    if (fRes && fRes.completedAt) fCompletedCount++;

    const studentPassions: string[] = [];
    const studentSuperpowers: string[] = [];
    let studentDreamRaw = '';
    let studentProofRaw = '';

    // Parse Questionnaire
    if (qRes && Array.isArray(qRes.responses)) {
      for (const item of qRes.responses) {
        const qId = item.questionId;
        const ans = item.answer;

        if (qId === 'q1' && Array.isArray(ans)) {
          ans.forEach((val: string) => {
            q1Counts[val] = (q1Counts[val] || 0) + 1;
            const qDef = qMap.get('q1');
            const opt = getOption(qDef, val);
            if (opt) studentPassions.push(opt.label);
          });
        } else if (qId === 'q2' && Array.isArray(ans)) {
          ans.forEach((val: string) => {
            q2Counts[val] = (q2Counts[val] || 0) + 1;
          });
        } else if (qId === 'q3' && Array.isArray(ans)) {
          ans.forEach((val: string) => {
            q3Counts[val] = (q3Counts[val] || 0) + 1;
            const qDef = qMap.get('q3');
            const opt = getOption(qDef, val);
            if (opt) studentSuperpowers.push(opt.label);
          });
        } else if (qId === 'q4') {
          const choice = typeof ans === 'object' && ans !== null && 'choice' in ans ? ans.choice : ans;
          const detail = typeof ans === 'object' && ans !== null && 'detail' in ans ? ans.detail : '';
          if (choice) q4Counts[choice] = (q4Counts[choice] || 0) + 1;
          if (detail && typeof detail === 'string') {
            studentProofRaw = detail;
            const proof = getAcademicProof(detail);
            if (proof) {
              innovations.push({
                studentId: student.id,
                studentName: student.name,
                accessCode: student.accessCode,
                classGrade: student.classGrade,
                rawProof: proof.raw,
                title: proof.title,
                category: proof.category,
                academicDescription: proof.academicDescription,
              });
            }
          }
        } else if (qId === 'q6' && Array.isArray(ans)) {
          ans.forEach((val: string) => {
            q6Counts[val] = (q6Counts[val] || 0) + 1;
          });
        } else if (qId === 'q7') {
          const choice = typeof ans === 'object' && ans !== null && 'choice' in ans ? ans.choice : ans;
          const detail = typeof ans === 'object' && ans !== null && 'detail' in ans ? ans.detail : '';
          studentDreamRaw = detail || choice || '';
        } else if (qId === 'q10' && Array.isArray(ans)) {
          ans.forEach((val: string) => {
            q10Counts[val] = (q10Counts[val] || 0) + 1;
          });
        }
      }
    }

    // Parse Assessment
    let studentScore: number | null = null;
    let studentTotalQ = 15;
    let studentScorePct: number | null = null;

    if (aRes && typeof aRes.score === 'number') {
      const validScore = aRes.score;
      studentScore = validScore;
      studentTotalQ = aRes.totalQuestions || 15;
      studentScorePct = Math.round((validScore / studentTotalQ) * 100);
      scores.push(validScore);
      scoreCounts[validScore] = (scoreCounts[validScore] || 0) + 1;

      if (Array.isArray(aRes.responses)) {
        for (const resp of aRes.responses) {
          const aDef = aMap.get(resp.questionId);
          if (aDef && aDef.category && categoryStats[aDef.category]) {
            categoryStats[aDef.category].totalAnswered++;
            if (resp.isCorrect) {
              categoryStats[aDef.category].correct++;
            }
          }
        }
      }
    }

    // Parse Feedback Ratings
    if (fRes && Array.isArray(fRes.ratings)) {
      for (const r of fRes.ratings) {
        if (typeof r.rating === 'number') {
          if (!feedbackRatingSums[r.questionId]) {
            feedbackRatingSums[r.questionId] = { sum: 0, count: 0 };
          }
          feedbackRatingSums[r.questionId].sum += r.rating;
          feedbackRatingSums[r.questionId].count++;
        }
      }
    }

    // Stream recommendation
    const dreamStandardized = getStandardizedDreamCareer(studentDreamRaw);
    const streamRecommendation = deduceRecommendedStream({
      accessCode: student.accessCode,
      score: studentScore ?? undefined,
      totalQuestions: studentTotalQ,
      passions: studentPassions,
      superpowers: studentSuperpowers,
      dreamCareer: studentDreamRaw,
      rawProof: studentProofRaw,
    });

    roster.push({
      serial: idx + 1,
      id: student.id,
      name: student.name,
      classGrade: student.classGrade,
      accessCode: student.accessCode,
      school: student.school || 'SAGES Hindi Medium, Jeora-Sirsa (Durg)',
      topPassions: studentPassions,
      dreamCareer: dreamStandardized,
      score: studentScore,
      totalQuestions: studentTotalQ,
      scorePercent: studentScorePct,
      recommendedStream: streamRecommendation.recommendedStream,
      recommendedPathway: streamRecommendation.recommendedPathway,
      guidanceNote: streamRecommendation.guidanceNote,
      feedbackStatus: student.feedbackStatus,
    });
  });

  // Calculate cohort aggregates
  const avgScore = scores.length > 0 ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const flawlessScoreCount = scores.filter((s) => s === 15).length;
  const highAptitudePercent = scores.length > 0 ? Math.round((flawlessScoreCount / scores.length) * 100) : 0;

  // Chart 1: Subject Passions Palette
  const passionPalette = ['#312e81', '#4338ca', '#4f46e5', '#6366f1', '#0284c7', '#06b6d4', '#0d9488', '#10b981'];
  const q1Def = qMap.get('q1');
  const subjectPassions = Object.entries(q1Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count], i) => {
      const opt = getOption(q1Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: passionPalette[i % passionPalette.length],
      };
    });

  // Chart 2: Joyful Activities
  const q2Def = qMap.get('q2');
  const joyfulActivities = Object.entries(q2Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const opt = getOption(q2Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: '#059669',
      };
    });

  // Chart 3: Superpowers
  const q3Def = qMap.get('q3');
  const superpowers = Object.entries(q3Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const opt = getOption(q3Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: '#7c3aed',
      };
    });

  // Chart 4: Work Environment (Donut)
  const donutColors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626'];
  const q4Def = qMap.get('q4');
  const workEnvironment = Object.entries(q4Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count], i) => {
      const opt = getOption(q4Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: donutColors[i % donutColors.length],
      };
    });

  // Chart 5: Career Trajectories (Q6)
  const q6Def = qMap.get('q6');
  const careerTrajectories = Object.entries(q6Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const opt = getOption(q6Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: '#e11d48',
      };
    });

  // Chart 6: Score Distribution
  const scoreKeys = [15, 14, 13, 12, 11, 10].filter((s) => scoreCounts[s] !== undefined || s >= 14);
  const scoreDistributionList = scoreKeys.map((sc) => {
    const count = scoreCounts[sc] || 0;
    return {
      score: sc,
      count,
      percent: scores.length > 0 ? Math.round((count / scores.length) * 100) : 0,
      tier: sc === 15 ? 'Flawless 100%' : sc === 14 ? 'Near Perfect 93%' : `${Math.round((sc / 15) * 100)}%`,
      color: sc === 15 ? '#059669' : sc === 14 ? '#2563eb' : '#6366f1',
    };
  });

  const categoryPerformance = Object.entries(categoryStats).map(([key, stat]) => ({
    category: key,
    label: stat.label,
    labelHi: stat.labelHi,
    totalAnswered: stat.totalAnswered,
    correctCount: stat.correct,
    accuracyPercent: stat.totalAnswered > 0 ? Math.round((stat.correct / stat.totalAnswered) * 100) : 0,
  }));

  // Chart 7: Growth & Mentorship Needs (Q10)
  const q10Def = qMap.get('q10');
  const growthNeeds = Object.entries(q10Counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const opt = getOption(q10Def, key);
      return {
        id: key,
        label: opt ? opt.label : key,
        labelHi: opt?.labelHi || opt?.label || key,
        count,
        percent: Math.round((count / totalStudents) * 100),
        color: '#0284c7',
      };
    });

  // Teacher feedback ratings
  const teacherRatings = Object.entries(feedbackRatingSums).map(([qId, val]) => {
    const tfDef = tfMap.get(qId);
    return {
      id: qId,
      label: tfDef ? tfDef.question : qId,
      labelHi: tfDef?.questionHi || qId,
      averageRating: +(val.sum / val.count).toFixed(1),
      responseCount: val.count,
    };
  });

  // Check if precompiled docx report is available on disk
  let hasDocxReport = false;
  const docxReportName = 'STUDENTS_INTERESTS_REPORT.docx';
  const sapanaDocx = path.join(process.cwd(), 'db', 'sapana', 'STUDENTS_INTERESTS_REPORT.docx');
  const gaganDocx = path.join(process.cwd(), 'db', 'gagan-sir-stduents', 'STUDENTS_INTERESTS_REPORT.docx');
  if (teacher.email.includes('sapana') && fs.existsSync(sapanaDocx)) {
    hasDocxReport = true;
  } else if (teacher.email.includes('gagan') && fs.existsSync(gaganDocx)) {
    hasDocxReport = true;
  } else if (fs.existsSync(sapanaDocx) || fs.existsSync(gaganDocx)) {
    hasDocxReport = true;
  }

  return NextResponse.json({
    cohort: {
      totalStudents,
      questionnairesCompleted: qCompletedCount,
      assessmentsCompleted: aCompletedCount,
      feedbacksCompleted: fCompletedCount,
      completionRate: Math.round((qCompletedCount / totalStudents) * 100),
      averageScore: avgScore,
      flawlessScoreCount,
      highAptitudePercent,
    },
    charts: {
      subjectPassions,
      joyfulActivities,
      superpowers,
      workEnvironment,
      careerTrajectories,
      scoreDistribution: {
        distribution: scoreDistributionList,
        categoryPerformance,
        averageScore: avgScore,
        maxScore,
        minScore,
      },
      growthNeeds,
      teacherRatings,
    },
    innovations,
    roster,
    hasDocxReport,
    docxReportName,
  });
}
