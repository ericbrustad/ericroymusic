import Link from 'next/link';
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaSoundcloud,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

interface FooterProps {
  settings: Record<string, string>;
  recentPosts: Array<{ title: string; slug: string; excerpt: string }>;
}

export default function Footer({ settings, recentPosts }: FooterProps) {
  const socialLinks = [
    { key: 'social_facebook', icon: FaFacebook, label: 'Facebook' },
    { key: 'social_twitter', icon: FaTwitter, label: 'Twitter' },
    { key: 'social_youtube', icon: FaYoutube, label: 'YouTube' },
    { key: 'social_instagram', icon: FaInstagram, label: 'Instagram' },
    { key: 'social_pinterest', icon: FaPinterest, label: 'Pinterest' },
    { key: 'social_soundcloud', icon: FaSoundcloud, label: 'SoundCloud' },
    { key: 'social_apple_music', icon: SiApplemusic, label: 'Apple Music' },
  ];

  return (
    <footer id="contact" className="bg-[#050505] border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">{settings.site_name || 'Eric Roy Music'}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings.site_description || ''}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ key, icon: Icon, label }) =>
                settings[key] ? (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 hover:bg-[var(--accent)] rounded-full flex items-center justify-center transition-colors"
                    title={label}
                  >
                    <Icon size={16} />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Latest News */}
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Latest News</h4>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.slug}>
                  <h5 className="text-sm font-semibold">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </Link>
                  </h5>
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Contact Us</h4>
            <p className="text-gray-400 text-sm mb-6">{settings.contact_description || ''}</p>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Washington</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-[var(--accent)] flex-shrink-0" />
                {settings.contact_address || ''}
              </p>
              {settings.contact_phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-[var(--accent)]" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </p>
              )}
              {settings.contact_email && (
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-[var(--accent)]" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                    {settings.contact_email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © Copyright {new Date().getFullYear()}. All Rights Reserved. {settings.site_name || 'Eric Roy Music'}
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <Link href="/admin" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
