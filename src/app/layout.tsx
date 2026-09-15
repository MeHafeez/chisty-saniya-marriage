import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Playfair_Display, Inter, Great_Vibes } from 'next/font/google';

import { ExperienceShell } from '@/components/experience/ExperienceShell';
import { ExperienceProvider } from '@/context/ExperienceProvider';
import { SITE } from '@/constants/site';
import { COUPLE, VENUE, WEDDING } from '@/constants/wedding';
import '@/styles/globals.css';

/* — Typefaces —————————————————————————————————————— */

/**
 * Only the weights actually asked for. next/font preloads every file it is
 * given, and on a phone those preloads compete with the banner for the first
 * few hundred milliseconds — so an unused weight is not merely dead bytes.
 *
 * 300 and 400 are what the page uses: `font-light` and the default. Nothing
 * sets `font-semibold` anywhere, and the only `font-medium` is on Inter, which
 * is variable and covers it in the one file.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Playfair Display starts at 400 — it has no 300 — so the `font-light` on the
// elements set in it already resolves to 400. Asking for one weight changes
// nothing on screen and drops four files.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vibes',
  display: 'swap',
});

/* — SEO ———————————————————————————————————————————— */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.shortName }],
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/images/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** schema.org Event so the wedding surfaces properly when the link is shared. */
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `${COUPLE.groom.fullName} & ${COUPLE.bride.fullName} — ${WEDDING.occasion}`,
  startDate: WEDDING.date.toISOString(),
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  description: SITE.description,
  image: [`${SITE.url}/images/og-image.svg`],
  location: {
    '@type': 'Place',
    name: VENUE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: VENUE.addressLines[0],
      addressLocality: VENUE.addressLines[1],
      addressCountry: VENUE.city,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: VENUE.coordinates.lat,
      longitude: VENUE.coordinates.lng,
    },
  },
  organizer: { '@type': 'Person', name: WEDDING.hosts },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${greatVibes.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          // Serialised from a local constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        <ExperienceProvider>
          <ExperienceShell>{children}</ExperienceShell>
        </ExperienceProvider>
      </body>
    </html>
  );
}
