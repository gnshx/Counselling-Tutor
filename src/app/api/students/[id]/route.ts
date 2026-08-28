import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthTeacher } from '@/lib/auth';

// GET single student with all related data
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const student = await prisma.student.findFirst({
    where: { id, teacherId: teacher.teacherId },
    include: {
      questionnaireResponse: true,
      assessmentResponse: true,
      teacherFeedback: true,
    },
  });

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json({ student });
}
