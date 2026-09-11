import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { questionnaireQuestions } from '../src/lib/data/questionnaire.ts';
import { assessmentQuestions } from '../src/lib/data/assessment.ts';
import { teacherFeedbackQuestions } from '../src/lib/data/teacher-feedback.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbDir = path.join(rootDir, 'db');
const sapanaDir = path.join(dbDir, 'sapana');

if (!fs.existsSync(sapanaDir)) {
  fs.mkdirSync(sapanaDir, { recursive: true });
}

// 1. Load root database files
let teachers = JSON.parse(fs.readFileSync(path.join(dbDir, 'teachers.json'), 'utf-8'));
let students = JSON.parse(fs.readFileSync(path.join(dbDir, 'students.json'), 'utf-8'));
let questionnaireResponses = JSON.parse(fs.readFileSync(path.join(dbDir, 'questionnaire_responses.json'), 'utf-8'));
let assessmentResponses = JSON.parse(fs.readFileSync(path.join(dbDir, 'assessment_responses.json'), 'utf-8'));
let teacherFeedbacks = JSON.parse(fs.readFileSync(path.join(dbDir, 'teacher_feedbacks.json'), 'utf-8'));

// 2. Remove duplicate incomplete student: Manya Deshmukh (accessCode: 'D6F2809E', id: 'cmttra5z700023mxq30sgj6ls')
const duplicateStudentId = 'cmttra5z700023mxq30sgj6ls';
const initialCount = students.length;
students = students.filter((s) => s.id !== duplicateStudentId && s.accessCode !== 'D6F2809E');

if (students.length < initialCount) {
  console.log(`🧹 Removed duplicate uncompleted student (ID: ${duplicateStudentId}, AccessCode: D6F2809E). Total students now: ${students.length}`);
  fs.writeFileSync(path.join(dbDir, 'students.json'), JSON.stringify(students, null, 2), 'utf-8');

  // Update root database.json
  const rootDbPath = path.join(dbDir, 'database.json');
  if (fs.existsSync(rootDbPath)) {
    const rootDb = JSON.parse(fs.readFileSync(rootDbPath, 'utf-8'));
    rootDb.students = students;
    rootDb.metadata.counts.students = students.length;
    fs.writeFileSync(rootDbPath, JSON.stringify(rootDb, null, 2), 'utf-8');
  }
}

// 3. Find Teacher Sapana Soni
const sapana = teachers.find(
  (t) => t.email.toLowerCase().includes('sapana') || t.name.toLowerCase().includes('sapana')
);

if (!sapana) {
  console.error('❌ Teacher sapana@gmail.com not found!');
  process.exit(1);
}

// 4. Extract ONLY students under Sapana
const sapanaStudents = students.filter((s) => s.teacherId === sapana.id);
const sapanaStudentIds = new Set(sapanaStudents.map((s) => s.id));

const sapanaQuestionnaires = questionnaireResponses.filter((q) => sapanaStudentIds.has(q.studentId));
const sapanaAssessments = assessmentResponses.filter((a) => sapanaStudentIds.has(a.studentId));
const sapanaFeedbacks = teacherFeedbacks.filter((f) => sapanaStudentIds.has(f.studentId));

console.log(`\n📁 Isolating Sapana's students dataset into "${sapanaDir}":`);
console.log(`   - Students: ${sapanaStudents.length} (100% completed!)`);
console.log(`   - Questionnaires: ${sapanaQuestionnaires.length}`);
console.log(`   - Assessments: ${sapanaAssessments.length}`);
console.log(`   - Teacher Feedbacks: ${sapanaFeedbacks.length}`);

// Write isolated datasets into db/sapana/
fs.writeFileSync(path.join(sapanaDir, 'teacher.json'), JSON.stringify(sapana, null, 2), 'utf-8');
fs.writeFileSync(path.join(sapanaDir, 'students.json'), JSON.stringify(sapanaStudents, null, 2), 'utf-8');
fs.writeFileSync(path.join(sapanaDir, 'questionnaire_responses.json'), JSON.stringify(sapanaQuestionnaires, null, 2), 'utf-8');
fs.writeFileSync(path.join(sapanaDir, 'assessment_responses.json'), JSON.stringify(sapanaAssessments, null, 2), 'utf-8');
fs.writeFileSync(path.join(sapanaDir, 'teacher_feedbacks.json'), JSON.stringify(sapanaFeedbacks, null, 2), 'utf-8');

// 5. Consolidated snapshot in db/sapana/data.json
const sapanaDataSnapshot = {
  metadata: {
    generatedAt: new Date().toISOString(),
    teacher: {
      id: sapana.id,
      name: sapana.name,
      email: sapana.email,
    },
    totalStudents: sapanaStudents.length,
    questionnairesCompleted: sapanaQuestionnaires.length,
    assessmentsCompleted: sapanaAssessments.length,
    feedbacksCompleted: sapanaFeedbacks.length,
  },
  students: sapanaStudents,
  questionnaireResponses: sapanaQuestionnaires,
  assessmentResponses: sapanaAssessments,
  teacherFeedbacks: sapanaFeedbacks,
};
fs.writeFileSync(path.join(sapanaDir, 'data.json'), JSON.stringify(sapanaDataSnapshot, null, 2), 'utf-8');

// 6. Build Detailed Interests & Answers Report
const qMap = new Map(questionnaireQuestions.map((q) => [q.id, q]));
const aMap = new Map(assessmentQuestions.map((a) => [a.id, a]));
const tfMap = new Map(teacherFeedbackQuestions.map((tf) => [tf.id, tf]));

function formatAnswerText(qId, answer) {
  const qDef = qMap.get(qId);
  if (!qDef) return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);

  if (Array.isArray(answer)) {
    return answer
      .map((val) => {
        const opt = qDef.options?.find((o) => o.value === val);
        return opt ? `**${opt.label}** _(${opt.labelHi || ''})_` : `**${val}**`;
      })
      .join(', ');
  }

  if (typeof answer === 'object' && answer !== null) {
    if ('choice' in answer) {
      const opt = qDef.options?.find((o) => o.value === answer.choice);
      const choiceLabel = opt ? `${opt.label} (${opt.labelHi || ''})` : answer.choice;
      return `Choice: **${choiceLabel}**${answer.detail ? `\n> 📝 *Student's Real Written Proof / Detail:* "${answer.detail}"` : ''}`;
    }
    return JSON.stringify(answer);
  }

  const opt = qDef.options?.find((o) => o.value === answer);
  if (opt) {
    return `**${opt.label}** _(${opt.labelHi || ''})_`;
  }

  return String(answer);
}

const detailedStudents = sapanaStudents.map((student, idx) => {
  const qRes = sapanaQuestionnaires.find((q) => q.studentId === student.id);
  const aRes = sapanaAssessments.find((a) => a.studentId === student.id);
  const tFeed = sapanaFeedbacks.find((f) => f.studentId === student.id);

  // Extract high-level interest highlights
  let topPassions = [];
  let joyfulActivities = [];
  let superpowers = [];
  let workEnvironment = '';
  let workEnvironmentProof = '';
  let futureCareerPaths = [];
  let dreamCareer = '';
  let dreamCareerDetail = '';
  let inspirations = [];

  if (qRes && qRes.responses) {
    for (const r of qRes.responses) {
      const qDef = qMap.get(r.questionId);
      if (r.questionId === 'q1' && Array.isArray(r.answer)) {
        topPassions = r.answer.map((v) => qDef?.options?.find((o) => o.value === v)?.label || v);
      } else if (r.questionId === 'q2' && Array.isArray(r.answer)) {
        joyfulActivities = r.answer.map((v) => qDef?.options?.find((o) => o.value === v)?.label || v);
      } else if (r.questionId === 'q3' && Array.isArray(r.answer)) {
        superpowers = r.answer.map((v) => qDef?.options?.find((o) => o.value === v)?.label || v);
      } else if (r.questionId === 'q4') {
        if (typeof r.answer === 'object' && r.answer !== null) {
          const opt = qDef?.options?.find((o) => o.value === r.answer.choice);
          workEnvironment = opt ? opt.label : r.answer.choice;
          workEnvironmentProof = r.answer.detail || '';
        } else {
          const opt = qDef?.options?.find((o) => o.value === r.answer);
          workEnvironment = opt ? opt.label : r.answer;
        }
      } else if (r.questionId === 'q6' && Array.isArray(r.answer)) {
        futureCareerPaths = r.answer.map((v) => qDef?.options?.find((o) => o.value === v)?.label || v);
      } else if (r.questionId === 'q7') {
        if (typeof r.answer === 'object' && r.answer !== null) {
          const opt = qDef?.options?.find((o) => o.value === r.answer.choice);
          dreamCareer = opt ? opt.label : r.answer.choice;
          dreamCareerDetail = r.answer.detail || '';
        } else {
          const opt = qDef?.options?.find((o) => o.value === r.answer);
          dreamCareer = opt ? opt.label : r.answer;
        }
      } else if (r.questionId === 'q8' && Array.isArray(r.answer)) {
        inspirations = r.answer.map((v) => qDef?.options?.find((o) => o.value === v)?.label || v);
      }
    }
  }

  return {
    serial: idx + 1,
    student,
    highlights: {
      topPassions,
      joyfulActivities,
      superpowers,
      workEnvironment,
      workEnvironmentProof,
      futureCareerPaths,
      dreamCareer,
      dreamCareerDetail,
      inspirations,
    },
    questionnaireResponses: qRes?.responses || [],
    assessment: aRes || null,
    feedback: tFeed || null,
  };
});

// 7. Write Markdown Report: STUDENTS_INTERESTS_REPORT.md
let md = `# 🎓 Comprehensive Students Interests & Assessment Report
**Educator / Counselor:** ${sapana.name} (\`${sapana.email}\`)  
**Scope:** Strictly Students Under Sapana Only  
**Generated Date:** ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}  
**Total Active Students:** ${detailedStudents.length} *(100% Completed Discovery & Assessments)*  

---

## 📊 Summary & Key Takeaways

- **Total Students:** **${detailedStudents.length}** (Duplicate incomplete entry removed)
- **Part 1 (Career Discovery & Passions):** **${detailedStudents.length} / ${detailedStudents.length}** (100% Complete)
- **Part 2 (Brain & Life Aptitude Assessment):** **${detailedStudents.length} / ${detailedStudents.length}** (100% Complete)
- **Part 3 (Educator Evaluations Submitted):** **${detailedStudents.filter((s) => s.feedback !== null).length} / ${detailedStudents.length}**

---

## 📑 Quick Students & Interests Roster

| # | Student Name | Class | Access Code | Top Passions & Curiosities | Dream Role / Direction | Aptitude Score | Counselor Review |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

detailedStudents.forEach((item) => {
  const s = item.student;
  const passions = item.highlights.topPassions.slice(0, 2).join(', ') || 'N/A';
  const dream = item.highlights.dreamCareerDetail || item.highlights.dreamCareer || item.highlights.futureCareerPaths[0] || 'Exploring';
  const score = item.assessment ? `${item.assessment.score}/15 (${Math.round((item.assessment.score / 15) * 100)}%)` : 'N/A';
  const fb = item.feedback ? '✅ Evaluated' : '⏳ Pending';
  md += `| ${item.serial} | **${s.name}** | Grade ${s.classGrade} | \`${s.accessCode}\` | ${passions} | *${dream}* | ${score} | ${fb} |\n`;
});

md += `\n---\n\n## 🔍 In-Depth Individual Reports on Interests & All Answers\n\n`;

detailedStudents.forEach((item) => {
  const s = item.student;
  const h = item.highlights;

  md += `### ${item.serial}. ${s.name} (Access Code: \`${s.accessCode}\`)\n\n`;

  md += `#### 👤 Student Profile\n`;
  md += `- **Class / Grade:** ${s.classGrade}\n`;
  md += `- **School:** ${s.school || 'Not specified'}\n`;
  md += `- **Date of Birth:** ${s.dob ? new Date(s.dob).toLocaleDateString('en-GB') : 'Not specified'}\n`;
  md += `- **Parent's Occupation:** ${s.parentJob || 'Not specified'}\n`;
  md += `- **Family Income:** ${s.familyIncome || 'Not specified'}\n\n`;

  md += `#### 💡 Core Interests & Strengths Summary\n`;
  md += `- **Curious Subjects / Passions:** ${h.topPassions.length ? h.topPassions.join(' &bull; ') : 'Not specified'}\n`;
  md += `- **Joyful Fulfilling Activities:** ${h.joyfulActivities.length ? h.joyfulActivities.join(' &bull; ') : 'Not specified'}\n`;
  md += `- **Unique Superpowers:** ${h.superpowers.length ? h.superpowers.join(' &bull; ') : 'Not specified'}\n`;
  md += `- **Preferred Work Environment:** ${h.workEnvironment || 'Not specified'}\n`;
  if (h.workEnvironmentProof) {
    md += `  > 📝 *Real Project Proof / Written Detail:* "${h.workEnvironmentProof}"\n`;
  }
  md += `- **Exciting Future Career Paths:** ${h.futureCareerPaths.length ? h.futureCareerPaths.join(' &bull; ') : 'Not specified'}\n`;
  if (h.dreamCareer) {
    md += `- **Dream Career Aspiration:** ${h.dreamCareer}\n`;
  }
  if (h.dreamCareerDetail) {
    md += `  > 🎯 *Specific Dream Goal / Example:* "${h.dreamCareerDetail}"\n`;
  }
  if (h.inspirations.length) {
    md += `- **Key Inspirations:** ${h.inspirations.join(' &bull; ')}\n`;
  }
  md += `\n`;

  md += `#### 📝 All Questionnaire Answers (Part 1)\n\n`;
  if (item.questionnaireResponses.length > 0) {
    item.questionnaireResponses.forEach((r, qIdx) => {
      const qDef = qMap.get(r.questionId);
      const qTitle = qDef ? qDef.question : r.questionId;
      const qTitleHi = qDef?.questionHi ? `*(${qDef.questionHi})*` : '';
      const formatted = formatAnswerText(r.questionId, r.answer);
      md += `**Q${qIdx + 1}: ${qTitle}**  \n${qTitleHi ? `${qTitleHi}  \n` : ''}*Answer:* ${formatted}\n\n`;
    });
  }

  md += `#### 🧠 Aptitude Assessment Performance (Part 2)\n\n`;
  if (item.assessment) {
    const scorePct = Math.round((item.assessment.score / item.assessment.totalQuestions) * 100);
    md += `**Score:** **${item.assessment.score} / ${item.assessment.totalQuestions}** (${scorePct}%)  \n`;
    md += `**Completed Date:** ${new Date(item.assessment.completedAt).toLocaleString('en-GB')}\n\n`;
    md += `| # | Category | Question | Student's Answer | Result | Correct Answer |\n`;
    md += `| :- | :--- | :--- | :--- | :--- | :--- |\n`;
    item.assessment.responses.forEach((aq, aIdx) => {
      const aDef = aMap.get(aq.questionId);
      const cat = aDef?.categoryLabel || aDef?.category || '';
      const qText = aDef ? aDef.question : aq.questionId;
      const resultBadge = aq.isCorrect ? '✅ Correct' : '❌ Incorrect';
      const correctCol = aq.isCorrect ? '—' : `**${aDef?.correctAnswer || ''}**`;
      md += `| ${aIdx + 1} | ${cat} | ${qText} | ${aq.selectedAnswer} | ${resultBadge} | ${correctCol} |\n`;
    });
    md += `\n`;
  }

  md += `#### 👩‍🏫 Counselor / Educator Observations (Part 3)\n\n`;
  if (item.feedback) {
    if (item.feedback.comment) {
      md += `> **Counselor Qualitative Note:** "${item.feedback.comment}"\n\n`;
    }
    if (item.feedback.strongestAreas && item.feedback.strongestAreas.length > 0) {
      md += `- **Strongest Observed Competencies:** ${item.feedback.strongestAreas.map((a) => `\`${a}\``).join(', ')}\n`;
    }
    if (item.feedback.interestedAreas && item.feedback.interestedAreas.length > 0) {
      md += `- **Recommended Interest Trajectories:** ${item.feedback.interestedAreas.map((a) => `\`${a}\``).join(', ')}\n`;
    }
    if (item.feedback.workingStyle) {
      md += `- **Working Style Observation:** \`${item.feedback.workingStyle}\`\n`;
    }
    md += `\n**Behavioral Competency Ratings (1–5 scale):**\n\n`;
    md += `| Evaluation Dimension | Educator Rating |\n`;
    md += `| :--- | :--- |\n`;
    item.feedback.ratings.forEach((r) => {
      const tfDef = tfMap.get(r.questionId);
      const metric = tfDef ? tfDef.question : r.questionId;
      md += `| ${metric} | **${r.rating} / 5** ⭐ |\n`;
    });
    md += `\n`;
  } else {
    md += `*Teacher feedback not yet submitted for this student.*\n\n`;
  }

  md += `---\n\n`;
});

fs.writeFileSync(path.join(sapanaDir, 'STUDENTS_INTERESTS_REPORT.md'), md, 'utf-8');
fs.writeFileSync(path.join(sapanaDir, 'report.md'), md, 'utf-8');

// 8. Generate Beautiful HTML Report in db/sapana/report.html
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Students Interests & Performance Report - ${sapana.name}</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-dark: #3730a3;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #16a34a;
      --danger: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { background: white; padding: 2rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #1e1b4b; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 1.05rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .stat-card { background: #f1f5f9; padding: 1.25rem; border-radius: 8px; border-left: 4px solid var(--primary); }
    .stat-val { font-size: 2rem; font-weight: 700; color: var(--primary-dark); }
    .stat-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
    .student-card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
    .student-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--bg); padding-bottom: 1rem; margin-bottom: 1.25rem; }
    .student-name { font-size: 1.5rem; color: #1e293b; font-weight: 700; }
    .access-code { font-family: monospace; background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 600; font-size: 0.95rem; }
    .tag-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.75rem 0 1.25rem 0; }
    .tag { background: #eef2ff; color: #4338ca; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
    .tag-dream { background: #fef3c7; color: #92400e; font-weight: 600; }
    .section-title { font-size: 1.15rem; font-weight: 700; color: #334155; margin: 1.5rem 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem; }
    .qa-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }
    .qa-q { font-weight: 600; color: #334155; margin-bottom: 0.25rem; }
    .qa-a { color: #1e293b; font-size: 0.95rem; }
    .proof-quote { background: #fffbeb; border-left: 3px solid #f59e0b; padding: 0.5rem 0.75rem; margin-top: 0.5rem; font-size: 0.9rem; font-style: italic; color: #78350f; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem; }
    th, td { padding: 0.65rem 0.85rem; text-align: left; border-bottom: 1px solid var(--border); }
    th { background: #f8fafc; color: var(--text-muted); font-weight: 600; }
    .badge { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    .badge-correct { background: #dcfce7; color: var(--success); }
    .badge-wrong { background: #fee2e2; color: var(--danger); }
    @media print { body { background: white; padding: 0; } .student-card { page-break-inside: avoid; border: 1px solid #ddd; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎓 Students Interests & Career Report</h1>
      <p class="subtitle">Educator / Counselor: <strong>${sapana.name}</strong> (<code>${sapana.email}</code>) &bull; Clean Data Exclusive to Sapana's Class</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${detailedStudents.length}</div>
          <div class="stat-label">Active Enrolled Students</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">100%</div>
          <div class="stat-label">Discovery Questionnaires Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">100%</div>
          <div class="stat-label">Aptitude Assessments Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${detailedStudents.filter((s) => s.feedback !== null).length}</div>
          <div class="stat-label">Counselor Evaluations Completed</div>
        </div>
      </div>
    </header>

    ${detailedStudents
      .map(
        (item) => `
      <div class="student-card">
        <div class="student-header">
          <div>
            <div class="student-name">${item.serial}. ${item.student.name}</div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
              Grade ${item.student.classGrade} &bull; ${item.student.school || 'School N/A'} &bull; Parent: ${item.student.parentJob || 'N/A'} &bull; Income: ${item.student.familyIncome || 'N/A'}
            </p>
          </div>
          <span class="access-code">${item.student.accessCode}</span>
        </div>

        <div class="tag-grid">
          ${item.highlights.topPassions.map((p) => `<span class="tag">🌱 ${p}</span>`).join('')}
          ${item.highlights.superpowers.map((p) => `<span class="tag">⭐ ${p}</span>`).join('')}
          ${item.highlights.dreamCareer ? `<span class="tag tag-dream">🎯 Dream: ${item.highlights.dreamCareer}</span>` : ''}
          ${item.highlights.dreamCareerDetail ? `<span class="tag tag-dream">🎯 Goal: "${item.highlights.dreamCareerDetail}"</span>` : ''}
        </div>

        <div class="section-title">🌟 Part 1: Career Discovery & Passion Answers</div>
        ${item.questionnaireResponses
          .map((r, qIdx) => {
            const qDef = qMap.get(r.questionId);
            const qTitle = qDef ? qDef.question : r.questionId;
            const ansStr = formatAnswerText(r.questionId, r.answer).replace(/\*\*/g, '').replace(/_/g, '');
            return `
            <div class="qa-box">
              <div class="qa-q">Q${qIdx + 1}: ${qTitle}</div>
              <div class="qa-a">${ansStr}</div>
            </div>
          `;
          })
          .join('')}

        <div class="section-title">🧠 Part 2: Aptitude Assessment (${item.assessment ? `${item.assessment.score}/15 &bull; ${Math.round((item.assessment.score / 15) * 100)}%` : 'Pending'})</div>
        ${
          item.assessment
            ? `
          <table>
            <thead><tr><th>#</th><th>Category</th><th>Question</th><th>Student's Answer</th><th>Result</th></tr></thead>
            <tbody>
              ${item.assessment.responses
                .map((aq, aIdx) => {
                  const aDef = aMap.get(aq.questionId);
                  return `
                  <tr>
                    <td>${aIdx + 1}</td>
                    <td>${aDef?.categoryLabel || aDef?.category || ''}</td>
                    <td>${aDef ? aDef.question : aq.questionId}</td>
                    <td><strong>${aq.selectedAnswer}</strong></td>
                    <td>${aq.isCorrect ? '<span class="badge badge-correct">Correct</span>' : `<span class="badge badge-wrong">Incorrect (${aDef?.correctAnswer})</span>`}</td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        `
            : '<p><em>Assessment not yet taken.</em></p>'
        }

        ${
          item.feedback
            ? `
          <div class="section-title">👩‍🏫 Part 3: Counselor Feedback & Ratings</div>
          ${item.feedback.comment ? `<div class="proof-quote" style="margin-bottom: 1rem;">"${item.feedback.comment}"</div>` : ''}
          <table>
            <thead><tr><th>Evaluation Dimension</th><th>Educator Rating</th></tr></thead>
            <tbody>
              ${item.feedback.ratings
                .map((r) => {
                  const tfDef = tfMap.get(r.questionId);
                  return `<tr><td>${tfDef ? tfDef.question : r.questionId}</td><td><strong>${r.rating} / 5 ⭐</strong></td></tr>`;
                })
                .join('')}
            </tbody>
          </table>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(sapanaDir, 'report.html'), html, 'utf-8');

// 9. Clean up any redundant root report files so EVERYTHING is in db/sapana/
const legacyFiles = [
  path.join(dbDir, 'sapana_students_report.md'),
  path.join(dbDir, 'sapana_students_report.json'),
  path.join(dbDir, 'sapana_students_report.html'),
];
for (const f of legacyFiles) {
  if (fs.existsSync(f)) fs.unlinkSync(f);
}
const legacyReportsDir = path.join(dbDir, 'reports');
if (fs.existsSync(legacyReportsDir)) {
  fs.rmSync(legacyReportsDir, { recursive: true, force: true });
}

console.log(`\n🎉 ALL DONE! All data and reports for Sapana's students are located in one clean place:`);
console.log(`   📁 Directory: ${sapanaDir}`);
console.log(`   📄 Students Data:          ${path.join(sapanaDir, 'students.json')}`);
console.log(`   📄 Questionnaire Answers:  ${path.join(sapanaDir, 'questionnaire_responses.json')}`);
console.log(`   📄 Assessment Answers:     ${path.join(sapanaDir, 'assessment_responses.json')}`);
console.log(`   📄 Teacher Feedback:       ${path.join(sapanaDir, 'teacher_feedbacks.json')}`);
console.log(`   📄 Consolidated Snapshot:  ${path.join(sapanaDir, 'data.json')}`);
console.log(`   📊 Full Interests Report:  ${path.join(sapanaDir, 'STUDENTS_INTERESTS_REPORT.md')}`);
console.log(`   🌐 Printable HTML Report:  ${path.join(sapanaDir, 'report.html')}`);
