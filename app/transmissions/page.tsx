import { getTransmissions } from '@/lib/content'
import { TransmissionCard } from '@/components/transmission-card'
import { PageTransition } from '@/components/page-transition'
import { YouTubeEmbed } from '@/components/youtube-embed'

export const metadata = {
  title: 'Transmissions',
  description: 'Conference talks, podcast appearances, and YouTube content by Jesse Weigel.',
}

export default async function TransmissionsPage() {
  const all = await getTransmissions()
  const talks = all.filter((t) => t.type === 'talk')
  const podcasts = all.filter((t) => t.type === 'podcast')
  const youtube = all.filter((t) => t.type === 'youtube')

  return (
    <PageTransition>
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Transmissions</h1>
      <p className="mt-2 text-muted-foreground">Signals sent out into the world — talks, podcasts, and streams.</p>

      {talks.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Conference Talks</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {talks.map((t) => {
              const hasVideo = t.links.watch && (t.links.watch.includes('watch?v=') || t.links.watch.includes('youtu.be/'))
              return (
                <div key={t.slug} className="space-y-3">
                  {hasVideo && t.links.watch && (
                    <YouTubeEmbed url={t.links.watch} title={t.title} />
                  )}
                  <TransmissionCard transmission={t} />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {podcasts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Podcast Appearances</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{podcasts.map((t) => <TransmissionCard key={t.slug} transmission={t} />)}</div>
        </section>
      )}

      {youtube.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            YouTube
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {youtube.map((t) => {
              const isPlayableVideo = t.links.watch?.includes('watch?v=') || t.links.watch?.includes('youtu.be/')
              return (
                <div key={t.slug} className="space-y-3">
                  {isPlayableVideo && t.links.watch && (
                    <YouTubeEmbed url={t.links.watch} title={t.title} />
                  )}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t.venue}
                    </p>
                    <h3 className="mt-1 text-base font-medium text-foreground">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                    {!isPlayableVideo && t.links.watch && (
                      <a href={t.links.watch} target="_blank" rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-primary underline underline-offset-4">
                        Watch on YouTube
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
    </PageTransition>
  )
}
