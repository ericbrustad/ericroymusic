import Link from 'next/link';
import { FaCalendar, FaFolder, FaArrowRight } from 'react-icons/fa';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  published_at: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="section-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[var(--accent)] uppercase tracking-widest text-sm mb-2">Our Blog</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Latest News</h2>
          <div className="w-24 h-1 bg-[var(--accent)] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card group">
              {/* Post image placeholder */}
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

                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[var(--accent)] hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                  >
                    Read More <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-secondary inline-block">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
