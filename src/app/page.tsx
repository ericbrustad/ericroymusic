import getDb from '@/lib/db';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MusicSection from '@/components/MusicSection';
import ArtistsSection from '@/components/ArtistsSection';
import YouTubeSection from '@/components/YouTubeSection';
import BlogSection from '@/components/BlogSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

function getSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as any[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export default function Home() {
  const db = getDb();
  const settings = getSettings();

  // Get hero
  const hero = db.prepare('SELECT * FROM hero_sections WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 1').get() as any;

  // Get singles
  const singles = db.prepare('SELECT * FROM singles WHERE is_active = 1 ORDER BY sort_order ASC').all() as any[];

  // Get artists
  const artists = db.prepare('SELECT * FROM artists WHERE is_active = 1 ORDER BY sort_order ASC').all() as any[];

  // Get blog posts
  const posts = db.prepare('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3').all() as any[];

  // Recent posts for footer
  const recentPosts = db.prepare('SELECT title, slug, excerpt FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3').all() as any[];

  return (
    <main>
      <Header
        siteName={settings.site_name || 'Eric Roy Music'}
        tagline={settings.site_tagline || ''}
      />

      {hero && (
        <Hero
          title={hero.title}
          subtitle={hero.subtitle || ''}
          ctaText={hero.cta_text || ''}
          ctaLink={hero.cta_link || ''}
          backgroundImage={hero.background_image}
        />
      )}

      <MusicSection
        singles={singles}
        welcomeText={settings.welcome_text || 'Welcome to where its at'}
      />

      <YouTubeSection channelUrl={settings.youtube_channel || ''} />

      <ArtistsSection artists={artists} />

      <BlogSection posts={posts} />

      <Newsletter
        heading={settings.newsletter_heading || 'UPCOMING EVENTS AND SPECIAL OFFERS'}
        subheading={settings.newsletter_subheading || 'GET WEEKLY NEWSLETTER'}
      />

      <Footer settings={settings} recentPosts={recentPosts} />
    </main>
  );
}
