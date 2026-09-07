import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatSafeUser, hashPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, fullName, phone, secondaryPhone, address, city, postalCode } = body;

    if (!username || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: 'Username, password, full name, and phone number are required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken. Please choose another username.' },
        { status: 409 }
      );
    }

    // Check if email already exists if provided
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email is already registered.' },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: email ? email.trim().toLowerCase() : null,
        passwordHash,
        role: 'CUSTOMER',
        fullName: fullName.trim(),
        phone: phone.trim(),
        secondaryPhone: secondaryPhone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || 'Lahore',
        postalCode: postalCode?.trim() || null,
      },
    });

    const safeUser = formatSafeUser(newUser);
    const token = signToken({
      userId: safeUser.id,
      username: safeUser.username,
      role: safeUser.role,
    });

    const response = NextResponse.json(
      { success: true, user: safeUser, token },
      { status: 201 }
    );

    response.cookies.set('sm_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
