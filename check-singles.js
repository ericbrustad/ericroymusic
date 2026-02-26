const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('singles')
    .select('id, title, is_active, sort_order, youtube_link')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    return;
  }
  console.log(`Found ${data.length} singles:`);
  data.forEach(s => console.log(`  #${s.id}: "${s.title}" active=${s.is_active} order=${s.sort_order} yt=${s.youtube_link ? 'yes' : 'no'}`));
}

check().catch(console.error);
