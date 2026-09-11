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

// DELETE student and cascade associated records
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const student = await prisma.student.findFirst({
      where: { id, teacherId: teacher.teacherId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found or unauthorized' }, { status: 404 });
    }

    // Cascade delete associated records if using Prisma client, or localDb handles cascade
    if (prisma.questionnaireResponse?.deleteMany) {
      await prisma.questionnaireResponse.deleteMany({ where: { studentId: id } }).catch(() => {});
    }
    if (prisma.assessmentResponse?.deleteMany) {
      await prisma.assessmentResponse.deleteMany({ where: { studentId: id } }).catch(() => {});
    }
    if (prisma.teacherFeedback?.deleteMany) {
      await prisma.teacherFeedback.deleteMany({ where: { studentId: id } }).catch(() => {});
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
