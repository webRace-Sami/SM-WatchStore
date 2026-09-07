import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    // Allow admin and authenticated users (or checkout proof upload) to upload
    const contentType = request.headers.get('content-type') || '';

    // Case 1: JSON payload (Google Image URL or Base64 Data URL)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { url, source = 'google', alt = 'Watch Image' } = body;

      if (!url || typeof url !== 'string') {
        return NextResponse.json(
          { error: 'Valid image URL is required.' },
          { status: 400 }
        );
      }

      let cleanUrl = url.trim();

      // Clean Google Image Search redirected URLs if pasted directly from Google Images
      if (cleanUrl.includes('google.com/imgres') || cleanUrl.includes('google.com/url?')) {
        try {
          const parsed = new URL(cleanUrl);
          const imgUrlParam = parsed.searchParams.get('imgurl') || parsed.searchParams.get('url');
          if (imgUrlParam) {
            cleanUrl = decodeURIComponent(imgUrlParam);
          }
        } catch {
          // keep original
        }
      }

      return NextResponse.json({
        success: true,
        image: {
          url: cleanUrl,
          source: source || 'google',
          alt,
          isPrimary: false,
        },
      });
    }

    // Case 2: FormData payload (Upload file from Gallery or Storage)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const alt = (formData.get('alt') as string) || 'Uploaded Watch Image';

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded.' },
          { status: 400 }
        );
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Uploaded file must be an image (JPEG, PNG, WEBP, GIF).' },
          { status: 400 }
        );
      }

      // Read file into Base64 Data URI for instant, zero-storage-dependency storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      return NextResponse.json({
        success: true,
        image: {
          url: base64Data,
          source: 'upload',
          alt: file.name || alt,
          isPrimary: false,
        },
      });
    }

    return NextResponse.json(
      { error: 'Unsupported content type.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Image Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
