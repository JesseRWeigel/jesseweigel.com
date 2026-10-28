import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/content'

export const alt = 'Project'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  const title = project?.title || 'Project'
  const description = project?.description || ''

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(145deg, #080a0d 0%, #11151b 55%, #18130b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          fontFamily: 'system-ui',
          padding: '72px 82px',
        }}
      >
        <p
          style={{
            fontSize: 17,
            color: '#f1a941',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Jesse Weigel · Selected system
        </p>
        <h1
          style={{
            maxWidth: '1000px',
            fontSize: 78,
            fontWeight: 480,
            color: '#f4f1ea',
            letterSpacing: '-0.055em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 21,
            color: '#9ca2aa',
            lineHeight: 1.45,
            maxWidth: '900px',
          }}
        >
          {description}
        </p>
      </div>
    ),
    { ...size }
  )
}
