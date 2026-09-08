import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assessmentQuestions } from '@/lib/data/assessment';

// POST — submit assessment responses
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, assessmentStatus: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (student.assessmentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Assessment already completed' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Grade answers server-side (never trust the client)
    const answersMap = new Map(
      answers
        .filter((a): a is { questionId: string; selectedAnswer: string } => Boolean(a && typeof a.questionId === 'string'))
        .map((a) => [a.questionId, a.selectedAnswer])
    );

    const gradedResponses = assessmentQuestions.map((q) => {
      const selected = answersMap.get(q.id) || '';
      const isCorrect = Boolean(
        selected && (q.correctAnswer === selected || q.correctAnswerHi === selected)
      );
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect,
      };
    });

    const score = gradedResponses.filter((r) => r.isCorrect).length;

    await prisma.assessmentResponse.create({
      data: {
        studentId: id,
        responses: gradedResponses,
        score,
        totalQuestions: assessmentQuestions.length,
      },
    });

    await prisma.student.update({
      where: { id },
      data: { assessmentStatus: 'completed' },
    });

    return NextResponse.json({ success: true, score, total: assessmentQuestions.length }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    );
  }
}

// GET — retrieve student's completed assessment response
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        assessmentStatus: true,
        assessmentResponse: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (student.assessmentStatus !== 'completed' || !student.assessmentResponse) {
      return NextResponse.json(
        { error: 'Assessment not completed yet', assessmentResponse: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      assessmentResponse: student.assessmentResponse,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch assessment response' },
      { status: 500 }
    );
  }
}

