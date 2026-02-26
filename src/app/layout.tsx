import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eric Roy Music',
  description: 'Official website of Eric Roy Music - Turn it up!',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
