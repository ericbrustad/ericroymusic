import { FaApple } from 'react-icons/fa';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-0" />

      {/* Animated background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 uppercase tracking-tight">
          {title}
        </h1>
        <h4 className="text-xl md:text-3xl text-gray-300 mb-10 font-light tracking-widest uppercase">
          {subtitle}
        </h4>
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn-primary text-lg px-10 py-4 glow-pulse"
          >
            <FaApple size={24} />
            {ctaText}
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
