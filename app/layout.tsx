import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SITE } from '@/lib/site';
import { getCurrentUser } from '@/lib/auth';

const sinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '700'],
  variable: '--font-sinhala',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.creator }],
  keywords: ['Sinhala stories', 'Sinhala novels', 'සිංහල කතා', 'MATHRA WORLD', 'knowledge', 'Sri Lanka'],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    locale: 'si_LK',
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#07040f',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="si" className={`${sinhala.variable} ${inter.variable}`}>
      <body className="font-sinhala antialiased">
        <LoadingScreen />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-mathra-gold focus:px-4 focus:py-2 focus:text-black"
        >
          ප්‍රධාන අන්තර්ගතයට යන්න
        </a>
        <Navbar signedIn={!!user} displayName={user?.displayName} />
        <main id="main" className="min-h-[70dvh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
