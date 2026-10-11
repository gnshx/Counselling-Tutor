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

  const qMap = new Map(questionnaireQuestions.map((q) => [q.id, q]));
  const aMap = new Map(assessmentQuestions.map((a) => [a.id, a]));
  const tfMap = new Map(teacherFeedbackQuestions.map((tf) => [tf.id, tf]));

  function formatAnswerText(qId: string, answer: any) {
    const qDef = qMap.get(qId);
    if (!qDef) return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);

    if (Array.isArray(answer)) {
      return answer
        .map((val) => {
          const opt = getOption(qDef, val);
          return opt ? `${opt.label} (${opt.labelHi || ''})` : val;
        })
        .join(', ');
    }

    if (typeof answer === 'object' && answer !== null) {
      if ('choice' in answer) {
        const opt = getOption(qDef, answer.choice);
        const choiceLabel = opt ? `${opt.label} (${opt.labelHi || ''})` : answer.choice;
        return `Choice: ${choiceLabel}${answer.detail ? `\nProof / Detail: "${answer.detail}"` : ''}`;
      }
      return JSON.stringify(answer);
    }

    const opt = getOption(qDef, answer);
    if (opt) {
      return `${opt.label} (${opt.labelHi || ''})`;
    }

    return String(answer);
  }

  const detailedStudents = students.map((student: any, idx: number) => {
    const qRes = student.questionnaireResponse;
    const aRes = student.assessmentResponse;
    const fRes = student.teacherFeedback;

    let topPassions: string[] = [];
    let joyfulActivities: string[] = [];
    let superpowers: string[] = [];
    let workEnvironment = '';
    let workEnvironmentProof = '';
    let futureCareerPaths: string[] = [];
    let dreamCareer = '';
    let dreamCareerDetail = '';
    let inspirations: string[] = [];
    let readiness = '';
    let supportNeeds: string[] = [];

    const formattedQResponses: Array<{
      questionId: string;
      questionNumber: number;
      questionText: string;
      questionTextHi?: string;
      formattedAnswer: string;
      rawDetail?: string;
    }> = [];

    if (qRes && Array.isArray(qRes.responses)) {
      qRes.responses.forEach((r: any, qIdx: number) => {
        const qDef = qMap.get(r.questionId);
        const qTitle = qDef ? qDef.question : r.questionId;
        const qTitleHi = qDef?.questionHi;
        const formatted = formatAnswerText(r.questionId, r.answer);

        let detail = '';
        if (typeof r.answer === 'object' && r.answer !== null && 'detail' in r.answer) {
          detail = r.answer.detail;
        }

        formattedQResponses.push({
          questionId: r.questionId,
          questionNumber: qIdx + 1,
          questionText: qTitle,
          questionTextHi: qTitleHi,
          formattedAnswer: formatted,
          rawDetail: detail,
        });

        if (r.questionId === 'q1' && Array.isArray(r.answer)) {
          topPassions = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        } else if (r.questionId === 'q2' && Array.isArray(r.answer)) {
          joyfulActivities = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        } else if (r.questionId === 'q3' && Array.isArray(r.answer)) {
          superpowers = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        } else if (r.questionId === 'q4') {
          if (typeof r.answer === 'object' && r.answer !== null) {
            const opt = getOption(qDef, r.answer.choice);
            workEnvironment = opt ? opt.label : r.answer.choice;
            workEnvironmentProof = r.answer.detail || '';
          } else {
            const opt = getOption(qDef, r.answer);
            workEnvironment = opt ? opt.label : r.answer;
          }
        } else if (r.questionId === 'q6' && Array.isArray(r.answer)) {
          futureCareerPaths = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        } else if (r.questionId === 'q7') {
          if (typeof r.answer === 'object' && r.answer !== null) {
            const opt = getOption(qDef, r.answer.choice);
            dreamCareer = opt ? opt.label : r.answer.choice;
            dreamCareerDetail = r.answer.detail || '';
          } else {
            const opt = getOption(qDef, r.answer);
            dreamCareer = opt ? opt.label : r.answer;
          }
        } else if (r.questionId === 'q8' && Array.isArray(r.answer)) {
          inspirations = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        } else if (r.questionId === 'q9') {
          const opt = getOption(qDef, r.answer);
          readiness = opt ? `${opt.label} (${opt.labelHi || ''})` : String(r.answer);
        } else if (r.questionId === 'q10' && Array.isArray(r.answer)) {
          supportNeeds = r.answer.map((v: string) => getOption(qDef, v)?.label || v);
        }
      });
    }

    // Assessment question breakdown
    let assessmentData: any = null;
    if (aRes && typeof aRes.score === 'number') {
      const respList = (aRes.responses || []).map((aq: any, aIdx: number) => {
        const aDef = aMap.get(aq.questionId);
        return {
          questionNumber: aIdx + 1,
          questionId: aq.questionId,
          category: aDef?.categoryLabel || aDef?.category || '',
          categoryHi: aDef?.categoryLabelHi || '',
          questionText: aDef ? aDef.question : aq.questionId,
          questionTextHi: aDef?.questionHi || '',
          selectedAnswer: aq.selectedAnswer,
          isCorrect: aq.isCorrect,
          correctAnswer: aDef?.correctAnswer || '',
          explanation: aDef?.explanation || '',
        };
      });

      assessmentData = {
        score: aRes.score,
        totalQuestions: aRes.totalQuestions || 15,
        percent: Math.round((aRes.score / (aRes.totalQuestions || 15)) * 100),
        completedAt: aRes.completedAt,
        responses: respList,
      };
    }

    // Teacher feedback
    let feedbackData: any = null;
    if (fRes && fRes.completedAt) {
      const ratings = (fRes.ratings || []).map((r: any) => {
        const tfDef = tfMap.get(r.questionId);
        return {
          questionId: r.questionId,
          question: tfDef ? tfDef.question : r.questionId,
          rating: r.rating,
        };
      });

      feedbackData = {
        ratings,
        strongestAreas: fRes.strongestAreas || [],
        interestedAreas: fRes.interestedAreas || [],
        workingStyle: fRes.workingStyle || '',
        comment: fRes.comment || '',
        completedAt: fRes.completedAt,
      };
    }

    const dreamStandardized = getStandardizedDreamCareer(dreamCareerDetail || dreamCareer);
    const streamGuidance = deduceRecommendedStream({
      accessCode: student.accessCode,
      score: aRes?.score,
      totalQuestions: aRes?.totalQuestions || 15,
      passions: topPassions,
      superpowers,
      dreamCareer: dreamCareerDetail || dreamCareer,
      rawProof: workEnvironmentProof,
    });

    const proofData = getAcademicProof(workEnvironmentProof);

    return {
      serial: idx + 1,
      id: student.id,
      name: student.name,
      classGrade: student.classGrade,
      school: student.school || 'SAGES Hindi Medium, Jeora-Sirsa (Durg)',
      dob: student.dob,
      parentJob: student.parentJob,
      familyIncome: student.familyIncome,
      accessCode: student.accessCode,
      highlights: {
        topPassions,
        joyfulActivities,
        superpowers,
        workEnvironment,
        workEnvironmentProof,
        futureCareerPaths,
        dreamCareer,
        dreamCareerDetail,
        dreamStandardized,
        inspirations,
        readiness,
        supportNeeds,
      },
      proofData,
      questionnaireResponses: formattedQResponses,
      assessment: assessmentData,
      feedback: feedbackData,
      streamGuidance,
    };
  });

  return NextResponse.json({
    teacher: {
      name: teacher.name,
      email: teacher.email,
    },
    generatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    totalStudents: detailedStudents.length,
    students: detailedStudents,
  });
}
