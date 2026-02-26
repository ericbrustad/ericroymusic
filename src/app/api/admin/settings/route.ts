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

// GET all settings
export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM site_settings ORDER BY key ASC').all();
  return NextResponse.json(rows);
}

// PUT update settings
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    const db = getDb();

    const upsert = db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

    const updateMany = db.transaction((items: Array<{ key: string; value: string }>) => {
      for (const item of items) {
        upsert.run(item.key, item.value);
      }
    });

    updateMany(settings);

    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
