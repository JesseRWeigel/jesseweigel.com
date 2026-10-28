import type { Transmission } from '@/lib/types'

const typeLabels = {
  talk: 'Conference talk',
  podcast: 'Podcast',
  youtube: 'Video',
} as const

function formatYear(date: string) {
  return new Date(date).getFullYear()
}

export function TransmissionCard({ transmission }: { transmission: Transmission }) {
  return (
    <article className="transmission-card">
      <div className="transmission-meta">
        <span>{typeLabels[transmission.type]}</span>
        <span>{formatYear(transmission.date)}</span>
      </div>
      <div className="transmission-copy">
        <p>{transmission.venue}</p>
        <h3>{transmission.title}</h3>
        <p>{transmission.description || transmission.content.trim()}</p>
      </div>
      <div className="transmission-links" aria-label={`Links for ${transmission.title}`}>
        {transmission.links.watch && (
          <a href={transmission.links.watch} target="_blank" rel="noopener noreferrer">Watch ↗</a>
        )}
        {transmission.links.listen && (
          <a href={transmission.links.listen} target="_blank" rel="noopener noreferrer">Listen ↗</a>
        )}
        {transmission.links.spotify && (
          <a href={transmission.links.spotify} target="_blank" rel="noopener noreferrer">Spotify ↗</a>
        )}
        {transmission.links.slides && (
          <a href={transmission.links.slides} target="_blank" rel="noopener noreferrer">Slides ↗</a>
        )}
      </div>
    </article>
  )
}
