import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCalendar, FaFolder, FaUser, FaArrowLeft } from 'react-icons/fa';

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

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const settings = await getSettings();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!post) {
    notFound();
  }

  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const { data: prevPosts } = await supabase
    .from('blog_posts')
    .select('title, slug')
    .eq('is_published', true)
    .lt('published_at', post.published_at)
    .order('published_at', { ascending: false })
    .limit(1);

  const { data: nextPosts } = await supabase
    .from('blog_posts')
    .select('title, slug')
    .eq('is_published', true)
    .gt('published_at', post.published_at)
    .order('published_at', { ascending: true })
    .limit(1);

  const prevPost = prevPosts?.[0] || null;
  const nextPost = nextPosts?.[0] || null;

  return (
    <main>
      <Header siteName={settings.site_name || 'Eric Roy Music'} tagline={settings.site_tagline || ''} />

      <article className="pt-28 pb-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <FaArrowLeft /> Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-white/10">
            <span className="flex items-center gap-2">
              <FaUser className="text-[var(--accent)]" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar className="text-[var(--accent)]" />
              {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <FaFolder className="text-[var(--accent)]" />
              {post.category}
            </span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() ? <p key={i} className="text-gray-300 leading-relaxed mb-6">{paragraph}</p> : null
            ))}
          </div>

          <div className="flex justify-between mt-16 pt-8 border-t border-white/10">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="text-gray-400 hover:text-white transition-colors">
                ← {prevPost.title}
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="text-gray-400 hover:text-white transition-colors">
                {nextPost.title} →
              </Link>
            ) : <div />}
          </div>
        </div>
      </article>

      <Footer settings={settings} recentPosts={recentPosts || []} />
    </main>
  );
}
