import getDb from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');
  const db = getDb();

  // Create admin user
  const hashedPassword = await bcrypt.hash('EricRoy2025!', 12);
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@ericroymusic.com');
  if (!existingUser) {
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      'admin@ericroymusic.com',
      hashedPassword,
      'Eric Roy',
      'admin'
    );
    console.log('✅ Admin user created');
  }

  // Site settings
  const settings = [
    ['site_name', 'Eric Roy Music'],
    ['site_tagline', 'Eric Roy is FUOWG'],
    ['site_description', 'In pulvinar aliquet fringilla. Mauris commodo justo eu dolor tristique iaculis. Proin sit amet velit iaculis, aliquet massa vel, suscipit ante. Mauris iaculis erat at pellentesque blandit. Morbi commodo enim at nulla scelerisque gravida. Sed vulputate viverra vulputate. Maecenas in scelerisque lorem, maximus ullamcorper mauris.'],
    ['contact_address', '001, Washington, 2226 United States.'],
    ['contact_phone', '+02 (231) 0000 11'],
    ['contact_email', 'info@example.com'],
    ['contact_description', 'Morbi commodo enim at nulla scelerisque gravida. Sed vulputate viverra vulputate. Maecenas in scelerisque lorem, maximus ullamcorper mauris.'],
    ['social_facebook', 'https://facebook.com/ericroymusic'],
    ['social_twitter', ''],
    ['social_youtube', 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC'],
    ['social_instagram', ''],
    ['social_pinterest', ''],
    ['social_soundcloud', 'https://soundcloud.com/user-307966017'],
    ['social_apple_music', 'https://music.apple.com/us/artist/eric-roy/1699117390'],
    ['apple_music_artist_link', 'https://music.apple.com/us/artist/eric-roy/1699117390'],
    ['youtube_channel', 'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC'],
    ['newsletter_heading', 'UPCOMING EVENTS AND SPECIAL OFFERS'],
    ['newsletter_subheading', 'GET WEEKLY NEWSLETTER'],
    ['welcome_text', 'Welcome to where its at'],
  ];

  const upsertSetting = db.prepare(
    'INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)'
  );
  for (const [key, value] of settings) {
    upsertSetting.run(key, value);
  }
  console.log('✅ Site settings created');

  // Hero sections
  const existingHero = db.prepare('SELECT id FROM hero_sections LIMIT 1').get();
  if (!existingHero) {
    db.prepare(`INSERT INTO hero_sections (title, subtitle, background_image, cta_text, cta_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      'eric roy music',
      'Turn it up',
      '/images/hero-bg.jpg',
      'ERIC ROY ON APPLE MUSIC',
      'https://music.apple.com/us/artist/eric-roy/1699117390',
      1,
      1
    );
    console.log('✅ Hero sections created');
  }

  // Singles
  const existingSingles = db.prepare('SELECT id FROM singles LIMIT 1').get();
  if (!existingSingles) {
    const insertSingle = db.prepare(`INSERT INTO singles (title, description, cover_image, apple_music_link, youtube_link, buy_link, buy_text, is_latest, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    insertSingle.run(
      'Bikinis and Beans',
      'Full first version available now',
      '/images/bikinis-and-beans.jpg',
      'https://music.apple.com/us/artist/eric-roy/1699117390',
      'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
      'https://buy.stripe.com/14AdR93GSgq2dTFcA6ffy00',
      'Buy full first version of Bikinis and Beans Here',
      0,
      1
    );

    insertSingle.run(
      'KEEP AWN',
      'Latest Single',
      '/images/keep-awn.jpg',
      'https://music.apple.com/us/artist/eric-roy/1699117390',
      'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
      '',
      '',
      1,
      2
    );

    insertSingle.run(
      'Cardboard Cocaine',
      'Latest Single',
      '/images/cardboard-cocaine.jpg',
      'https://music.apple.com/us/artist/eric-roy/1699117390',
      'https://youtube.com/@ericroymusic?si=rP_w2b-6ucj6ZIlC',
      '',
      '',
      1,
      3
    );

    console.log('✅ Singles created');
  }

  // Artists
  const existingArtists = db.prepare('SELECT id FROM artists LIMIT 1').get();
  if (!existingArtists) {
    const insertArtist = db.prepare(`INSERT INTO artists (name, song_title, description, youtube_link, soundcloud_link, sort_order) VALUES (?, ?, ?, ?, ?, ?)`);

    insertArtist.run(
      "Sir'preme Aldean",
      'Lost in Lust',
      '',
      'https://www.youtube.com/watch?v=uMVSoiW-zW4',
      'https://soundcloud.com/user-307966017',
      1
    );

    insertArtist.run(
      'Patty Speed',
      'The Sound Guy Story',
      '',
      'https://www.youtube.com/watch?v=tNkzF4Hc-RM',
      'https://soundcloud.com/user-307966017',
      2
    );

    insertArtist.run(
      'Joel Laskey',
      'Airplane',
      '',
      'https://youtu.be/uwxA-iCvMXc?si=X77QM_69j9x9ccKg',
      'https://soundcloud.com/user-307966017',
      3
    );

    insertArtist.run(
      'Louie Anderson',
      'Cream Puff Daddy',
      '',
      'https://youtu.be/4lzBMmjCN7c',
      'https://soundcloud.com/user-307966017',
      4
    );

    console.log('✅ Artists created');
  }

  // Blog posts
  const existingPosts = db.prepare('SELECT id FROM blog_posts LIMIT 1').get();
  if (!existingPosts) {
    const insertPost = db.prepare(`INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    insertPost.run(
      'The Art of Connection',
      'the-art-of-connection',
      'In the ever-evolving world, the art of forging genuine connections remains timeless. Whether it\'s with colleagues, clients, or partners, establishing a genuine rapport paves the way for collaborative success.',
      'In the ever-evolving world, the art of forging genuine connections remains timeless. Whether it\'s with colleagues, clients, or partners, establishing a genuine rapport paves the way for collaborative success.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey. To add more content here, click the small plus icon at the top left corner. There, you will find an existing selection of WordPress blocks and patterns, something to suit your every need for content creation.',
      'Erix Coach and Car',
      'Uncategorized',
      '2025-04-18'
    );

    insertPost.run(
      'Beyond the Obstacle',
      'beyond-the-obstacle',
      'Challenges in business are a given, but it\'s our response to them that defines our trajectory. Looking beyond the immediate obstacle, there lies a realm of opportunity and learning.',
      'Challenges in business are a given, but it\'s our response to them that defines our trajectory. Looking beyond the immediate obstacle, there lies a realm of opportunity and learning.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey.',
      'Erix Coach and Car',
      'Uncategorized',
      '2025-04-18'
    );

    insertPost.run(
      'Growth Unlocked',
      'growth-unlocked',
      'Every business has a unique potential waiting to be tapped. Recognizing the keys to unlock this growth can set an enterprise on the path to unprecedented success.',
      'Every business has a unique potential waiting to be tapped. Recognizing the keys to unlock this growth can set an enterprise on the path to unprecedented success.\n\nWelcome to WordPress! This is a sample post. Edit or delete it to take the first step in your blogging journey.',
      'Erix Coach and Car',
      'Uncategorized',
      '2025-04-18'
    );

    console.log('✅ Blog posts created');
  }

  console.log('🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@ericroymusic.com / EricRoy2025!');
}

seed().catch(console.error);
