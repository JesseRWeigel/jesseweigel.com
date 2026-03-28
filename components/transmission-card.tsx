import type { Transmission } from '@/lib/types'

const typeIcons: Record<string, string> = {
  talk: '🎤',
  podcast: '🎧',
  youtube: '📺',
}

const typeLabels: Record<string, string> = {
  talk: 'Talk',
  podcast: 'Podcast',
  youtube: 'YouTube',
}

export function TransmissionCard({ transmission }: { transmission: Transmission }) {
  return (
    <article className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">{typeIcons[transmission.type]}</span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {typeLabels[transmission.type]} &middot; {transmission.venue}
          </p>
          <h3 className="mt-1 text-base font-medium text-foreground transition-colors group-hover:text-primary">
            {transmission.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{transmission.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {transmission.links.watch && (
              <a href={transmission.links.watch} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Watch</a>
            )}
            {transmission.links.listen && (
              <a href={transmission.links.listen} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Listen</a>
            )}
            {transmission.links.spotify && (
              <a href={transmission.links.spotify} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Spotify</a>
            )}
            {transmission.links.slides && (
              <a href={transmission.links.slides} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Slides</a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
