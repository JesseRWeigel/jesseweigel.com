import { getArchiveEntries } from '@/lib/content'
import { PageTransition } from '@/components/page-transition'

export const metadata = {
  title: 'Archive',
  description: 'Research papers, analyses, and deep writing by Jesse Weigel.',
}

const categoryLabels: Record<string, string> = {
  paper: 'Paper',
  analysis: 'Analysis',
  report: 'Report',
}

export default async function ArchivePage() {
  const entries = await getArchiveEntries()

  return (
    <PageTransition>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Archive</h1>
        <p className="mt-2 text-muted-foreground">
          Research papers, analyses, and deep writing.
        </p>

        <div className="mt-10 space-y-8">
          {entries.map((entry) => (
            <article key={entry.slug} className="border-b border-white/5 pb-8 last:border-0">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {categoryLabels[entry.category]} · {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
              <h2 className="mt-2 text-lg font-medium text-foreground">
                {entry.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
              <div className="mt-3 flex gap-3 text-xs">
                {entry.links.arxiv && (
                  <a href={entry.links.arxiv} target="_blank" rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4">arXiv</a>
                )}
                {entry.links.pdf && (
                  <a href={entry.links.pdf} target="_blank" rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4">PDF</a>
                )}
                {entry.links.github && (
                  <a href={entry.links.github} target="_blank" rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4">GitHub</a>
                )}
              </div>
            </article>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No archive entries yet.
          </p>
        )}
      </main>
    </PageTransition>
  )
}
