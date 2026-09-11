import fs from 'fs';
import path from 'path';

// Interfaces mirroring the database models
export interface Teacher {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  school: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Student {
  id: string;
  name: string;
  dob: string | Date;
  classGrade: string;
  school: string | null;
  parentJob: string | null;
  familyIncome: string | null;
  parentBackground: string | null;
  backgroundInfo: string | null;
  accessCode: string;
  questionnaireStatus: string;
  assessmentStatus: string;
  feedbackStatus: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  teacherId: string;
}

export interface QuestionnaireResponse {
  id: string;
  responses: any;
  completedAt: string | Date;
  studentId: string;
}

export interface AssessmentResponse {
  id: string;
  responses: any;
  score: number;
  totalQuestions: number;
  completedAt: string | Date;
  studentId: string;
}

export interface TeacherFeedback {
  id: string;
  ratings: any;
  strongestAreas?: any;
  interestedAreas?: any;
  workingStyle?: string | null;
  comment?: string | null;
  completedAt: string | Date;
  studentId: string;
  teacherId: string;
}

export interface DatabaseSnapshot {
  metadata: {
    exportedAt: string;
    source: string;
    counts: Record<string, number>;
  };
  teachers: Teacher[];
  students: Student[];
  questionnaireResponses: QuestionnaireResponse[];
  assessmentResponses: AssessmentResponse[];
  teacherFeedbacks: TeacherFeedback[];
}

function getDbDir(): string {
  if (process.env.LOCAL_DB_DIR) {
    const customPath = path.isAbsolute(process.env.LOCAL_DB_DIR)
      ? process.env.LOCAL_DB_DIR
      : path.join(/*turbopackIgnore: true*/ process.cwd(), process.env.LOCAL_DB_DIR);
    if (fs.existsSync(/*turbopackIgnore: true*/ customPath)) return customPath;
  }
  // Try process.cwd()/db first, then relative to this file
  const fromCwd = path.join(/*turbopackIgnore: true*/ process.cwd(), 'db');
  if (fs.existsSync(/*turbopackIgnore: true*/ fromCwd)) return fromCwd;
  return path.resolve(__dirname);
}

const fileMtimes = new Map<string, number>();

function shouldReloadFile(filename: string): boolean {
  try {
    const filePath = path.join(/*turbopackIgnore: true*/ getDbDir(), filename);
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) return false;
    const stat = fs.statSync(/*turbopackIgnore: true*/ filePath);
    const lastMtime = fileMtimes.get(filename);
    return lastMtime === undefined || stat.mtimeMs > lastMtime;
  } catch {
    return false;
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(/*turbopackIgnore: true*/ getDbDir(), filename);
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) return fallback;
    const stat = fs.statSync(/*turbopackIgnore: true*/ filePath);
    const content = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
    fileMtimes.set(filename, stat.mtimeMs);
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`[LocalDB] Error reading ${filename}:`, err);
    return fallback;
  }
}

// Atomic file write using temporary file + renameSync to eliminate partial reads & race collisions
function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const dir = getDbDir();
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    }
    const filePath = path.join(/*turbopackIgnore: true*/ dir, filename);
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(/*turbopackIgnore: true*/ tempPath, content, 'utf-8');
    fs.renameSync(/*turbopackIgnore: true*/ tempPath, /*turbopackIgnore: true*/ filePath);
    try {
      const stat = fs.statSync(/*turbopackIgnore: true*/ filePath);
      fileMtimes.set(filename, stat.mtimeMs);
    } catch {}
  } catch (err) {
    console.error(`[LocalDB] Error writing ${filename}:`, err);
  }
}

// In-memory caches to allow high-performance read/write
let cachedTeachers: Teacher[] | null = null;
let cachedStudents: Student[] | null = null;
let cachedQuestionnaires: QuestionnaireResponse[] | null = null;
let cachedAssessments: AssessmentResponse[] | null = null;
let cachedFeedbacks: TeacherFeedback[] | null = null;

// ==========================================
// Direct Fetching Functions (Auto-revalidating across workers)
// ==========================================

export function getTeachers(): Teacher[] {
  if (!cachedTeachers || shouldReloadFile('teachers.json')) {
    cachedTeachers = readJsonFile<Teacher[]>('teachers.json', []);
  }
  return cachedTeachers;
}

export function findTeacherById(id: string): Teacher | undefined {
  return getTeachers().find((t) => t.id === id);
}

export function findTeacherByEmail(email: string): Teacher | undefined {
  const clean = email.trim().toLowerCase();
  return getTeachers().find((t) => t.email.toLowerCase() === clean);
}

export function getStudents(): Student[] {
  if (!cachedStudents || shouldReloadFile('students.json')) {
    cachedStudents = readJsonFile<Student[]>('students.json', []);
  }
  return cachedStudents;
}

export function findStudentById(id: string, includeRelations = false): any {
  const student = getStudents().find((s) => s.id === id);
  if (!student) return null;
  if (!includeRelations) return student;

  const questionnaireResponse = getQuestionnaireResponses().find((q) => q.studentId === id) || null;
  const assessmentResponse = getAssessmentResponses().find((a) => a.studentId === id) || null;
  const teacherFeedback = getTeacherFeedbacks().find((f) => f.studentId === id) || null;

  return {
    ...student,
    questionnaireResponse,
    assessmentResponse,
    teacherFeedback,
  };
}

export function findStudentByAccessCode(accessCode: string): Student | undefined {
  const code = accessCode.trim().toUpperCase();
  return getStudents().find((s) => s.accessCode.toUpperCase() === code);
}

export function getStudentsByTeacherId(
  teacherId: string,
  filter?: { search?: string; classFilter?: string }
): Student[] {
  let list = getStudents().filter((s) => s.teacherId === teacherId);

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q));
  }

  if (filter?.classFilter) {
    list = list.filter((s) => s.classGrade === filter.classFilter);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getQuestionnaireResponses(): QuestionnaireResponse[] {
  if (!cachedQuestionnaires || shouldReloadFile('questionnaire_responses.json')) {
    cachedQuestionnaires = readJsonFile<QuestionnaireResponse[]>('questionnaire_responses.json', []);
  }
  return cachedQuestionnaires;
}

export function getQuestionnaireResponseByStudentId(studentId: string): QuestionnaireResponse | undefined {
  return getQuestionnaireResponses().find((q) => q.studentId === studentId);
}

export function getAssessmentResponses(): AssessmentResponse[] {
  if (!cachedAssessments || shouldReloadFile('assessment_responses.json')) {
    cachedAssessments = readJsonFile<AssessmentResponse[]>('assessment_responses.json', []);
  }
  return cachedAssessments;
}

export function getAssessmentResponseByStudentId(studentId: string): AssessmentResponse | undefined {
  return getAssessmentResponses().find((a) => a.studentId === studentId);
}

export function getTeacherFeedbacks(): TeacherFeedback[] {
  if (!cachedFeedbacks || shouldReloadFile('teacher_feedbacks.json')) {
    cachedFeedbacks = readJsonFile<TeacherFeedback[]>('teacher_feedbacks.json', []);
  }
  return cachedFeedbacks;
}

export function getTeacherFeedbackByStudentId(studentId: string): TeacherFeedback | undefined {
  return getTeacherFeedbacks().find((f) => f.studentId === studentId);
}

export function getDatabaseSnapshot(): DatabaseSnapshot {
  return readJsonFile<DatabaseSnapshot>('database.json', {
    metadata: {
      exportedAt: new Date().toISOString(),
      source: 'Local JSON',
      counts: {},
    },
    teachers: getTeachers(),
    students: getStudents(),
    questionnaireResponses: getQuestionnaireResponses(),
    assessmentResponses: getAssessmentResponses(),
    teacherFeedbacks: getTeacherFeedbacks(),
  });
}

// ==========================================
// Persistence Write Helpers & Snapshot Synchronization
// ==========================================

let snapshotTimer: NodeJS.Timeout | null = null;

export function scheduleDatabaseSnapshot(): void {
  if (snapshotTimer) clearTimeout(snapshotTimer);
  snapshotTimer = setTimeout(() => {
    updateDatabaseJson();
  }, 1000);
}

export function updateDatabaseJson(): void {
  try {
    const teachers = getTeachers();
    const students = getStudents();
    const questionnaireResponses = getQuestionnaireResponses();
    const assessmentResponses = getAssessmentResponses();
    const teacherFeedbacks = getTeacherFeedbacks();

    const snapshot: DatabaseSnapshot = {
      metadata: {
        exportedAt: new Date().toISOString(),
        source: 'Local JSON DB',
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
    writeJsonFile('database.json', snapshot);
  } catch (err) {
    console.error('[LocalDB] Error updating database.json snapshot:', err);
  }
}

export function saveTeacher(teacher: Teacher): Teacher {
  const teachers = [...getTeachers()];
  const idx = teachers.findIndex((t) => t.id === teacher.id);
  if (idx >= 0) {
    teachers[idx] = { ...teachers[idx], ...teacher, updatedAt: new Date().toISOString() };
  } else {
    teachers.push(teacher);
  }
  cachedTeachers = teachers;
  writeJsonFile('teachers.json', teachers);
  scheduleDatabaseSnapshot();
  return teacher;
}

export function saveStudent(student: Student): Student {
  const students = [...getStudents()];
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = { ...students[idx], ...student, updatedAt: new Date().toISOString() };
  } else {
    students.push(student);
  }
  cachedStudents = students;
  writeJsonFile('students.json', students);
  scheduleDatabaseSnapshot();
  return student;
}

export function deleteStudent(studentId: string): boolean {
  const students = getStudents();
  const remaining = students.filter((s) => s.id !== studentId);
  if (remaining.length === students.length) return false;

  cachedStudents = remaining;
  writeJsonFile('students.json', remaining);

  // Cascade delete questionnaire responses
  const qrs = getQuestionnaireResponses().filter((q) => q.studentId !== studentId);
  cachedQuestionnaires = qrs;
  writeJsonFile('questionnaire_responses.json', qrs);

  // Cascade delete assessment responses
  const ars = getAssessmentResponses().filter((a) => a.studentId !== studentId);
  cachedAssessments = ars;
  writeJsonFile('assessment_responses.json', ars);

  // Cascade delete teacher feedbacks
  const tfs = getTeacherFeedbacks().filter((f) => f.studentId !== studentId);
  cachedFeedbacks = tfs;
  writeJsonFile('teacher_feedbacks.json', tfs);

  scheduleDatabaseSnapshot();
  return true;
}

export function saveQuestionnaireResponse(data: QuestionnaireResponse): QuestionnaireResponse {
  const items = [...getQuestionnaireResponses()];
  const idx = items.findIndex((q) => q.studentId === data.studentId);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...data };
  } else {
    items.push(data);
  }
  cachedQuestionnaires = items;
  writeJsonFile('questionnaire_responses.json', items);
  scheduleDatabaseSnapshot();
  return data;
}

export function saveAssessmentResponse(data: AssessmentResponse): AssessmentResponse {
  const items = [...getAssessmentResponses()];
  const idx = items.findIndex((a) => a.studentId === data.studentId);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...data };
  } else {
    items.push(data);
  }
  cachedAssessments = items;
  writeJsonFile('assessment_responses.json', items);
  scheduleDatabaseSnapshot();
  return data;
}

export function saveTeacherFeedback(data: TeacherFeedback): TeacherFeedback {
  const items = [...getTeacherFeedbacks()];
  const idx = items.findIndex((f) => f.studentId === data.studentId);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...data };
  } else {
    items.push(data);
  }
  cachedFeedbacks = items;
  writeJsonFile('teacher_feedbacks.json', items);
  scheduleDatabaseSnapshot();
  return data;
}

// Generate simple CUID-like ID
function generateId(prefix = 'c'): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
}

// Helper to filter objects matching Prisma 'where' clause
function matchesWhere(item: any, where: any): boolean {
  if (!where) return true;
  for (const [key, val] of Object.entries(where)) {
    if (val === undefined) continue;

    if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      const obj = val as Record<string, any>;
      if ('contains' in obj) {
        const itemVal = String(item[key] || '');
        const target = String(obj.contains || '');
        if (obj.mode === 'insensitive') {
          if (!itemVal.toLowerCase().includes(target.toLowerCase())) return false;
        } else {
          if (!itemVal.includes(target)) return false;
        }
        continue;
      }
      if ('equals' in obj) {
        if (item[key] !== obj.equals) return false;
        continue;
      }
      if ('not' in obj) {
        if (item[key] === obj.not) return false;
        continue;
      }
    }

    if (item[key] !== val) {
      return false;
    }
  }
  return true;
}

function applySelect(item: any, select?: Record<string, boolean>): any {
  if (!select) return item;
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(select)) {
    if (v) result[k] = item[k];
  }
  return result;
}

// ==========================================
// Prisma-Compatible Local Client Interface
// ==========================================

export const localDb = {
  teacher: {
    async findUnique({ where, select }: { where: { id?: string; email?: string }; select?: any }) {
      const teachers = getTeachers();
      let match: Teacher | undefined;
      if (where.id) match = teachers.find((t) => t.id === where.id);
      else if (where.email) match = teachers.find((t) => t.email.toLowerCase() === where.email?.toLowerCase());
      if (!match) return null;
      return applySelect(match, select);
    },
    async findFirst(args?: { where?: any; select?: any }) {
      const teachers = getTeachers();
      const match = teachers.find((t) => matchesWhere(t, args?.where));
      if (!match) return null;
      return applySelect(match, args?.select);
    },
    async findMany(args?: { where?: any; orderBy?: any; select?: any }) {
      let list = getTeachers().filter((t) => matchesWhere(t, args?.where));
      if (args?.select) list = list.map((t) => applySelect(t, args?.select));
      return list;
    },
    async create({ data }: { data: any }) {
      const newTeacher: Teacher = {
        id: data.id || generateId('cm'),
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        school: data.school || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return saveTeacher(newTeacher);
    },
  },

  student: {
    async findUnique({ where, select, include }: { where: { id?: string; accessCode?: string }; select?: any; include?: any }) {
      const students = getStudents();
      let match: Student | undefined;
      if (where.id) match = students.find((s) => s.id === where.id);
      else if (where.accessCode) {
        const code = where.accessCode.trim().toUpperCase();
        match = students.find((s) => s.accessCode.toUpperCase() === code);
      }
      if (!match) return null;

      let result: any = { ...match };
      if (include) {
        if (include.questionnaireResponse) {
          result.questionnaireResponse = getQuestionnaireResponses().find((q) => q.studentId === match?.id) || null;
        }
        if (include.assessmentResponse) {
          result.assessmentResponse = getAssessmentResponses().find((a) => a.studentId === match?.id) || null;
        }
        if (include.teacherFeedback) {
          result.teacherFeedback = getTeacherFeedbacks().find((f) => f.studentId === match?.id) || null;
        }
      }

      return applySelect(result, select);
    },
    async findFirst({ where, select, include }: { where?: any; select?: any; include?: any }) {
      const students = getStudents();
      const match = students.find((s) => matchesWhere(s, where));
      if (!match) return null;

      let result: any = { ...match };
      if (include) {
        if (include.questionnaireResponse) {
          result.questionnaireResponse = getQuestionnaireResponses().find((q) => q.studentId === match.id) || null;
        }
        if (include.assessmentResponse) {
          result.assessmentResponse = getAssessmentResponses().find((a) => a.studentId === match.id) || null;
        }
        if (include.teacherFeedback) {
          result.teacherFeedback = getTeacherFeedbacks().find((f) => f.studentId === match.id) || null;
        }
      }

      return applySelect(result, select);
    },
    async findMany(args?: { where?: any; orderBy?: any; select?: any; include?: any }) {
      let list = getStudents().filter((s) => matchesWhere(s, args?.where));

      if (args?.orderBy?.createdAt === 'desc') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (args?.orderBy?.createdAt === 'asc') {
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      if (args?.include) {
        // Build O(1) lookup Maps to eliminate O(N * M) linear scans
        const qrMap = args.include?.questionnaireResponse
          ? new Map(getQuestionnaireResponses().map((q) => [q.studentId, q]))
          : null;
        const arMap = args.include?.assessmentResponse
          ? new Map(getAssessmentResponses().map((a) => [a.studentId, a]))
          : null;
        const tfMap = args.include?.teacherFeedback
          ? new Map(getTeacherFeedbacks().map((f) => [f.studentId, f]))
          : null;

        return list.map((s) => {
          const item: any = { ...s };
          if (qrMap) {
            const qr = qrMap.get(s.id);
            if (qr && typeof args.include.questionnaireResponse === 'object' && args.include.questionnaireResponse.select) {
              item.questionnaireResponse = applySelect(qr, args.include.questionnaireResponse.select);
            } else {
              item.questionnaireResponse = qr || null;
            }
          }
          if (arMap) {
            const ar = arMap.get(s.id);
            if (ar && typeof args.include.assessmentResponse === 'object' && args.include.assessmentResponse.select) {
              item.assessmentResponse = applySelect(ar, args.include.assessmentResponse.select);
            } else {
              item.assessmentResponse = ar || null;
            }
          }
          if (tfMap) {
            const tf = tfMap.get(s.id);
            if (tf && typeof args.include.teacherFeedback === 'object' && args.include.teacherFeedback.select) {
              item.teacherFeedback = applySelect(tf, args.include.teacherFeedback.select);
            } else {
              item.teacherFeedback = tf || null;
            }
          }
          return item;
        });
      }

      if (args?.select) {
        return list.map((s) => applySelect(s, args?.select));
      }

      return list;
    },
    async create({ data }: { data: any }) {
      const newStudent: Student = {
        id: data.id || generateId('cm'),
        name: data.name,
        dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
        classGrade: data.classGrade,
        school: data.school || null,
        parentJob: data.parentJob || null,
        familyIncome: data.familyIncome || null,
        parentBackground: data.parentBackground || null,
        backgroundInfo: data.backgroundInfo || null,
        accessCode: data.accessCode,
        questionnaireStatus: data.questionnaireStatus || 'not_started',
        assessmentStatus: data.assessmentStatus || 'not_started',
        feedbackStatus: data.feedbackStatus || 'not_started',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teacherId: data.teacherId,
      };
      return saveStudent(newStudent);
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const students = getStudents();
      const existing = students.find((s) => s.id === where.id);
      if (!existing) throw new Error(`Student ${where.id} not found`);
      const updated: Student = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return saveStudent(updated);
    },
    async delete({ where }: { where: { id: string } }) {
      const student = getStudents().find((s) => s.id === where.id);
      if (!student) throw new Error(`Student ${where.id} not found`);
      deleteStudent(where.id);
      return student;
    },
    async deleteMany({ where }: { where?: any }) {
      const toDelete = getStudents().filter((s) => matchesWhere(s, where));
      for (const s of toDelete) {
        deleteStudent(s.id);
      }
      return { count: toDelete.length };
    },
  },

  questionnaireResponse: {
    async findUnique({ where }: { where: { studentId?: string; id?: string } }) {
      const list = getQuestionnaireResponses();
      if (where.studentId) return list.find((q) => q.studentId === where.studentId) || null;
      if (where.id) return list.find((q) => q.id === where.id) || null;
      return null;
    },
    async findMany(args?: { where?: any }) {
      return getQuestionnaireResponses().filter((q) => matchesWhere(q, args?.where));
    },
    async upsert({ where, update, create }: { where: { studentId: string }; update: any; create: any }) {
      const list = getQuestionnaireResponses();
      const existing = list.find((q) => q.studentId === where.studentId);
      if (existing) {
        const updated = {
          ...existing,
          ...update,
          completedAt: new Date().toISOString(),
        };
        return saveQuestionnaireResponse(updated);
      } else {
        const created: QuestionnaireResponse = {
          id: generateId('cm'),
          studentId: where.studentId,
          responses: create.responses,
          completedAt: new Date().toISOString(),
        };
        return saveQuestionnaireResponse(created);
      }
    },
  },

  assessmentResponse: {
    async findUnique({ where }: { where: { studentId?: string; id?: string } }) {
      const list = getAssessmentResponses();
      if (where.studentId) return list.find((a) => a.studentId === where.studentId) || null;
      if (where.id) return list.find((a) => a.id === where.id) || null;
      return null;
    },
    async findMany(args?: { where?: any }) {
      return getAssessmentResponses().filter((a) => matchesWhere(a, args?.where));
    },
    async upsert({ where, update, create }: { where: { studentId: string }; update: any; create: any }) {
      const list = getAssessmentResponses();
      const existing = list.find((a) => a.studentId === where.studentId);
      if (existing) {
        const updated = {
          ...existing,
          ...update,
          completedAt: new Date().toISOString(),
        };
        return saveAssessmentResponse(updated);
      } else {
        const created: AssessmentResponse = {
          id: generateId('cm'),
          studentId: where.studentId,
          responses: create.responses,
          score: create.score ?? 0,
          totalQuestions: create.totalQuestions ?? 15,
          completedAt: new Date().toISOString(),
        };
        return saveAssessmentResponse(created);
      }
    },
  },

  teacherFeedback: {
    async findUnique({ where }: { where: { studentId?: string; id?: string } }) {
      const list = getTeacherFeedbacks();
      if (where.studentId) return list.find((f) => f.studentId === where.studentId) || null;
      if (where.id) return list.find((f) => f.id === where.id) || null;
      return null;
    },
    async findMany(args?: { where?: any }) {
      return getTeacherFeedbacks().filter((f) => matchesWhere(f, args?.where));
    },
    async upsert({ where, update, create }: { where: { studentId: string }; update: any; create: any }) {
      const list = getTeacherFeedbacks();
      const existing = list.find((f) => f.studentId === where.studentId);
      if (existing) {
        const updated = {
          ...existing,
          ...update,
          completedAt: new Date().toISOString(),
        };
        return saveTeacherFeedback(updated);
      } else {
        const created: TeacherFeedback = {
          id: generateId('cm'),
          studentId: where.studentId,
          teacherId: create.teacherId,
          ratings: create.ratings,
          strongestAreas: create.strongestAreas || null,
          interestedAreas: create.interestedAreas || null,
          workingStyle: create.workingStyle || null,
          comment: create.comment || null,
          completedAt: new Date().toISOString(),
        };
        return saveTeacherFeedback(created);
      }
    },
  },

  async $disconnect() {
    // No-op for local database
  },
};
