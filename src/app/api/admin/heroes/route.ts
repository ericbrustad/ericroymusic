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

// GET all hero sections
export async function GET() {
  const db = getDb();
  const heroes = db.prepare('SELECT * FROM hero_sections ORDER BY sort_order ASC').all();
  return NextResponse.json(heroes);
}

// POST create hero section
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO hero_sections (title, subtitle, background_image, cta_text, cta_link, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.subtitle || '',
      data.background_image || '',
      data.cta_text || '',
      data.cta_link || '',
      data.sort_order || 0,
      data.is_active !== undefined ? data.is_active : 1
    );

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Hero created' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT update hero section
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE hero_sections SET
        title = ?, subtitle = ?, background_image = ?, cta_text = ?, cta_link = ?,
        sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title,
      data.subtitle || '',
      data.background_image || '',
      data.cta_text || '',
      data.cta_link || '',
      data.sort_order || 0,
      data.is_active !== undefined ? data.is_active : 1,
      data.id
    );

    return NextResponse.json({ message: 'Hero updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE hero section
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    db.prepare('DELETE FROM hero_sections WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Hero deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
