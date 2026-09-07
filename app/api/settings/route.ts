import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { StoreSettings } from '@/lib/types';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default',
          companyName: 'SM WatchStore',
          brandTagline: 'Luxury Timepieces & Haute Horlogerie',
          contactPhone: '+92 300 8942942',
          whatsappNumber: '+92 300 8942942',
          officialEmail: 'samiullahnawaz942@gmail.com',
          physicalAddress: 'Showroom #14, Royal Horology Pavilion, Main Boulevard, Gulberg III, Lahore, Pakistan',
          city: 'Lahore',
          googleMapsUrl: 'https://maps.google.com/?q=Gulberg+III+Lahore+Pakistan',
          isOpen: true,
          openingHoursText: 'Mon - Sat: 11:00 AM - 10:00 PM | Sun: 03:00 PM - 09:00 PM',
          gstTaxPercentage: 0,
          baseCourierPrice: 600,
          courierDiscountTier1Min: 25000,
          courierDiscountTier1Rate: 50,
          courierDiscountTier2Min: 50000,
          courierDiscountTier2Rate: 100,
          bankDetails: JSON.stringify([]),
          strictReturnPolicy: 'No material refundable.',
          noCodNotice: 'No Cash on Delivery (COD) available. Payment via Bank Transfer / EasyPaisa / JazzCash.',
        },
      });
    }

    let parsedBankDetails = [];
    try {
      parsedBankDetails = JSON.parse(settings.bankDetails || '[]');
    } catch {
      parsedBankDetails = [];
    }

    const formattedSettings: StoreSettings = {
      ...settings,
      bankDetails: parsedBankDetails,
      updatedAt: settings.updatedAt.toISOString(),
    };

    return NextResponse.json({ settings: formattedSettings });
  } catch (error: any) {
    console.error('Fetch Settings Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store settings.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      brandTagline,
      logoUrl,
      contactPhone,
      whatsappNumber,
      officialEmail,
      physicalAddress,
      city,
      googleMapsUrl,
      isOpen,
      openingHoursText,
      gstTaxPercentage,
      baseCourierPrice,
      courierDiscountTier1Min,
      courierDiscountTier1Rate,
      courierDiscountTier2Min,
      courierDiscountTier2Rate,
      bankDetails,
      strictReturnPolicy,
      noCodNotice,
      announcementBanner,
    } = body;

    const bankDetailsStr =
      typeof bankDetails === 'string'
        ? bankDetails
        : JSON.stringify(bankDetails || []);

    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        companyName,
        brandTagline,
        logoUrl,
        contactPhone,
        whatsappNumber,
        officialEmail,
        physicalAddress,
        city,
        googleMapsUrl,
        isOpen: Boolean(isOpen),
        openingHoursText,
        gstTaxPercentage: Number(gstTaxPercentage) || 0,
        baseCourierPrice: Number(baseCourierPrice) || 600,
        courierDiscountTier1Min: Number(courierDiscountTier1Min) || 25000,
        courierDiscountTier1Rate: Number(courierDiscountTier1Rate) || 50,
        courierDiscountTier2Min: Number(courierDiscountTier2Min) || 50000,
        courierDiscountTier2Rate: Number(courierDiscountTier2Rate) || 100,
        bankDetails: bankDetailsStr,
        strictReturnPolicy,
        noCodNotice,
        announcementBanner,
      },
      create: {
        id: 'default',
        companyName,
        brandTagline,
        logoUrl,
        contactPhone,
        whatsappNumber,
        officialEmail,
        physicalAddress,
        city,
        googleMapsUrl,
        isOpen: Boolean(isOpen),
        openingHoursText,
        gstTaxPercentage: Number(gstTaxPercentage) || 0,
        baseCourierPrice: Number(baseCourierPrice) || 600,
        courierDiscountTier1Min: Number(courierDiscountTier1Min) || 25000,
        courierDiscountTier1Rate: Number(courierDiscountTier1Rate) || 50,
        courierDiscountTier2Min: Number(courierDiscountTier2Min) || 50000,
        courierDiscountTier2Rate: Number(courierDiscountTier2Rate) || 100,
        bankDetails: bankDetailsStr,
        strictReturnPolicy,
        noCodNotice,
        announcementBanner,
      },
    });

    let parsedBank = [];
    try {
      parsedBank = JSON.parse(updated.bankDetails || '[]');
    } catch {
      parsedBank = [];
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...updated,
        bankDetails: parsedBank,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Update Settings Error:', error);
    return NextResponse.json(
      { error: 'Failed to update store settings.' },
      { status: 500 }
    );
  }
}
