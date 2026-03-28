import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { TerminalProvider } from '@/components/terminal-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Terminal } from '@/components/terminal'
import { ZenMode } from '@/components/zen-mode'
import { SearchProvider } from '@/components/search-provider'
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
    default: 'Jesse Weigel — The Observatory',
    template: '%s | Jesse Weigel',
  },
  description:
    'Software engineer, AI agent architect, and community builder. Projects, talks, and experiments.',
  metadataBase: new URL('https://jesseweigel.com'),
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TerminalProvider>
          <Nav />
          <div className="pt-14">{children}</div>
          <Footer />
          <Terminal />
          <ZenMode />
          <SearchProvider />
        </TerminalProvider>
      </body>
    </html>
  )
}
