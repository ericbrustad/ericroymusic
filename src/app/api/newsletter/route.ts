import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(email);

    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);
    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
