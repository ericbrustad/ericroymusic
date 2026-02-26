import { FaMusic, FaShoppingCart, FaYoutube } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

interface Single {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  apple_music_link: string;
  youtube_link: string;
  buy_link: string;
  buy_text: string;
  is_latest: number;
}

interface MusicSectionProps {
  singles: Single[];
  welcomeText: string;
}

export default function MusicSection({ singles, welcomeText }: MusicSectionProps) {
  const latestSingles = singles.filter(s => s.is_latest);
  const otherSingles = singles.filter(s => !s.is_latest);

  return (
    <section id="music" className="section-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome text */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{welcomeText}</h2>
          <div className="w-24 h-1 bg-[var(--accent)] mx-auto" />
        </div>

        {/* Latest Singles */}
        {latestSingles.length > 0 && (
          <div className="mb-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 uppercase tracking-wider text-[var(--accent)]">
              <FaMusic className="inline mr-3" />
              Latest Singles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestSingles.map((single) => (
                <SingleCard key={single.id} single={single} />
              ))}
            </div>
          </div>
        )}

        {/* Other Releases */}
        {otherSingles.length > 0 && (
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 uppercase tracking-wider">
              Releases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherSingles.map((single) => (
                <SingleCard key={single.id} single={single} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SingleCard({ single }: { single: Single }) {
  return (
    <div className="card group">
      {/* Cover image placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <FaMusic className="text-6xl text-white/20 group-hover:text-white/40 transition-all duration-500 group-hover:scale-125" />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-2xl font-bold text-white uppercase">{single.title}</h3>
          {single.is_latest === 1 && (
            <span className="inline-block mt-2 bg-[var(--accent)] text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Latest Single
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6">
        {single.description && (
          <p className="text-gray-400 mb-4">{single.description}</p>
        )}

        <div className="flex flex-wrap gap-3">
          {single.apple_music_link && (
            <a
              href={single.apple_music_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              <SiApplemusic /> Apple Music
            </a>
          )}
          {single.youtube_link && (
            <a
              href={single.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              <FaYoutube /> YouTube
            </a>
          )}
          {single.buy_link && (
            <a
              href={single.buy_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-gold text-sm py-2"
            >
              <FaShoppingCart /> {single.buy_text || 'Buy Now'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
