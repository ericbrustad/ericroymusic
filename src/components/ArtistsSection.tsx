import { FaSoundcloud } from 'react-icons/fa';

interface Artist {
  id: number;
  name: string;
  song_title: string;
  description: string;
  image: string;
  youtube_link: string;
  soundcloud_link: string;
}

interface ArtistsSectionProps {
  artists: Artist[];
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function ArtistsSection({ artists }: ArtistsSectionProps) {
  if (!artists || artists.length === 0) return null;

  return (
    <section id="artists" className="section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Eric Roy Music</h2>
          <div className="w-24 h-1 bg-[var(--accent)] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artists.map((artist) => {
            const videoId = getYouTubeId(artist.youtube_link);
            return (
              <div key={artist.id} className="card group">
                {/* YouTube embed */}
                {videoId && (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-t-lg"
                      src={`https://www.youtube.com/embed/${videoId}?rel=1&showinfo=1`}
                      title={artist.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">
                    {artist.youtube_link ? (
                      <a
                        href={artist.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] transition-colors"
                      >
                        {artist.name}
                      </a>
                    ) : (
                      artist.name
                    )}
                  </h3>
                  <p className="text-[var(--accent)] text-sm uppercase tracking-wider mb-3">
                    {artist.song_title}
                  </p>
                  {artist.description && (
                    <p className="text-gray-400 text-sm mb-4">{artist.description}</p>
                  )}

                  <div className="flex gap-3">
                    {artist.soundcloud_link && (
                      <a
                        href={artist.soundcloud_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 transition-colors"
                        title="Listen on SoundCloud"
                      >
                        <FaSoundcloud size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
