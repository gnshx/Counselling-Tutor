import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        classGrade: true,
        accessCode: true,
        questionnaireStatus: true,
        assessmentStatus: true,
        feedbackStatus: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch student status' }, { status: 500 });
  }
}
