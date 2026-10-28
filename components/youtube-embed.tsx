'use client'

import Image from 'next/image'
import { useState } from 'react'

function getVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const videoId = getVideoId(url)
  if (!videoId) return null

  if (playing) {
    return (
      <div className="youtube-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="youtube-iframe"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="youtube-poster"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="youtube-poster-image"
      />
      <div className="youtube-play-wrap">
        <div className="youtube-play-button">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  )
}
