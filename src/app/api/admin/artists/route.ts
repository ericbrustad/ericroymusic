import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import getDb from '@/lib/db';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return false;
  }
  return true;
}

// GET all artists
export async function GET() {
  const db = getDb();
  const artists = db.prepare('SELECT * FROM artists ORDER BY sort_order ASC').all();
  return NextResponse.json(artists);
}

// POST create artist
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO artists (name, song_title, description, image, youtube_link, soundcloud_link, spotify_link, apple_music_link, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.song_title || '',
      data.description || '',
      data.image || '',
      data.youtube_link || '',
      data.soundcloud_link || '',
      data.spotify_link || '',
      data.apple_music_link || '',
      data.is_active !== undefined ? data.is_active : 1,
      data.sort_order || 0
    );

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Artist created' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT update artist
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE artists SET
        name = ?, song_title = ?, description = ?, image = ?, youtube_link = ?,
        soundcloud_link = ?, spotify_link = ?, apple_music_link = ?,
        is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name,
      data.song_title || '',
      data.description || '',
      data.image || '',
      data.youtube_link || '',
      data.soundcloud_link || '',
      data.spotify_link || '',
      data.apple_music_link || '',
      data.is_active !== undefined ? data.is_active : 1,
      data.sort_order || 0,
      data.id
    );

    return NextResponse.json({ message: 'Artist updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE artist
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    db.prepare('DELETE FROM artists WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Artist deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
