import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST — student accesses their journey via access code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { accessCode: accessCode.toUpperCase() },
      select: {
        id: true,
        name: true,
        classGrade: true,
        questionnaireStatus: true,
        assessmentStatus: true,
        feedbackStatus: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Invalid access code. Please check with your teacher.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
