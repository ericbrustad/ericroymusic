import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  // Use admin client to bypass RLS entirely
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: noCacheHeaders });
  }
  return NextResponse.json(data, { headers: noCacheHeaders });
}

export async function PUT(request: NextRequest) {
  // Check admin session
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (e: any) {
    return NextResponse.json(
      { error: `Session error: ${e.message}` },
      { status: 500, headers: noCacheHeaders }
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json(
      { error: `Unauthorized - session: ${session ? 'exists but role=' + (session.user as any)?.role : 'null'}` },
      { status: 401, headers: noCacheHeaders }
    );
  }

  try {
    const settings = await request.json();
    const errors: string[] = [];
    const saved: string[] = [];

    for (const item of settings) {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .upsert(
          { key: item.key, value: item.value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
        .select();
      if (error) {
        errors.push(`${item.key}: ${error.message}`);
      } else {
        saved.push(item.key);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('; '), saved, errorCount: errors.length, totalCount: settings.length },
        { status: 500, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Settings updated', count: saved.length },
      { headers: noCacheHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
