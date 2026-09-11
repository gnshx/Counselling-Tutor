import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbDir = path.join(rootDir, 'db');

const prisma = new PrismaClient();

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function exportData() {
  console.log('🔄 Connecting to Supabase and fetching data...');

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const teachers = await prisma.teacher.findMany({ orderBy: { createdAt: 'asc' } });
  const students = await prisma.student.findMany({ orderBy: { createdAt: 'asc' } });
  const questionnaireResponses = await prisma.questionnaireResponse.findMany({ orderBy: { completedAt: 'asc' } });
  const assessmentResponses = await prisma.assessmentResponse.findMany({ orderBy: { completedAt: 'asc' } });
  const teacherFeedbacks = await prisma.teacherFeedback.findMany({ orderBy: { completedAt: 'asc' } });

  console.log(`📊 Retrieved from Supabase:
  - Teachers: ${teachers.length}
  - Students: ${students.length}
  - Questionnaire Responses: ${questionnaireResponses.length}
  - Assessment Responses: ${assessmentResponses.length}
  - Teacher Feedbacks: ${teacherFeedbacks.length}
  `);

  // 1. Write individual JSON files
  fs.writeFileSync(path.join(dbDir, 'teachers.json'), JSON.stringify(teachers, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dbDir, 'students.json'), JSON.stringify(students, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dbDir, 'questionnaire_responses.json'), JSON.stringify(questionnaireResponses, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dbDir, 'assessment_responses.json'), JSON.stringify(assessmentResponses, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dbDir, 'teacher_feedbacks.json'), JSON.stringify(teacherFeedbacks, null, 2), 'utf-8');

  // 2. Write consolidated database.json
  const consolidated = {
    metadata: {
      exportedAt: new Date().toISOString(),
      source: 'Supabase PostgreSQL',
      counts: {
        teachers: teachers.length,
        students: students.length,
        questionnaireResponses: questionnaireResponses.length,
        assessmentResponses: assessmentResponses.length,
        teacherFeedbacks: teacherFeedbacks.length,
      },
    },
    teachers,
    students,
    questionnaireResponses,
    assessmentResponses,
    teacherFeedbacks,
  };
  fs.writeFileSync(path.join(dbDir, 'database.json'), JSON.stringify(consolidated, null, 2), 'utf-8');

  // 3. Write SQL seed file for PostgreSQL restoration
  let sql = `-- Supabase Export SQL Seed
-- Generated on: ${new Date().toISOString()}

BEGIN;

`;

  for (const t of teachers) {
    sql += `INSERT INTO "Teacher" ("id", "name", "email", "passwordHash", "school", "createdAt", "updatedAt")
VALUES (${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.email)}, ${escapeSql(t.passwordHash)}, ${escapeSql(t.school)}, ${escapeSql(t.createdAt)}, ${escapeSql(t.updatedAt)})
ON CONFLICT ("id") DO NOTHING;\n`;
  }

  sql += '\n';

  for (const s of students) {
    sql += `INSERT INTO "Student" ("id", "name", "dob", "classGrade", "school", "parentJob", "familyIncome", "parentBackground", "backgroundInfo", "accessCode", "questionnaireStatus", "assessmentStatus", "feedbackStatus", "createdAt", "updatedAt", "teacherId")
VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.dob)}, ${escapeSql(s.classGrade)}, ${escapeSql(s.school)}, ${escapeSql(s.parentJob)}, ${escapeSql(s.familyIncome)}, ${escapeSql(s.parentBackground)}, ${escapeSql(s.backgroundInfo)}, ${escapeSql(s.accessCode)}, ${escapeSql(s.questionnaireStatus)}, ${escapeSql(s.assessmentStatus)}, ${escapeSql(s.feedbackStatus)}, ${escapeSql(s.createdAt)}, ${escapeSql(s.updatedAt)}, ${escapeSql(s.teacherId)})
ON CONFLICT ("id") DO NOTHING;\n`;
  }

  sql += '\n';

  for (const q of questionnaireResponses) {
    sql += `INSERT INTO "QuestionnaireResponse" ("id", "responses", "completedAt", "studentId")
VALUES (${escapeSql(q.id)}, ${escapeSql(q.responses)}, ${escapeSql(q.completedAt)}, ${escapeSql(q.studentId)})
ON CONFLICT ("id") DO NOTHING;\n`;
  }

  sql += '\n';

  for (const a of assessmentResponses) {
    sql += `INSERT INTO "AssessmentResponse" ("id", "responses", "score", "totalQuestions", "completedAt", "studentId")
VALUES (${escapeSql(a.id)}, ${escapeSql(a.responses)}, ${escapeSql(a.score)}, ${escapeSql(a.totalQuestions)}, ${escapeSql(a.completedAt)}, ${escapeSql(a.studentId)})
ON CONFLICT ("id") DO NOTHING;\n`;
  }

  sql += '\n';

  for (const f of teacherFeedbacks) {
    sql += `INSERT INTO "TeacherFeedback" ("id", "ratings", "strongestAreas", "interestedAreas", "workingStyle", "comment", "completedAt", "studentId", "teacherId")
VALUES (${escapeSql(f.id)}, ${escapeSql(f.ratings)}, ${escapeSql(f.strongestAreas)}, ${escapeSql(f.interestedAreas)}, ${escapeSql(f.workingStyle)}, ${escapeSql(f.comment)}, ${escapeSql(f.completedAt)}, ${escapeSql(f.studentId)}, ${escapeSql(f.teacherId)})
ON CONFLICT ("id") DO NOTHING;\n`;
  }

  sql += '\nCOMMIT;\n';

  fs.writeFileSync(path.join(dbDir, 'seed.sql'), sql, 'utf-8');

  console.log(`✅ Successfully exported all data to "${dbDir}":`);
  console.log(`   - teachers.json (${teachers.length} records)`);
  console.log(`   - students.json (${students.length} records)`);
  console.log(`   - questionnaire_responses.json (${questionnaireResponses.length} records)`);
  console.log(`   - assessment_responses.json (${assessmentResponses.length} records)`);
  console.log(`   - teacher_feedbacks.json (${teacherFeedbacks.length} records)`);
  console.log(`   - database.json (all tables + metadata)`);
  console.log(`   - seed.sql (SQL restoration script)`);
}

exportData()
  .catch((err) => {
    console.error('❌ Failed to export from Supabase:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
