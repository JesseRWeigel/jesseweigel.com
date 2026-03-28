import { ImageResponse } from 'next/og'

export const alt = 'Jesse Weigel — The Observatory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f59e0b33 0%, transparent 70%)',
            position: 'absolute',
          }}
        />
        <h1
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: '#e2e8f0',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Jesse Weigel
        </h1>
        <p
          style={{
            fontSize: 24,
            color: '#f59e0b',
            fontFamily: 'monospace',
            marginTop: 12,
          }}
        >
          The Observatory
        </p>
        <p
          style={{
            fontSize: 18,
            color: '#94a3b8',
            marginTop: 8,
          }}
        >
          Generative AI Engineer · Community Builder
        </p>
      </div>
    ),
    { ...size }
  )
}
