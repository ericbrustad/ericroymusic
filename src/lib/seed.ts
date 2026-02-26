import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import bcrypt from 'bcryptjs';

async function seed() {
  const { supabaseAdmin } = await import('./db');
  console.log('🌱 Seeding Supabase database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('EricRoy2025!', 12);
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', 'admin@ericroymusic.com')
    .single();

  if (!existingUser) {
    const { error } = await supabaseAdmin.from('users').insert({
      email: 'admin@ericroymusic.com',
      password: hashedPassword,
      name: 'Eric Roy',
      role: 'admin',
    });
    if (error) console.error('Error creating admin user:', error.message);
    else console.log('✅ Admin user created');
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // Site settings
  const settings = [
    { key: 'site_name', value: 'Eric Roy Music' },
    { key: 'site_tagline', value: 'Eric Roy is FUOWG' },
    { key: 'site_description', value: 'In pulvinar aliquet fringilla. Mauris commodo justo eu dolor tristique iaculis. Proin sit amet velit iaculis, aliquet massa vel, suscipit ante. Mauris iaculis erat at pellentesque blandit. Morbi commodo enim at nulla scelerisque gravida. Sed vulputate viverra vulputate. Maecenas in scelerisque lorem, maximus ullamcorper mauris.' },
    { key: 'contact_address', value: '001, Washington, 2226 United States.' },
    { key: 'contact_phone', value: '+02 (231) 0000 11' },
    { key: 'contact_email', value: 'info@example.com' },
    { key: 'contact_description', value: 'Morbi commodo enim at nulla scelerisque gravida. Sed vulputate viverra vulputate. Maecenas in scelerisque lorem, maximus ullamcorper mauris.' },
    { key: 'social_facebook', value: 'https://facebook.com/ericroymusic' },
    { key: 'social_twitter', value: '' },
    { key: 'social_youtube', value: 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC' },
    { key: 'social_instagram', value: '' },
    { key: 'social_pinterest', value: '' },
    { key: 'social_soundcloud', value: 'https://soundcloud.com/user-307966017' },
    { key: 'social_apple_music', value: 'https://music.apple.com/us/artist/eric-roy/1699117390' },
    { key: 'apple_music_artist_link', value: 'https://music.apple.com/us/artist/eric-roy/1699117390' },
    { key: 'youtube_channel', value: 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC' },
    { key: 'newsletter_heading', value: 'UPCOMING EVENTS AND SPECIAL OFFERS' },
    { key: 'newsletter_subheading', value: 'GET WEEKLY NEWSLETTER' },
    { key: 'welcome_text', value: 'Welcome to where its at' },
  ];

  for (const s of settings) {
    await supabaseAdmin.from('site_settings').upsert(s, { onConflict: 'key' });
  }
  console.log('✅ Site settings created');

  // Hero sections
  const { data: existingHero } = await supabaseAdmin.from('hero_sections').select('id').limit(1);
  if (!existingHero || existingHero.length === 0) {
    await supabaseAdmin.from('hero_sections').insert({
      title: 'eric roy music',
      subtitle: 'Turn it up',
      background_image: '/images/hero-bg.jpg',
      cta_text: 'ERIC ROY ON APPLE MUSIC',
      cta_link: 'https://music.apple.com/us/artist/eric-roy/1699117390',
      sort_order: 1,
      is_active: true,
    });
    console.log('✅ Hero sections created');
  }

  // Singles
  const { data: existingSingles } = await supabaseAdmin.from('singles').select('id').limit(1);
  if (!existingSingles || existingSingles.length === 0) {
    await supabaseAdmin.from('singles').insert([
      {
        title: 'Bikinis and Beans',
        description: 'Full first version available now',
        cover_image: '/images/bikinis-and-beans.jpg',
        apple_music_link: 'https://music.apple.com/us/artist/eric-roy/1699117390',
        youtube_link: 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
        buy_link: 'https://buy.stripe.com/14AdR93GSgq2dTFcA6ffy00',
        buy_text: 'Buy full first version of Bikinis and Beans Here',
        is_latest: false,
        sort_order: 1,
      },
      {
        title: 'KEEP AWN',
        description: 'Latest Single',
        cover_image: '/images/keep-awn.jpg',
        apple_music_link: 'https://music.apple.com/us/artist/eric-roy/1699117390',
        youtube_link: 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
        is_latest: true,
        sort_order: 2,
      },
      {
        title: 'Cardboard Cocaine',
        description: 'Latest Single',
        cover_image: '/images/cardboard-cocaine.jpg',
        apple_music_link: 'https://music.apple.com/us/artist/eric-roy/1699117390',
        youtube_link: 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
        is_latest: true,
        sort_order: 3,
      },
    ]);
    console.log('✅ Singles created');
  }

  // Artists
  const { data: existingArtists } = await supabaseAdmin.from('artists').select('id').limit(1);
  if (!existingArtists || existingArtists.length === 0) {
    await supabaseAdmin.from('artists').insert([
      {
        name: "Sir'preme Aldean",
        song_title: 'Lost in Lust',
        youtube_link: 'https://www.youtube.com/watch?v=uMVSoiW-zW4',
        soundcloud_link: 'https://soundcloud.com/user-307966017',
        sort_order: 1,
      },
      {
        name: 'Patty Speed',
        song_title: 'The Sound Guy Story',
        youtube_link: 'https://www.youtube.com/watch?v=tNkzF4Hc-RM',
        soundcloud_link: 'https://soundcloud.com/user-307966017',
        sort_order: 2,
      },
      {
        name: 'Joel Laskey',
        song_title: 'Airplane',
        youtube_link: 'https://youtu.be/uwxA-iCvMXc?si=X77QM_69j9x9ccKg',
        soundcloud_link: 'https://soundcloud.com/user-307966017',
        sort_order: 3,
      },
      {
        name: 'Louie Anderson',
        song_title: 'Cream Puff Daddy',
        youtube_link: 'https://youtu.be/4lzBMmjCN7c',
        soundcloud_link: 'https://soundcloud.com/user-307966017',
        sort_order: 4,
      },
    ]);
    console.log('✅ Artists created');
  }

  // Blog posts
  const { data: existingPosts } = await supabaseAdmin.from('blog_posts').select('id').limit(1);
  if (!existingPosts || existingPosts.length === 0) {
    await supabaseAdmin.from('blog_posts').insert([
      {
        title: 'The Art of Connection',
        slug: 'the-art-of-connection',
        excerpt: "In the ever-evolving world, the art of forging genuine connections remains timeless. Whether it's with colleagues, clients, or partners, establishing a genuine rapport paves the way for collaborative success.",
        content: "In the ever-evolving world, the art of forging genuine connections remains timeless. Whether it's with colleagues, clients, or partners, establishing a genuine rapport paves the way for collaborative success.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey. To add more content here, click the small plus icon at the top left corner. There, you will find an existing selection of WordPress blocks and patterns, something to suit your every need for content creation.",
        author: 'Erix Coach and Car',
        category: 'Uncategorized',
        published_at: '2025-04-18T00:00:00Z',
      },
      {
        title: 'Beyond the Obstacle',
        slug: 'beyond-the-obstacle',
        excerpt: "Challenges in business are a given, but it's our response to them that defines our trajectory. Looking beyond the immediate obstacle, there lies a realm of opportunity and learning.",
        content: "Challenges in business are a given, but it's our response to them that defines our trajectory. Looking beyond the immediate obstacle, there lies a realm of opportunity and learning.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey.",
        author: 'Erix Coach and Car',
        category: 'Uncategorized',
        published_at: '2025-04-18T00:00:00Z',
      },
      {
        title: 'Growth Unlocked',
        slug: 'growth-unlocked',
        excerpt: 'Every business has a unique potential waiting to be tapped. Recognizing the keys to unlock this growth can set an enterprise on the path to unprecedented success.',
        content: "Every business has a unique potential waiting to be tapped. Recognizing the keys to unlock this growth can set an enterprise on the path to unprecedented success.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey.",
        author: 'Erix Coach and Car',
        category: 'Uncategorized',
        published_at: '2025-04-18T00:00:00Z',
      },
    ]);
    console.log('✅ Blog posts created');
  }

  console.log('🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@ericroymusic.com / EricRoy2025!');
}

seed().catch(console.error);
