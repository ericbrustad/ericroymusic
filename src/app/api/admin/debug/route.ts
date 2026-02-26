import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase, supabaseAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Check env vars
  results.env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 15) + '...' : 'NOT SET',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET (' + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) + '...)' : 'NOT SET',
  };

  // 2. Check session
  try {
    const session = await getServerSession(authOptions);
    results.session = session ? {
      user: session.user,
      hasRole: !!(session.user as any)?.role,
      role: (session.user as any)?.role,
    } : null;
  } catch (e: any) {
    results.session = `ERROR: ${e.message}`;
  }

  // 3. Check Supabase read (anon)
  try {
    const { data, error } = await supabase.from('site_settings').select('key').limit(3);
    results.supabaseRead = error ? `ERROR: ${error.message}` : `OK (${data?.length} rows)`;
  } catch (e: any) {
    results.supabaseRead = `EXCEPTION: ${e.message}`;
  }

  // 4. Check Supabase write (admin/service role)
  try {
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert(
        { key: '_debug_test', value: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    results.supabaseWrite = error ? `ERROR: ${error.message}` : 'OK';
  } catch (e: any) {
    results.supabaseWrite = `EXCEPTION: ${e.message}`;
  }

  // 5. Cleanup test row
  try {
    await supabaseAdmin.from('site_settings').delete().eq('key', '_debug_test');
    results.supabaseDelete = 'OK';
  } catch (e: any) {
    results.supabaseDelete = `EXCEPTION: ${e.message}`;
  }

  return NextResponse.json(results);
}
