import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthTeacher } from '@/lib/auth';
import crypto from 'crypto';

function generateAccessCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// GET all students for the authenticated teacher
export async function GET(request: NextRequest) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const classFilter = searchParams.get('class') || '';

  const where: Record<string, unknown> = { teacherId: teacher.teacherId };

  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (classFilter) {
    where.classGrade = classFilter;
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      questionnaireResponse: { select: { id: true, completedAt: true } },
      assessmentResponse: { select: { id: true, score: true, totalQuestions: true, completedAt: true } },
      teacherFeedback: { select: { id: true, completedAt: true } },
    },
  });

  return NextResponse.json({ students });
}

// POST create a new student
export async function POST(request: NextRequest) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, dob, classGrade, school, parentBackground, backgroundInfo } = body;

    if (!name || !dob || !classGrade) {
      return NextResponse.json(
        { error: 'Name, date of birth, and class/grade are required' },
        { status: 400 }
      );
    }

    let accessCode = generateAccessCode();
    // Ensure uniqueness
    let existing = await prisma.student.findUnique({ where: { accessCode } });
    while (existing) {
      accessCode = generateAccessCode();
      existing = await prisma.student.findUnique({ where: { accessCode } });
    }

    const student = await prisma.student.create({
      data: {
        name,
        dob: new Date(dob),
        classGrade,
        school: school || null,
        parentBackground: parentBackground || null,
        backgroundInfo: backgroundInfo || null,
        accessCode,
        teacherId: teacher.teacherId,
      },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
