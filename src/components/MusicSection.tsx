import { FaMusic, FaShoppingCart } from 'react-icons/fa';

interface Single {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  apple_music_link: string;
  youtube_link: string;
  buy_link: string;
  buy_text: string;
  is_latest: boolean;
}

interface MusicSectionProps {
  singles: Single[];
  welcomeText: string;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
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

        {/* All singles in order - latest first */}
        {[...latestSingles, ...otherSingles].map((single) => (
          <SingleBlock key={single.id} single={single} />
        ))}
      </div>
    </section>
  );
}

function SingleBlock({ single }: { single: Single }) {
  const videoId = getYouTubeId(single.youtube_link);

  return (
    <div className="mb-16">
      {/* Latest Single label */}
      {single.is_latest && (
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 uppercase tracking-wider text-[var(--accent)]">
          <FaMusic className="inline mr-3" />
          Latest Single
        </h3>
      )}

      {/* Title */}
      <h4 className="text-xl md:text-2xl font-bold text-center mb-6 uppercase tracking-wider">
        {single.title}
      </h4>

      {/* YouTube embed */}
      {videoId && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?rel=1&showinfo=1`}
              title={single.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Buy / Apple Music buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {single.buy_link && (
          <a
            href={single.buy_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-outline text-sm py-2"
          >
            <FaShoppingCart /> {single.buy_text || 'Buy Now'}
          </a>
        )}
      </div>
    </div>
  );
}
