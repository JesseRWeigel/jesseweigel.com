import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { TerminalProvider } from '@/components/terminal-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ZenMode } from '@/components/zen-mode'
import { SearchProvider } from '@/components/search-provider'
import { EasterEggs } from '@/components/easter-eggs'
import { SITE_URL, socialLinks } from '@/lib/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Jesse Weigel — Generative AI Engineer & Agent Systems Builder',
    template: '%s | Jesse Weigel',
  },
  description:
    'Generative AI engineer building autonomous agent teams, evaluation infrastructure, developer tools, and ambitious experiments.',
  metadataBase: new URL(SITE_URL),
  applicationName: 'The Observatory',
  authors: [{ name: 'Jesse Weigel', url: SITE_URL }],
  creator: 'Jesse Weigel',
  keywords: [
    'Jesse Weigel',
    'generative AI engineer',
    'AI agents',
    'multi-agent systems',
    'LLM orchestration',
    'TypeScript',
    'autonomous systems',
  ],
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Jesse Weigel — The Observatory',
    title: 'Jesse Weigel — Generative AI Engineer & Agent Systems Builder',
    description:
      'Autonomous agent teams, evaluation infrastructure, developer tools, and ambitious experiments.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@JesseRWeigel',
    title: 'Jesse Weigel — Generative AI Engineer & Agent Systems Builder',
    description:
      'Autonomous agent teams, evaluation infrastructure, developer tools, and ambitious experiments.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#jesse-weigel`,
  name: 'Jesse Weigel',
  url: SITE_URL,
  image: 'https://avatars.githubusercontent.com/u/11077930?v=4',
  jobTitle: 'Generative AI Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'TRACTIAN',
    url: 'https://tractian.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Steubenville',
    addressRegion: 'Ohio',
    addressCountry: 'US',
  },
  sameAs: Object.values(socialLinks),
  knowsAbout: [
    'Generative AI',
    'Multi-agent systems',
    'LLM evaluation',
    'TypeScript',
    'React',
    'Developer tooling',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Jesse Weigel — The Observatory',
  description:
    'Autonomous systems, developer tools, research experiments, talks, and field notes by Jesse Weigel.',
  author: { '@id': `${SITE_URL}/#jesse-weigel` },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, websiteJsonLd]).replace(/</g, '\\u003c'),
          }}
        />
        <TerminalProvider>
          <Nav />
          <div id="main-content" className="page-shell">{children}</div>
          <Footer />
          <ZenMode />
          <SearchProvider />
          <EasterEggs />
        </TerminalProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
