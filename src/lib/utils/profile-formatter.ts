import { questionnaireQuestions } from '@/lib/data/questionnaire';
import { assessmentQuestions } from '@/lib/data/assessment';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';

export interface FormattedQuestionnaireData {
  passions: {
    subjects: string[];
    activities: string[];
  };
  talents: {
    strengths: string[];
  };
  style: {
    environment: string;
    challengeApproach: string;
  };
  aspirations: {
    careerPaths: string[];
    dreamRole: { choice: string; detail?: string };
    inspirations: string[];
  };
  growth: {
    readiness: string;
    supportNeeds: string[];
  };
}

export interface AssessmentCategoryDetail {
  key: string;
  label: string;
  score: number;
  total: number;
  percent: number;
}

export interface FormattedAssessmentData {
  score: number;
  totalQuestions: number;
  percent: number;
  categories: AssessmentCategoryDetail[];
  questionDetails: Array<{
    id: string;
    question: string;
    categoryLabel: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export function getTeacherWorkingStyleLabel(val?: string | null): string {
  if (!val) return 'Not assessed';
  if (val === 'both') return 'Comfortable with both (Group Work & Solo Work)';
  if (val === 'independent') return 'Mostly independent (Solo Work)';
  if (val === 'group_based') return 'Mostly group-based (Team Collaboration)';
  if (val === 'depends') return 'Depends on the task context';
  if (val === 'not_enough') return 'Not enough observation';
  const tf10 = teacherFeedbackQuestions.find((q) => q.id === 'tf10');
  const opt = tf10?.options?.find((o) => o.value === val);
  return opt ? opt.label : val;
}

export function getTeacherAreaLabels(qId: 'tf8' | 'tf9', values?: string[] | null): string[] {
  if (!values || !Array.isArray(values)) return [];
  const qDef = teacherFeedbackQuestions.find((q) => q.id === qId);
  return values.map((v) => {
    const opt = qDef?.options?.find((o) => o.value === v);
    return opt ? opt.label : v.replace(/_/g, ' ');
  });
}

export function getQuestionnaireAnswerLabel(qId: string, ans: any): { label: string; detail?: string } {
  const question = questionnaireQuestions.find((q) => q.id === qId);
  if (!question) return { label: String(ans) };

  // Handle conditional/proof answer with object: { choice: 'with_group', detail: 'Science fair project' }
  if (ans && typeof ans === 'object' && !Array.isArray(ans)) {
    const choice = ans.choice || ans.value;
    const detail = ans.detail;
    if ('options' in question) {
      const opt = question.options.find((o) => o.value === choice);
      return { label: opt ? opt.label : String(choice), detail };
    }
    return { label: String(choice), detail };
  }

  if (Array.isArray(ans)) {
    const labels = ans.map((a) => {
      if ('options' in question) {
        const opt = question.options.find((o) => o.value === a);
        return opt ? opt.label : a;
      }
      return a;
    });
    return { label: labels.join(', ') };
  }

  if (typeof ans === 'string' && 'options' in question) {
    const opt = question.options.find((o) => o.value === ans);
    if (opt) return { label: opt.label };
  }

  return { label: String(ans) };
}

export function formatQuestionnaireResponse(responses: Array<{ questionId: string; answer: any }>): FormattedQuestionnaireData {
  const responseMap = new Map<string, any>();
  responses.forEach((r) => responseMap.set(r.questionId, r.answer));

  const getOptionLabels = (qId: string): string[] => {
    const ans = responseMap.get(qId);
    if (!ans) return [];
    const question = questionnaireQuestions.find((q) => q.id === qId);
    if (!question || !('options' in question)) return Array.isArray(ans) ? ans : [String(ans)];

    const list = Array.isArray(ans) ? ans : [ans];
    return list.map((val) => {
      const opt = question.options.find((o) => o.value === val);
      return opt ? opt.label : String(val);
    });
  };

  const getSingleLabel = (qId: string): string => {
    const ans = responseMap.get(qId);
    if (!ans) return 'Not answered';
    const question = questionnaireQuestions.find((q) => q.id === qId);
    let choiceVal = ans;
    let detailVal: string | undefined;

    if (typeof ans === 'object' && ans !== null && !Array.isArray(ans)) {
      choiceVal = ans.choice || ans.value;
      detailVal = ans.detail;
    }

    if (question && 'options' in question) {
      const opt = question.options.find((o) => o.value === choiceVal);
      if (opt) {
        return detailVal ? `${opt.label} (Example: "${detailVal}")` : opt.label;
      }
    }
    return String(choiceVal);
  };

  // q7 dream role
  const q7Ans = responseMap.get('q7');
  let dreamRoleObj = { choice: 'Not answered', detail: undefined as string | undefined };
  if (q7Ans) {
    if (typeof q7Ans === 'object' && !Array.isArray(q7Ans)) {
      const parsed = getQuestionnaireAnswerLabel('q7', q7Ans.choice || q7Ans.value);
      dreamRoleObj = { choice: parsed.label, detail: q7Ans.detail };
    } else {
      const parsed = getQuestionnaireAnswerLabel('q7', q7Ans);
      dreamRoleObj = { choice: parsed.label, detail: undefined };
    }
  }

  return {
    passions: {
      subjects: getOptionLabels('q1'),
      activities: getOptionLabels('q2'),
    },
    talents: {
      strengths: getOptionLabels('q3'),
    },
    style: {
      environment: getSingleLabel('q4'),
      challengeApproach: getSingleLabel('q5'),
    },
    aspirations: {
      careerPaths: getOptionLabels('q6'),
      dreamRole: dreamRoleObj,
      inspirations: getOptionLabels('q8'),
    },
    growth: {
      readiness: getSingleLabel('q9'),
      supportNeeds: getOptionLabels('q10'),
    },
  };
}

export function formatAssessmentResponse(assessmentResponse: {
  score: number;
  totalQuestions: number;
  responses?: Array<{ questionId: string; selectedAnswer: string; isCorrect: boolean }>;
}): FormattedAssessmentData {
  const score = assessmentResponse.score || 0;
  const totalQuestions = assessmentResponse.totalQuestions || 15;
  const percent = Math.round((score / totalQuestions) * 100);

  const responses = assessmentResponse.responses || [];
  const responseMap = new Map<string, { selectedAnswer: string; isCorrect: boolean }>();
  responses.forEach((r) => responseMap.set(r.questionId, r));

  const categoryTotals: Record<string, { label: string; score: number; total: number }> = {
    general_awareness: { label: '🌍 General Awareness', score: 0, total: 0 },
    basic_aptitude: { label: '🧮 Basic Aptitude', score: 0, total: 0 },
    practical_decision_making: { label: '💡 Practical Decision Making', score: 0, total: 0 },
  };

  const questionDetails = assessmentQuestions.map((q) => {
    const userResp = responseMap.get(q.id);
    const selectedAnswer = userResp ? userResp.selectedAnswer : 'Not answered';
    const isCorrect = userResp ? userResp.isCorrect : selectedAnswer === q.correctAnswer;

    if (categoryTotals[q.category]) {
      categoryTotals[q.category].total += 1;
      if (isCorrect) {
        categoryTotals[q.category].score += 1;
      }
    }

    return {
      id: q.id,
      question: q.question,
      categoryLabel: q.categoryLabel,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });

  const categories: AssessmentCategoryDetail[] = Object.entries(categoryTotals).map(([key, data]) => ({
    key,
    label: data.label,
    score: data.score,
    total: data.total,
    percent: data.total > 0 ? Math.round((data.score / data.total) * 100) : 0,
  }));

  return {
    score,
    totalQuestions,
    percent,
    categories,
    questionDetails,
  };
}
