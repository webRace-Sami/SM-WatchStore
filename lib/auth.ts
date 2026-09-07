import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { SafeUser, UserRole } from './types';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'sm_watchstore_secret_token_942_luxury';

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function formatSafeUser(user: any): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as UserRole,
    fullName: user.fullName,
    phone: user.phone,
    secondaryPhone: user.secondaryPhone,
    address: user.address,
    city: user.city,
    postalCode: user.postalCode,
    createdAt: user.createdAt?.toISOString ? user.createdAt.toISOString() : String(user.createdAt),
  };
}

export async function getAuthUser(request: NextRequest): Promise<SafeUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieToken = request.cookies.get('sm_token')?.value;
      if (cookieToken) token = cookieToken;
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return null;
    return formatSafeUser(user);
  } catch (error) {
    return null;
  }
}
