'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

interface HeaderProps {
  siteName: string;
  tagline: string;
}

export default function Header({ siteName, tagline }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
              {siteName}
            </span>
            <span className="text-xs text-gray-400 -mt-1">{tagline}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Home
            </a>
            <a href="#music" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Music
            </a>
            <a href="#artists" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Artists
            </a>
            <a href="#blog" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Blog
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Contact
            </a>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              All Posts
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="#home" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                Home
              </a>
              <a href="#music" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                Music
              </a>
              <a href="#artists" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                Artists
              </a>
              <a href="#blog" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                Blog
              </a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                Contact
              </a>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                All Posts
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
