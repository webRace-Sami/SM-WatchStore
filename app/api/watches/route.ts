import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Watch, WatchImage } from '@/lib/types';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const brand = searchParams.get('brand')?.trim();
    const category = searchParams.get('category')?.trim();
    const movement = searchParams.get('movement')?.trim();
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { brand: { contains: q } },
        { model: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
        { dialColor: { contains: q } },
      ];
    }

    if (brand && brand !== 'All') {
      where.brand = brand;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (movement && movement !== 'All') {
      where.movement = { contains: movement };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stockCount = { gt: 0 };
      where.isAvailable = true;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'title_asc') orderBy = { title: 'asc' };

    const rawWatches = await prisma.watch.findMany({
      where,
      orderBy,
    });

    const watches: Watch[] = rawWatches.map((w: any) => {
      let parsedImages: WatchImage[] = [];
      try {
        parsedImages = JSON.parse(w.images || '[]');
      } catch {
        parsedImages = [{ url: FALLBACK_WATCH_IMAGE, source: 'preset', isPrimary: true }];
      }
      if (!parsedImages.length) {
        parsedImages = [{ url: FALLBACK_WATCH_IMAGE, source: 'preset', isPrimary: true }];
      }

      let parsedFeatures: string[] = [];
      try {
        parsedFeatures = JSON.parse(w.features || '[]');
      } catch {
        parsedFeatures = [];
      }

      return {
        id: w.id,
        title: w.title,
        brand: w.brand,
        model: w.model,
        sku: w.sku,
        price: w.price,
        discountPrice: w.discountPrice,
        stockCount: w.stockCount,
        isAvailable: w.isAvailable,
        category: w.category,
        movement: w.movement,
        caseDiameter: w.caseDiameter,
        dialColor: w.dialColor,
        strapMaterial: w.strapMaterial,
        waterResistance: w.waterResistance,
        description: w.description,
        features: parsedFeatures,
        images: parsedImages,
        isFeatured: w.isFeatured,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      };
    });

    // Also extract available filter facets
    const brands = Array.from(new Set(rawWatches.map((w) => w.brand))).filter(Boolean);
    const categories = Array.from(new Set(rawWatches.map((w) => w.category))).filter(Boolean);

    return NextResponse.json({
      watches,
      count: watches.length,
      facets: { brands, categories },
    });
  } catch (error: any) {
    console.error('Fetch Watches Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watches catalog.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to add stock.' },
        { status: 403 }
      );
    }

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

    if (!title || !brand || !price) {
      return NextResponse.json(
        { error: 'Watch Title, Brand, and Price are required.' },
        { status: 400 }
      );
    }

    const generatedSku =
      sku?.trim() ||
      `${brand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Ensure images format is clean
    let formattedImages: WatchImage[] = [];
    if (Array.isArray(images) && images.length > 0) {
      formattedImages = images.map((img: any, idx: number) => ({
        url: typeof img === 'string' ? img : img.url || FALLBACK_WATCH_IMAGE,
        source: img.source || 'google',
        alt: img.alt || `${title} - Image ${idx + 1}`,
        isPrimary: idx === 0,
      }));
    } else {
      formattedImages = [
        {
          url: FALLBACK_WATCH_IMAGE,
          source: 'preset',
          alt: title,
          isPrimary: true,
        },
      ];
    }

    const featuresList = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map((f) => f.trim()).filter(Boolean)
      : [];

    const newWatch = await prisma.watch.create({
      data: {
        title: title.trim(),
        brand: brand.trim(),
        model: model?.trim() || 'Reference Model',
        sku: generatedSku,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stockCount: parseInt(stockCount ?? 1, 10),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        category: category?.trim() || 'Luxury',
        movement: movement?.trim() || 'Automatic',
        caseDiameter: caseDiameter?.trim() || null,
        dialColor: dialColor?.trim() || null,
        strapMaterial: strapMaterial?.trim() || null,
        waterResistance: waterResistance?.trim() || null,
        description: description?.trim() || 'Exquisite luxury timepiece.',
        features: JSON.stringify(featuresList),
        images: JSON.stringify(formattedImages),
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({
      success: true,
      watch: {
        ...newWatch,
        features: featuresList,
        images: formattedImages,
        createdAt: newWatch.createdAt.toISOString(),
        updatedAt: newWatch.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create Watch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create watch item.' },
      { status: 500 }
    );
  }
}
