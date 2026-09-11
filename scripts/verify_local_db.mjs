import {
  getTeachers,
  getStudents,
  findStudentByAccessCode,
  findTeacherByEmail,
  localDb,
} from '../db/index.ts';

async function verify() {
  console.log('🧪 Verifying local db/ fetching...');

  // 1. Direct functions
  const teachers = getTeachers();
  console.log(`✅ getTeachers(): found ${teachers.length} teachers`);
  if (teachers.length !== 4) throw new Error(`Expected 4 teachers, got ${teachers.length}`);

  const students = getStudents();
  console.log(`✅ getStudents(): found ${students.length} students`);
  if (students.length !== 33) throw new Error(`Expected 33 students, got ${students.length}`);

  const teacher = findTeacherByEmail('shiva@gmail.com');
  console.log(`✅ findTeacherByEmail('shiva@gmail.com'):`, teacher?.name, teacher?.email);
  if (!teacher) throw new Error('Teacher shiva@gmail.com not found');

  const student = findStudentByAccessCode('AEA5F3A0');
  console.log(`✅ findStudentByAccessCode('AEA5F3A0'):`, student?.name, `(Grade ${student?.classGrade})`);
  if (!student || student.name !== 'ganesh') throw new Error('Student ganesh (AEA5F3A0) not found');

  // 2. Prisma-compatible localDb client
  const foundStudents = await localDb.student.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'desc' },
    include: {
      questionnaireResponse: { select: { id: true, completedAt: true } },
      assessmentResponse: { select: { id: true, score: true } },
      teacherFeedback: { select: { id: true, completedAt: true } },
    },
  });
  console.log(`✅ localDb.student.findMany({ where: { teacherId } }): found ${foundStudents.length} students for teacher ${teacher.name}`);
  console.log('Sample student with relations:', {
    name: foundStudents[0]?.name,
    accessCode: foundStudents[0]?.accessCode,
    hasQuestionnaire: !!foundStudents[0]?.questionnaireResponse,
    hasAssessment: !!foundStudents[0]?.assessmentResponse,
    hasFeedback: !!foundStudents[0]?.teacherFeedback,
  });

  console.log('\n🎉 ALL LOCAL DB VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

verify().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
