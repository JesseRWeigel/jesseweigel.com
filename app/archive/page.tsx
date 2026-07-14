import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { getArchiveEntries } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Research Archive',
  description:
    'Autonomous research runs, mathematical proofs, technical analyses, and source artifacts from Jesse Weigel.',
  alternates: { canonical: '/archive' },
}

const categoryLabels = {
  paper: 'Research paper',
  analysis: 'Analysis',
  report: 'Research report',
} as const

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export default async function ArchivePage() {
  const entries = await getArchiveEntries()

  return (
    <PageTransition>
      <main className="archive-page">
        <div className="site-container">
          <header className="content-hero archive-hero">
            <p className="eyebrow">Research · The Archive</p>
            <h1>What happens when the system is allowed to keep going?</h1>
            <div className="content-hero-bottom">
              <p>
                Papers, analyses, and research artifacts produced by autonomous research systems.
                The source stays attached so the claim can be inspected, reproduced, or challenged.
              </p>
              <p className="archive-method-note">
                <strong>Method note</strong>
                These are experimental AI-assisted research outputs—not a substitute for peer
                review. Each entry identifies the available source artifacts.
              </p>
            </div>
          </header>

          <section className="archive-index" aria-label={`${entries.length} research entries`}>
            {entries.map((entry, index) => (
              <article key={entry.slug} className="archive-entry">
                <div className="archive-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="archive-entry-copy">
                  <p className="archive-entry-meta">
                    {categoryLabels[entry.category]} · {formatDate(entry.date)}
                  </p>
                  <h2>{entry.title}</h2>
                  <p>{entry.description}</p>
                </div>
                <div className="archive-links" aria-label={`Artifacts for ${entry.title}`}>
                  {entry.links.arxiv && <a href={entry.links.arxiv} target="_blank" rel="noopener noreferrer">arXiv ↗</a>}
                  {entry.links.pdf && <a href={entry.links.pdf} target="_blank" rel="noopener noreferrer">PDF ↗</a>}
                  {entry.links.github && <a href={entry.links.github} target="_blank" rel="noopener noreferrer">Source ↗</a>}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
