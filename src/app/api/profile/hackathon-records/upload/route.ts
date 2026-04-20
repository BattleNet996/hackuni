import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';
import { getSupabaseClient } from '@/lib/db/supabase-client';

const MAX_PROOF_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const PROOF_BUCKET = 'hackathon-record-proofs';

function getAuthToken(request: NextRequest) {
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const xAuthToken = request.headers.get('x-auth-token');
  return cookieToken || headerToken || xAuthToken;
}

async function ensureBucket() {
  const supabase = getSupabaseClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw listError;
  }

  if (Array.isArray(buckets) && buckets.some((bucket: any) => bucket.name === PROOF_BUCKET)) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(PROOF_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_PROOF_IMAGE_SIZE_BYTES}`,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  });

  if (createError && !String(createError.message || '').includes('already exists')) {
    throw createError;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Proof image file is required' } },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Proof attachment must be an image file' } },
        { status: 400 }
      );
    }

    if (file.size > MAX_PROOF_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Proof image must be under 5MB' } },
        { status: 400 }
      );
    }

    await ensureBucket();

    const supabase = getSupabaseClient();
    const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : 'png';
    const filePath = `${user.id}/${Date.now()}-${randomUUID()}.${extension || 'png'}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(PROOF_BUCKET)
      .upload(filePath, fileBuffer, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage.from(PROOF_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      data: {
        url: publicUrlData.publicUrl,
        path: filePath,
      },
    });
  } catch (error: any) {
    console.error('Hackathon proof upload error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to upload proof attachment',
        },
      },
      { status: 500 }
    );
  }
}
