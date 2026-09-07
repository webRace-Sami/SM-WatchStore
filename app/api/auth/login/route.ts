import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, formatSafeUser, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username or User ID and Password are required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanUsername },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            'Invalid username or password. If you forgot your password, please email samiullahnawaz942@gmail.com for assistance.',
        },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        {
          error:
            'Invalid username or password. If you forgot your password, please email samiullahnawaz942@gmail.com for assistance.',
        },
        { status: 401 }
      );
    }

    const safeUser = formatSafeUser(user);
    const token = signToken({
      userId: safeUser.id,
      username: safeUser.username,
      role: safeUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
    });

    response.cookies.set('sm_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
