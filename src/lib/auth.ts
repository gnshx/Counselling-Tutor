import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

export interface TokenPayload {
  teacherId: string;
  email: string;
  name: string;
}

export interface StudentTokenPayload {
  studentId: string;
  accessCode: string;
  name: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function signStudentToken(payload: StudentTokenPayload): Promise<string> {
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

export async function verifyStudentToken(token: string): Promise<StudentTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as StudentTokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthTeacher(): Promise<TokenPayload | null> {
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
  return null;
}

export async function getAuthStudent(): Promise<StudentTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('student-token')?.value;
    if (token) {
      const verified = await verifyStudentToken(token);
      if (verified) return verified;
    }
  } catch {
    // Cookie reading error ignore
  }
  return null;
}
