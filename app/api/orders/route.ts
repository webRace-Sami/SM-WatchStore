import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { calculateCourierFee } from '@/lib/courier';
import { Order, PaymentType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to view orders.' },
        { status: 401 }
      );
    }

    const where: any = {};

    // Customer only sees their own orders
    if (authUser.role !== 'ADMIN') {
      where.userId = authUser.id;
    } else {
      // Admin filters
      if (status && status !== 'ALL') {
        where.orderStatus = status;
      }
      if (paymentStatus && paymentStatus !== 'ALL') {
        where.paymentStatus = paymentStatus;
      }
    }

    const rawOrders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const orders: Order[] = rawOrders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      shippingAddress: o.shippingAddress,
      city: o.city,
      postalCode: o.postalCode,
      subtotal: o.subtotal,
      taxAmount: o.taxAmount,
      courierFee: o.courierFee,
      courierDiscount: o.courierDiscount,
      totalAmount: o.totalAmount,
      paymentType: o.paymentType as PaymentType,
      advancePaid: o.advancePaid,
      remainingBalance: o.remainingBalance,
      paymentStatus: o.paymentStatus as any,
      orderStatus: o.orderStatus as any,
      paymentProofUrl: o.paymentProofUrl,
      paymentNotes: o.paymentNotes,
      courierServiceName: o.courierServiceName,
      courierTrackingNumber: o.courierTrackingNumber,
      adminNotes: o.adminNotes,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map((it: any) => ({
        id: it.id,
        orderId: it.orderId,
        watchId: it.watchId,
        watchTitle: it.watchTitle,
        watchImage: it.watchImage,
        price: it.price,
        quantity: it.quantity,
        total: it.total,
      })),
      user: o.user
        ? {
            id: o.user.id,
            username: o.user.username,
            email: o.user.email,
            role: o.user.role as any,
            fullName: o.user.fullName,
            phone: o.user.phone,
            createdAt: o.user.createdAt.toISOString(),
          }
        : null,
    }));

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      paymentType, // 'FULL' or 'HALF'
      paymentProofUrl,
      paymentNotes,
      items,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !city) {
      return NextResponse.json(
        { error: 'Customer name, phone number, city, and shipping address are required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Please add watches before checking out.' },
        { status: 400 }
      );
    }

    // Fetch store settings for courier fee and tax calculations
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    // Calculate subtotal from watch IDs and quantities
    let subtotal = 0;
    const resolvedItems: {
      watchId: string;
      watchTitle: string;
      watchImage: string | null;
      price: number;
      quantity: number;
      total: number;
    }[] = [];

    for (const item of items) {
      const watch = await prisma.watch.findUnique({
        where: { id: item.watchId },
      });

      if (!watch) {
        return NextResponse.json(
          { error: `Watch with ID ${item.watchId} no longer exists.` },
          { status: 400 }
        );
      }

      if (watch.stockCount < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${watch.title}". Available: ${watch.stockCount}`,
          },
          { status: 400 }
        );
      }

      const activePrice = watch.discountPrice ?? watch.price;
      const itemTotal = activePrice * item.quantity;
      subtotal += itemTotal;

      let primaryImg = '';
      try {
        const parsed = JSON.parse(watch.images || '[]');
        primaryImg = parsed[0]?.url || '';
      } catch {
        primaryImg = '';
      }

      resolvedItems.push({
        watchId: watch.id,
        watchTitle: watch.title,
        watchImage: primaryImg,
        price: activePrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Courier calculation with dynamic discounts
    const courierCalc = calculateCourierFee(subtotal, settings as any);
    const courierFee = courierCalc.finalCourierFee;
    const courierDiscount = courierCalc.discountAmount;

    // Tax calculation
    const taxRate = settings?.gstTaxPercentage ?? 0;
    const taxAmount = (subtotal * taxRate) / 100;

    const totalAmount = subtotal + courierFee + taxAmount;

    const chosenPaymentType: PaymentType =
      paymentType === 'HALF' ? 'HALF' : 'FULL';

    const advancePaid =
      chosenPaymentType === 'HALF'
        ? Math.round(totalAmount * 0.5)
        : totalAmount;

    const remainingBalance =
      chosenPaymentType === 'HALF'
        ? totalAmount - advancePaid
        : 0;

    // Generate readable order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SMW-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: authUser?.id || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        shippingAddress: shippingAddress.trim(),
        city: city.trim(),
        postalCode: postalCode?.trim() || null,
        subtotal,
        taxAmount,
        courierFee,
        courierDiscount,
        totalAmount,
        paymentType: chosenPaymentType,
        advancePaid,
        remainingBalance,
        paymentStatus: paymentProofUrl ? 'PENDING_VERIFICATION' : 'PENDING_VERIFICATION',
        orderStatus: 'PENDING',
        paymentProofUrl: paymentProofUrl || null,
        paymentNotes: paymentNotes || null,
        items: {
          create: resolvedItems.map((it) => ({
            watchId: it.watchId,
            watchTitle: it.watchTitle,
            watchImage: it.watchImage,
            price: it.price,
            quantity: it.quantity,
            total: it.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Deduct stock
    for (const item of resolvedItems) {
      await prisma.watch.update({
        where: { id: item.watchId },
        data: {
          stockCount: { decrement: item.quantity },
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...newOrder,
        createdAt: newOrder.createdAt.toISOString(),
        updatedAt: newOrder.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}
