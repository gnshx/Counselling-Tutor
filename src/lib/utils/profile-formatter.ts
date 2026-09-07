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

export function getTeacherWorkingStyleLabel(val?: string | null, lang: 'en' | 'hi' = 'en'): string {
  if (!val) return lang === 'hi' ? 'मूल्यांकन नहीं हुआ' : 'Not assessed';
  if (val === 'both') {
    return lang === 'hi'
      ? 'दोनों में सहज (समूह कार्य एवं व्यक्तिगत कार्य)'
      : 'Comfortable with both (Group Work & Solo Work)';
  }
  if (val === 'independent') {
    return lang === 'hi'
      ? 'अधिकतर व्यक्तिगत रूप से (स्वतंत्र कार्य)'
      : 'Mostly independent (Solo Work)';
  }
  if (val === 'group_based') {
    return lang === 'hi'
      ? 'अधिकतर समूह-आधारित (टीम सहयोग)'
      : 'Mostly group-based (Team Collaboration)';
  }
  if (val === 'depends') {
    return lang === 'hi'
      ? 'कार्य के संदर्भ पर निर्भर करता है'
      : 'Depends on the task context';
  }
  if (val === 'not_enough') {
    return lang === 'hi'
      ? 'पर्याप्त अवलोकन उपलब्ध नहीं'
      : 'Not enough observation';
  }
  const tf10 = teacherFeedbackQuestions.find((q) => q.id === 'tf10');
  const opt = tf10?.options?.find((o) => o.value === val);
  if (opt) {
    return lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label;
  }
  return val;
}

export function getTeacherAreaLabels(qId: 'tf8' | 'tf9', values?: string[] | null, lang: 'en' | 'hi' = 'en'): string[] {
  if (!values || !Array.isArray(values)) return [];
  const qDef = teacherFeedbackQuestions.find((q) => q.id === qId);
  return values.map((v) => {
    const opt = qDef?.options?.find((o) => o.value === v);
    if (opt) {
      return lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label;
    }
    return v.replace(/_/g, ' ');
  });
}

export function getQuestionnaireAnswerLabel(
  qId: string,
  ans: any,
  lang: 'en' | 'hi' = 'en'
): { label: string; detail?: string } {
  const question = questionnaireQuestions.find((q) => q.id === qId);
  if (!question) return { label: String(ans) };

  // Handle conditional/proof answer with object: { choice: 'with_group', detail: 'Science fair project' }
  if (ans && typeof ans === 'object' && !Array.isArray(ans)) {
    const choice = ans.choice || ans.value;
    const detail = ans.detail;
    if ('options' in question) {
      const opt = question.options.find((o) => o.value === choice);
      const label = opt ? (lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label) : String(choice);
      return { label, detail };
    }
    return { label: String(choice), detail };
  }

  if (Array.isArray(ans)) {
    const labels = ans.map((a) => {
      if ('options' in question) {
        const opt = question.options.find((o) => o.value === a);
        return opt ? (lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label) : a;
      }
      return a;
    });
    return { label: labels.join(', ') };
  }

  if (typeof ans === 'string' && 'options' in question) {
    const opt = question.options.find((o) => o.value === ans);
    if (opt) {
      return { label: lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label };
    }
  }

  return { label: String(ans) };
}

export function formatQuestionnaireResponse(
  responses: Array<{ questionId: string; answer: any }>,
  lang: 'en' | 'hi' = 'en'
): FormattedQuestionnaireData {
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
      return opt ? (lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label) : String(val);
    });
  };

  const getSingleLabel = (qId: string): string => {
    const ans = responseMap.get(qId);
    if (!ans) return lang === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered';
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
        const text = lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label;
        return detailVal
          ? `${text} (${lang === 'hi' ? 'उदा.' : 'Example'}: "${detailVal}")`
          : text;
      }
    }
    return String(choiceVal);
  };

  // q7 dream role
  const q7Ans = responseMap.get('q7');
  let dreamRoleObj = { choice: lang === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered', detail: undefined as string | undefined };
  if (q7Ans) {
    if (typeof q7Ans === 'object' && !Array.isArray(q7Ans)) {
      const parsed = getQuestionnaireAnswerLabel('q7', q7Ans.choice || q7Ans.value, lang);
      dreamRoleObj = { choice: parsed.label, detail: q7Ans.detail };
    } else {
      const parsed = getQuestionnaireAnswerLabel('q7', q7Ans, lang);
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

export function formatAssessmentResponse(
  assessmentResponse: {
    score: number;
    totalQuestions: number;
    responses?: Array<{ questionId: string; selectedAnswer: string; isCorrect: boolean }>;
  },
  lang: 'en' | 'hi' = 'en'
): FormattedAssessmentData {
  const score = assessmentResponse.score || 0;
  const totalQuestions = assessmentResponse.totalQuestions || 15;
  const percent = Math.round((score / totalQuestions) * 100);

  const responses = assessmentResponse.responses || [];
  const responseMap = new Map<string, { selectedAnswer: string; isCorrect: boolean }>();
  responses.forEach((r) => responseMap.set(r.questionId, r));

  const categoryTotals: Record<string, { label: string; score: number; total: number }> = {
    general_awareness: {
      label: lang === 'hi' ? '🌍 सामान्य जागरूकता' : '🌍 General Awareness',
      score: 0,
      total: 0,
    },
    basic_aptitude: {
      label: lang === 'hi' ? '🧮 बुनियादी अभिरुचि एवं योग्यता' : '🧮 Basic Aptitude',
      score: 0,
      total: 0,
    },
    practical_decision_making: {
      label: lang === 'hi' ? '💡 व्यावहारिक निर्णय क्षमता' : '💡 Practical Decision Making',
      score: 0,
      total: 0,
    },
  };

  const questionDetails = assessmentQuestions.map((q) => {
    const userResp = responseMap.get(q.id);
    const selectedAnswerRaw = userResp ? userResp.selectedAnswer : (lang === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered');
    const isCorrect = userResp ? userResp.isCorrect : selectedAnswerRaw === q.correctAnswer;

    let displaySelected = selectedAnswerRaw;
    if (lang === 'hi' && userResp) {
      const optIdx = q.options.indexOf(userResp.selectedAnswer);
      if (optIdx !== -1 && q.optionsHi && q.optionsHi[optIdx]) {
        displaySelected = q.optionsHi[optIdx];
      }
    }

    if (categoryTotals[q.category]) {
      categoryTotals[q.category].total += 1;
      if (isCorrect) {
        categoryTotals[q.category].score += 1;
      }
    }

    return {
      id: q.id,
      question: lang === 'hi' && q.questionHi ? q.questionHi : q.question,
      categoryLabel: lang === 'hi' && q.categoryLabelHi ? q.categoryLabelHi : q.categoryLabel,
      selectedAnswer: displaySelected,
      correctAnswer: lang === 'hi' && q.correctAnswerHi ? q.correctAnswerHi : q.correctAnswer,
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
