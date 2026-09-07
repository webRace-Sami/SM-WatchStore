import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Order, PaymentType } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authUser = await getAuthUser(request);

    const raw = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        user: true,
      },
    });

    if (!raw) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Permission check: Admin or the owner of the order or guest matching order ID
    if (authUser && authUser.role !== 'ADMIN' && raw.userId && raw.userId !== authUser.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const order: Order = {
      id: raw.id,
      orderNumber: raw.orderNumber,
      userId: raw.userId,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      customerEmail: raw.customerEmail,
      shippingAddress: raw.shippingAddress,
      city: raw.city,
      postalCode: raw.postalCode,
      subtotal: raw.subtotal,
      taxAmount: raw.taxAmount,
      courierFee: raw.courierFee,
      courierDiscount: raw.courierDiscount,
      totalAmount: raw.totalAmount,
      paymentType: raw.paymentType as PaymentType,
      advancePaid: raw.advancePaid,
      remainingBalance: raw.remainingBalance,
      paymentStatus: raw.paymentStatus as any,
      orderStatus: raw.orderStatus as any,
      paymentProofUrl: raw.paymentProofUrl,
      paymentNotes: raw.paymentNotes,
      courierServiceName: raw.courierServiceName,
      courierTrackingNumber: raw.courierTrackingNumber,
      adminNotes: raw.adminNotes,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
      items: raw.items.map((it) => ({
        id: it.id,
        orderId: it.orderId,
        watchId: it.watchId,
        watchTitle: it.watchTitle,
        watchImage: it.watchImage,
        price: it.price,
        quantity: it.quantity,
        total: it.total,
      })),
    };

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order details.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authUser = await getAuthUser(request);
    const body = await request.json();
    const {
      orderStatus,
      paymentStatus,
      courierServiceName,
      courierTrackingNumber,
      paymentProofUrl,
      paymentNotes,
      adminNotes,
    } = body;

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Customer can only upload/update their payment screenshot/proof
    const isAdmin = authUser && authUser.role === 'ADMIN';

    const updateData: any = {};

    if (paymentProofUrl !== undefined) {
      updateData.paymentProofUrl = paymentProofUrl;
    }
    if (paymentNotes !== undefined) {
      updateData.paymentNotes = paymentNotes;
    }

    if (isAdmin) {
      if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
      if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
      if (courierServiceName !== undefined) updateData.courierServiceName = courierServiceName;
      if (courierTrackingNumber !== undefined) updateData.courierTrackingNumber = courierTrackingNumber;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    }

    const updated = await prisma.order.update({
      where: { id: existingOrder.id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully.',
      order: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Update Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order.' },
      { status: 500 }
    );
  }
}
