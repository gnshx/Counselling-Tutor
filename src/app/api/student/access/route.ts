import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signStudentToken } from '@/lib/auth';

// POST — student accesses their journey via access code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode || typeof accessCode !== 'string') {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    const cleanCode = accessCode.trim().toUpperCase();

    const student = await prisma.student.findUnique({
      where: { accessCode: cleanCode },
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
      return NextResponse.json(
        { error: 'Invalid access code. Please check with your teacher.' },
        { status: 404 }
      );
    }

    const token = await signStudentToken({
      studentId: student.id,
      accessCode: student.accessCode,
      name: student.name,
    });

    const response = NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        classGrade: student.classGrade,
        questionnaireStatus: student.questionnaireStatus,
        assessmentStatus: student.assessmentStatus,
        feedbackStatus: student.feedbackStatus,
      },
    });

    response.cookies.set('student-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
