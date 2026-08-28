import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

export interface TokenPayload {
  teacherId: string;
  email: string;
  name: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthTeacher(): Promise<TokenPayload | null> {
  // 1. Check if user has valid JWT token in cookies
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (token) {
      const verified = await verifyToken(token);
      if (verified) return verified;
    }
  } catch {
    // Cookie reading error ignore
  }

  // 2. DEMO / OPEN BYPASS MODE: Fallback to default active teacher so guests & friends can view dashboard directly
  try {
    const defaultTeacher = await prisma.teacher.findFirst();
    if (defaultTeacher) {
      return {
        teacherId: defaultTeacher.id,
        email: defaultTeacher.email,
        name: defaultTeacher.name,
      };
    }
  } catch {
    // Fallback if DB fetch fails
  }

  // Fallback static teacher ID
  return {
    teacherId: 'cmtd999cs000013c8pid5u6c5',
    email: 'teacher@school.com',
    name: 'Demo Teacher',
  };
}
