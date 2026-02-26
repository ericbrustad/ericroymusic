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

// GET all singles
export async function GET() {
  const db = getDb();
  const singles = db.prepare('SELECT * FROM singles ORDER BY sort_order ASC').all();
  return NextResponse.json(singles);
}

// POST create single
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO singles (title, description, cover_image, apple_music_link, spotify_link, youtube_link, soundcloud_link, buy_link, buy_text, is_latest, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.description || '',
      data.cover_image || '',
      data.apple_music_link || '',
      data.spotify_link || '',
      data.youtube_link || '',
      data.soundcloud_link || '',
      data.buy_link || '',
      data.buy_text || '',
      data.is_latest || 0,
      data.is_active !== undefined ? data.is_active : 1,
      data.sort_order || 0
    );

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Single created' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT update single
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE singles SET
        title = ?, description = ?, cover_image = ?, apple_music_link = ?, spotify_link = ?,
        youtube_link = ?, soundcloud_link = ?, buy_link = ?, buy_text = ?, is_latest = ?,
        is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title,
      data.description || '',
      data.cover_image || '',
      data.apple_music_link || '',
      data.spotify_link || '',
      data.youtube_link || '',
      data.soundcloud_link || '',
      data.buy_link || '',
      data.buy_text || '',
      data.is_latest || 0,
      data.is_active !== undefined ? data.is_active : 1,
      data.sort_order || 0,
      data.id
    );

    return NextResponse.json({ message: 'Single updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE single
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    db.prepare('DELETE FROM singles WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Single deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
