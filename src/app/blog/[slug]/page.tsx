import Link from 'next/link';
import { notFound } from 'next/navigation';
import getDb from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCalendar, FaFolder, FaUser, FaArrowLeft } from 'react-icons/fa';

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const db = getDb();
  const settings = getSettings();
  const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').get(params.slug) as any;

  if (!post) {
    notFound();
  }

  const recentPosts = db.prepare('SELECT title, slug, excerpt FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3').all() as any[];

  // Previous and next posts
  const prevPost = db.prepare('SELECT title, slug FROM blog_posts WHERE is_published = 1 AND published_at < ? ORDER BY published_at DESC LIMIT 1').get(post.published_at) as any;
  const nextPost = db.prepare('SELECT title, slug FROM blog_posts WHERE is_published = 1 AND published_at > ? ORDER BY published_at ASC LIMIT 1').get(post.published_at) as any;

  return (
    <main>
      <Header siteName={settings.site_name || 'Eric Roy Music'} tagline={settings.site_tagline || ''} />

      <article className="pt-28 pb-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <FaArrowLeft /> Back to Blog
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-white/10">
            <span className="flex items-center gap-2">
              <FaUser className="text-[var(--accent)]" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar className="text-[var(--accent)]" />
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <FaFolder className="text-[var(--accent)]" />
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() ? <p key={i} className="text-gray-300 leading-relaxed mb-6">{paragraph}</p> : null
            ))}
          </div>

          {/* Navigation */}
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

      <Footer settings={settings} recentPosts={recentPosts} />
    </main>
  );
}
