import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });

    if (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
