import { getTransmissions } from '@/lib/content'
import { TransmissionCard } from '@/components/transmission-card'

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
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight">Transmissions</h1>
      <p className="mt-2 text-muted-foreground">Signals sent out into the world — talks, podcasts, and streams.</p>

      {talks.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Conference Talks</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{talks.map((t) => <TransmissionCard key={t.slug} transmission={t} />)}</div>
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
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">YouTube</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{youtube.map((t) => <TransmissionCard key={t.slug} transmission={t} />)}</div>
        </section>
      )}
    </main>
  )
}
