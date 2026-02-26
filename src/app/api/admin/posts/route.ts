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

// GET all blog posts
export async function GET() {
  const db = getDb();
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC').all();
  return NextResponse.json(posts);
}

// POST create blog post
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    // Generate slug
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author, category, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      slug,
      data.excerpt || '',
      data.content,
      data.featured_image || '',
      data.author || 'Erix Coach and Car',
      data.category || 'Uncategorized',
      data.is_published !== undefined ? data.is_published : 1,
      data.published_at || new Date().toISOString().split('T')[0]
    );

    return NextResponse.json({ id: result.lastInsertRowid, slug, message: 'Post created' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT update blog post
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const db = getDb();

    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness (excluding current post)
    const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id != ?').get(slug, data.id);
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    db.prepare(`
      UPDATE blog_posts SET
        title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?,
        author = ?, category = ?, is_published = ?, published_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title,
      slug,
      data.excerpt || '',
      data.content,
      data.featured_image || '',
      data.author || 'Erix Coach and Car',
      data.category || 'Uncategorized',
      data.is_published !== undefined ? data.is_published : 1,
      data.published_at || new Date().toISOString().split('T')[0],
      data.id
    );

    return NextResponse.json({ message: 'Post updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
