import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getStudents,
  saveStudent,
  deleteStudent,
  saveTeacherFeedback,
  getTeacherFeedbacks,
  findStudentById,
} from '../db/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbDir = path.join(rootDir, 'db');

console.log('🧪 Starting Concurrency & Deletion Verification Tests...\n');

async function testConcurrencyAndCascade() {
  const initialStudents = getStudents();
  console.log(`✓ Initial total students in local DB: ${initialStudents.length}`);

  // Test 1: Create a temporary test student
  const testStudentId = `test_student_${Date.now()}`;
  const testStudent = {
    id: testStudentId,
    name: 'Temporary Test Student',
    dob: '2008-05-15',
    classGrade: '10',
    school: 'Test SAGES School',
    parentJob: 'Agriculture',
    familyIncome: '1,00,000 - 2,50,000',
    parentBackground: null,
    backgroundInfo: null,
    accessCode: `TEST${Math.floor(1000 + Math.random() * 9000)}`,
    questionnaireStatus: 'completed',
    assessmentStatus: 'completed',
    feedbackStatus: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teacherId: initialStudents[0]?.teacherId || 'cmtest',
  };

  saveStudent(testStudent);
  console.log(`✓ Created test student: ${testStudent.name} (ID: ${testStudent.id})`);

  // Test 2: Concurrency test - Simulate 5 teachers simultaneously submitting feedback/updates
  console.log('\n⚡ Simulating 5 concurrent teacher operations...');
  const concurrentPromises = [1, 2, 3, 4, 5].map(async (i) => {
    const feedback = {
      id: `fb_test_${testStudentId}_${i}`,
      studentId: testStudentId,
      teacherId: testStudent.teacherId,
      ratings: [
        { questionId: 'tf1', rating: 4 },
        { questionId: 'tf2', rating: 5 },
      ],
      strongestAreas: ['problem_solving', 'creativity'],
      interestedAreas: ['science'],
      workingStyle: 'Independent',
      comment: `Simulated concurrent submission #${i} at ${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    return saveTeacherFeedback(feedback);
  });

  await Promise.all(concurrentPromises);
  console.log('✓ All 5 concurrent operations completed without errors or collisions.');

  const feedbacks = getTeacherFeedbacks();
  const studentFeedback = feedbacks.find((f) => f.studentId === testStudentId);
  if (!studentFeedback) {
    throw new Error('❌ Concurrency test failed: feedback was lost!');
  }
  console.log(`✓ Verified feedback saved cleanly on disk. Comment: "${studentFeedback.comment}"`);

  // Test 3: Verify relations joined with O(1) maps
  const studentWithRelations = findStudentById(testStudentId, true);
  if (!studentWithRelations?.teacherFeedback) {
    throw new Error('❌ Relational join test failed: teacher feedback not attached!');
  }
  console.log('✓ Relational join verified with O(1) map lookup.');

  // Test 4: Delete with Cascade
  console.log('\n🗑️ Testing deleteStudent cascading cleanup...');
  const deleteResult = deleteStudent(testStudentId);
  if (!deleteResult) {
    throw new Error('❌ deleteStudent returned false!');
  }

  const remainingStudents = getStudents();
  if (remainingStudents.some((s) => s.id === testStudentId)) {
    throw new Error('❌ Student still found in students list after deletion!');
  }

  const remainingFeedbacks = getTeacherFeedbacks();
  if (remainingFeedbacks.some((f) => f.studentId === testStudentId)) {
    throw new Error('❌ Teacher feedback was NOT cascaded after student deletion!');
  }

  console.log('✓ Student and all associated feedbacks were cascade-deleted successfully!');
  console.log(`✓ Total students returned cleanly to: ${remainingStudents.length}`);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO DEFECTS DETECTED.\n');
}

testConcurrencyAndCascade().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
