import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxSizing: 'border-box',
          border: '8px solid black',
          position: 'relative',
        }}
      >
        {/* top eyebrow */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ width: '10px', height: '10px', background: 'black' }} />
          <span
            style={{
              fontSize: '15px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'black',
            }}
          >
            Men&apos;s health, data first
          </span>
        </div>

        {/* headline */}
        <div
          style={{
            fontSize: '88px',
            fontWeight: 900,
            color: 'black',
            textTransform: 'uppercase',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            marginBottom: '36px',
          }}
        >
          Stop guessing.{'\n'}Start knowing.
        </div>

        {/* sub */}
        <div
          style={{
            fontSize: '22px',
            color: '#555555',
            lineHeight: 1.4,
            marginBottom: '56px',
            fontStyle: 'italic',
          }}
        >
          UKAS ISO 15189 accredited lab. Results in 48 hours. No GP needed.
        </div>

        {/* footer bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '3px solid black',
            paddingTop: '28px',
          }}
        >
          <span
            style={{
              fontSize: '30px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              color: 'black',
            }}
          >
            ANDRO PRIME
          </span>
          <span style={{ fontSize: '18px', color: '#777777', fontWeight: 600 }}>
            andro-prime.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
