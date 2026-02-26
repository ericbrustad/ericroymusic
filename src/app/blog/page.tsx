import Link from 'next/link';
import { supabase } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCalendar, FaFolder, FaArrowRight } from 'react-icons/fa';

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

export default async function BlogPage() {
  const settings = await getSettings();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <main>
      <Header siteName={settings.site_name || 'Eric Roy Music'} tagline={settings.site_tagline || ''} />

      <section className="pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Blog</h1>
            <div className="w-24 h-1 bg-[var(--accent)] mx-auto" />
          </div>

          {(!posts || posts.length === 0) ? (
            <p className="text-center text-gray-400">No blog posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="card group">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl text-white/10 font-bold font-heading">ER</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaFolder />
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{post.author}</span>
                      <Link href={`/blog/${post.slug}`} className="text-[var(--accent)] hover:text-red-400 text-sm flex items-center gap-1 transition-colors">
                        Read More <FaArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} recentPosts={recentPosts || []} />
    </main>
  );
}
