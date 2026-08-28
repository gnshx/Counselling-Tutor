import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthTeacher } from '@/lib/auth';

// POST submit teacher feedback for a student
export async function POST(
  request: NextRequest,
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
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if feedback already exists
    const existing = await prisma.teacherFeedback.findUnique({
      where: { studentId: id },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this student' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { ratings, strongestAreas, interestedAreas, workingStyle, comment } = body;

    if (!ratings || !Array.isArray(ratings)) {
      return NextResponse.json(
        { error: 'Ratings are required' },
        { status: 400 }
      );
    }

    const feedback = await prisma.teacherFeedback.create({
      data: {
        studentId: id,
        teacherId: teacher.teacherId,
        ratings,
        strongestAreas: strongestAreas || [],
        interestedAreas: interestedAreas || [],
        workingStyle: workingStyle || null,
        comment: comment || null,
      },
    });

    // Update student feedback status
    await prisma.student.update({
      where: { id },
      data: { feedbackStatus: 'completed' },
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
