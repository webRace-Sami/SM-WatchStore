import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatSafeUser, getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: authUser });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, secondaryPhone, address, city, postalCode } = body;

    // Strict rule: Username and UserId are immutable
    const updated = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        fullName: fullName !== undefined ? String(fullName).trim() : undefined,
        phone: phone !== undefined ? String(phone).trim() : undefined,
        secondaryPhone: secondaryPhone !== undefined ? (secondaryPhone ? String(secondaryPhone).trim() : null) : undefined,
        address: address !== undefined ? (address ? String(address).trim() : null) : undefined,
        city: city !== undefined ? (city ? String(city).trim() : null) : undefined,
        postalCode: postalCode !== undefined ? (postalCode ? String(postalCode).trim() : null) : undefined,
      },
    });

    const safeUser = formatSafeUser(updated);
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
