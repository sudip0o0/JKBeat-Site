import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'JKBeat — Advanced YouTube Music Client for Android, Windows, Linux & macOS',
  description: 'Your music. Your rules. Discover JKBeat, an open-source YouTube Music client inspired by Material Design 3, for Android, Windows, Linux and macOS.',
  openGraph: { title: 'JKBeat — Your music. Your rules.', description: 'An open-source music experience, made for you.', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'JKBeat — Your music. Your rules.', images: ['/opengraph-image'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined&family=Material+Symbols+Rounded" rel="stylesheet" /></head><body>{children}</body></html>;
}
