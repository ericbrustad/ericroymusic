import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return false;
  }
  return true;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('singles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('singles')
      .insert({
        title: body.title,
        description: body.description || '',
        cover_image: body.cover_image || '',
        apple_music_link: body.apple_music_link || '',
        spotify_link: body.spotify_link || '',
        youtube_link: body.youtube_link || '',
        soundcloud_link: body.soundcloud_link || '',
        buy_link: body.buy_link || '',
        buy_text: body.buy_text || '',
        is_latest: body.is_latest || false,
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ id: data.id, message: 'Single created' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { error } = await supabaseAdmin
      .from('singles')
      .update({
        title: body.title,
        description: body.description || '',
        cover_image: body.cover_image || '',
        apple_music_link: body.apple_music_link || '',
        spotify_link: body.spotify_link || '',
        youtube_link: body.youtube_link || '',
        soundcloud_link: body.soundcloud_link || '',
        buy_link: body.buy_link || '',
        buy_text: body.buy_text || '',
        is_latest: body.is_latest || false,
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Single updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('singles')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Single deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
