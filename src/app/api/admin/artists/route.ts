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
    .from('artists')
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
      .from('artists')
      .insert({
        name: body.name,
        song_title: body.song_title || '',
        description: body.description || '',
        image: body.image || '',
        youtube_link: body.youtube_link || '',
        soundcloud_link: body.soundcloud_link || '',
        spotify_link: body.spotify_link || '',
        apple_music_link: body.apple_music_link || '',
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ id: data.id, message: 'Artist created' });
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
      .from('artists')
      .update({
        name: body.name,
        song_title: body.song_title || '',
        description: body.description || '',
        image: body.image || '',
        youtube_link: body.youtube_link || '',
        soundcloud_link: body.soundcloud_link || '',
        spotify_link: body.spotify_link || '',
        apple_music_link: body.apple_music_link || '',
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Artist updated' });
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
      .from('artists')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Artist deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
