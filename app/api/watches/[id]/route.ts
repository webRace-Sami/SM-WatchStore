import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Watch, WatchImage } from '@/lib/types';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const raw = await prisma.watch.findFirst({
      where: {
        OR: [{ id }, { sku: id }],
      },
    });

    if (!raw) {
      return NextResponse.json({ error: 'Watch not found.' }, { status: 404 });
    }

    let parsedImages: WatchImage[] = [];
    try {
      parsedImages = JSON.parse(raw.images || '[]');
    } catch {
      parsedImages = [{ url: FALLBACK_WATCH_IMAGE, source: 'preset', isPrimary: true }];
    }
    if (!parsedImages.length) {
      parsedImages = [{ url: FALLBACK_WATCH_IMAGE, source: 'preset', isPrimary: true }];
    }

    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(raw.features || '[]');
    } catch {
      parsedFeatures = [];
    }

    const watch: Watch = {
      id: raw.id,
      title: raw.title,
      brand: raw.brand,
      model: raw.model,
      sku: raw.sku,
      price: raw.price,
      discountPrice: raw.discountPrice,
      stockCount: raw.stockCount,
      isAvailable: raw.isAvailable,
      category: raw.category,
      movement: raw.movement,
      caseDiameter: raw.caseDiameter,
      dialColor: raw.dialColor,
      strapMaterial: raw.strapMaterial,
      waterResistance: raw.waterResistance,
      description: raw.description,
      features: parsedFeatures,
      images: parsedImages,
      isFeatured: raw.isFeatured,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };

    return NextResponse.json({ watch });
  } catch (error: any) {
    console.error('Get Watch Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve watch item.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to update stock.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const {
      title,
      brand,
      model,
      sku,
      price,
      discountPrice,
      stockCount,
      isAvailable,
      category,
      movement,
      caseDiameter,
      dialColor,
      strapMaterial,
      waterResistance,
      description,
      features,
      images,
      isFeatured,
    } = body;

    let formattedImages: WatchImage[] = [];
    if (Array.isArray(images) && images.length > 0) {
      formattedImages = images.map((img: any, idx: number) => ({
        url: typeof img === 'string' ? img : img.url || FALLBACK_WATCH_IMAGE,
        source: img.source || 'google',
        alt: img.alt || `${title || 'Watch'} - Image ${idx + 1}`,
        isPrimary: idx === 0,
      }));
    }

    const featuresList = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map((f) => f.trim()).filter(Boolean)
      : undefined;

    const updated = await prisma.watch.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : undefined,
        brand: brand !== undefined ? String(brand).trim() : undefined,
        model: model !== undefined ? String(model).trim() : undefined,
        sku: sku !== undefined ? String(sku).trim() : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        discountPrice:
          discountPrice !== undefined
            ? discountPrice === null || discountPrice === ''
              ? null
              : parseFloat(discountPrice)
            : undefined,
        stockCount:
          stockCount !== undefined ? parseInt(stockCount, 10) : undefined,
        isAvailable:
          isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        category: category !== undefined ? String(category).trim() : undefined,
        movement: movement !== undefined ? String(movement).trim() : undefined,
        caseDiameter:
          caseDiameter !== undefined
            ? caseDiameter
              ? String(caseDiameter).trim()
              : null
            : undefined,
        dialColor:
          dialColor !== undefined
            ? dialColor
              ? String(dialColor).trim()
              : null
            : undefined,
        strapMaterial:
          strapMaterial !== undefined
            ? strapMaterial
              ? String(strapMaterial).trim()
              : null
            : undefined,
        waterResistance:
          waterResistance !== undefined
            ? waterResistance
              ? String(waterResistance).trim()
              : null
            : undefined,
        description:
          description !== undefined ? String(description).trim() : undefined,
        features:
          featuresList !== undefined
            ? JSON.stringify(featuresList)
            : undefined,
        images:
          formattedImages.length > 0
            ? JSON.stringify(formattedImages)
            : undefined,
        isFeatured:
          isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Watch updated successfully.',
      watch: updated,
    });
  } catch (error: any) {
    console.error('Update Watch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update watch item.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to delete stock.' },
        { status: 403 }
      );
    }

    const { id } = params;
    await prisma.watch.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Watch removed from inventory successfully.',
    });
  } catch (error: any) {
    console.error('Delete Watch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete watch item.' },
      { status: 500 }
    );
  }
}
