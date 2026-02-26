import { supabase } from '@/lib/db';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MusicSection from '@/components/MusicSection';
import ArtistsSection from '@/components/ArtistsSection';
import YouTubeSection from '@/components/YouTubeSection';
import BlogSection from '@/components/BlogSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

async function getSettings(): Promise<Record<string, string>> {
  const { data: rows } = await supabase.from('site_settings').select('key, value');
  const settings: Record<string, string> = {};
  if (rows) {
    for (const row of rows) {
      settings[row.key] = row.value;
    }
  }
  return settings;
}

export default async function Home() {
  const settings = await getSettings();

  const { data: heroData } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single();

  const { data: singles } = await supabase
    .from('singles')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const { data: artists } = await supabase
    .from('artists')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <main>
      <Header
        siteName={settings.site_name || 'Eric Roy Music'}
        tagline={settings.site_tagline || ''}
      />

      {heroData && (
        <Hero
          title={heroData.title}
          subtitle={heroData.subtitle || ''}
          ctaText={heroData.cta_text || ''}
          ctaLink={heroData.cta_link || ''}
          backgroundImage={heroData.background_image}
        />
      )}

      <MusicSection
        singles={singles || []}
        welcomeText={settings.welcome_text || 'Welcome to where its at'}
      />

      <YouTubeSection channelUrl={settings.youtube_channel || ''} />

      <ArtistsSection artists={artists || []} />

      <BlogSection posts={posts || []} />

      <Newsletter
        heading={settings.newsletter_heading || 'UPCOMING EVENTS AND SPECIAL OFFERS'}
        subheading={settings.newsletter_subheading || 'GET WEEKLY NEWSLETTER'}
      />

      <Footer settings={settings} recentPosts={recentPosts || []} />
    </main>
  );
}
