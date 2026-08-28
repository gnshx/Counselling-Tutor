import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST — submit questionnaire responses
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, questionnaireStatus: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (student.questionnaireStatus === 'completed') {
      return NextResponse.json(
        { error: 'Questionnaire already completed' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Responses are required' },
        { status: 400 }
      );
    }

    await prisma.questionnaireResponse.create({
      data: {
        studentId: id,
        responses,
      },
    });

    await prisma.student.update({
      where: { id },
      data: { questionnaireStatus: 'completed' },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}
