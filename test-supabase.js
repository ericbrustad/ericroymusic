const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Anon key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
  console.log('Service key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...');

  // Test 1: Read settings with anon key
  console.log('\n--- Test 1: READ with anon key ---');
  const { data: readData, error: readErr } = await supabase.from('site_settings').select('*').limit(3);
  console.log('Read result:', readErr ? `ERROR: ${readErr.message}` : `OK (${readData?.length} rows)`);
  if (readData) readData.forEach(r => console.log(`  ${r.key} = ${r.value}`));

  // Test 2: Write settings with service role key
  console.log('\n--- Test 2: WRITE with service role key ---');
  const { data: writeData, error: writeErr } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'site_name', value: 'Eric Roy Music TEST', updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select();
  console.log('Write result:', writeErr ? `ERROR: ${writeErr.message}` : 'OK');
  if (writeData) console.log('  Written:', writeData);

  // Test 3: Re-read to verify
  console.log('\n--- Test 3: Verify write ---');
  const { data: verifyData } = await supabase.from('site_settings').select('*').eq('key', 'site_name');
  console.log('Verify:', verifyData);

  // Test 4: Restore original value
  console.log('\n--- Test 4: Restore ---');
  await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'site_name', value: 'Eric Roy Music', updated_at: new Date().toISOString() }, { onConflict: 'key' });
  console.log('Restored to original');
}

test().catch(console.error);
