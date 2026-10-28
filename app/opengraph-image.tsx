import { ImageResponse } from 'next/og'

export const alt = 'Jesse Weigel — AI systems that learn, coordinate, and survive reality'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
          padding: '76px 84px',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(241, 169, 65, 0.26) 0%, transparent 70%)',
            position: 'absolute',
            right: -40,
            bottom: -100,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#f1a941', fontFamily: 'monospace', fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: '#f1a941' }} />
          Jesse Weigel · Generative AI Engineer
        </div>
        <h1
          style={{
            maxWidth: 1010,
            fontSize: 74,
            fontWeight: 480,
            color: '#f4f1ea',
            letterSpacing: '-0.055em',
            lineHeight: 1.02,
            margin: 0,
          }}
        >
          I build AI systems that learn, coordinate, and survive contact with reality.
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#9ca2aa',
            margin: 0,
          }}
        >
          Agent systems · Evaluation infrastructure · Developer tools · Public experiments
        </p>
      </div>
    ),
    { ...size }
  )
}
