import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, teacher.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signToken({
      teacherId: teacher.id,
      email: teacher.email,
      name: teacher.name,
    });

    const response = NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        school: teacher.school,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
