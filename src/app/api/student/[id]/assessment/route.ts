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
    const gradedResponses = answers.map((answer: { questionId: string; selectedAnswer: string }) => {
      const question = assessmentQuestions.find((q) => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: question ? question.correctAnswer === answer.selectedAnswer : false,
      };
    });

    const score = gradedResponses.filter((r: { isCorrect: boolean }) => r.isCorrect).length;

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
