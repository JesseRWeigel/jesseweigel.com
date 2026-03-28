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
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          padding: '60px',
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: '#f59e0b',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Workshop
        </p>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 300,
            color: '#e2e8f0',
            textAlign: 'center',
            margin: '16px 0',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
      </div>
    ),
    { ...size }
  )
}
