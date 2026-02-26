'use client';

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface NewsletterProps {
  heading: string;
  subheading: string;
}

export default function Newsletter({ heading, subheading }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-purple-900/30" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-wider">{heading}</h3>
        <h4 className="text-lg md:text-xl text-gray-300 mb-8 uppercase tracking-wider">{subheading}</h4>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] flex-1 max-w-md"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <FaPaperPlane />
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
