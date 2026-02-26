import { FaYoutube } from 'react-icons/fa';

interface YouTubeSectionProps {
  channelUrl: string;
}

export default function YouTubeSection({ channelUrl }: YouTubeSectionProps) {
  if (!channelUrl) return null;

  return (
    <section className="section-dark">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 group"
        >
          <FaYoutube
            size={60}
            className="text-red-600 group-hover:text-red-500 transition-colors"
          />
          <div className="text-left">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Watch on</p>
            <p className="text-2xl md:text-3xl font-bold font-heading group-hover:text-red-500 transition-colors">
              YouTube
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
