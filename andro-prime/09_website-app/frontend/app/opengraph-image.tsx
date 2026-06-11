import { ImageResponse } from 'next/og'
import { LOGO_LOCKUP_DARK_DATA_URI } from '@/components/shared/logoArt'

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

        {/* headline — two stacked lines. satori requires display:flex on any
            div with more than one child, so the lines are explicit flex rows
            inside a column (a bare `{'\n'}` split throws "Expected <div> to
            have explicit display: flex"). */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '88px',
            fontWeight: 900,
            color: 'black',
            textTransform: 'uppercase',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            marginBottom: '36px',
          }}
        >
          <div style={{ display: 'flex' }}>Stop guessing.</div>
          <div style={{ display: 'flex' }}>Start knowing.</div>
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
          UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. No GP needed.
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_LOCKUP_DARK_DATA_URI} width={207} height={44} alt="Andro Prime" />
          <span style={{ fontSize: '18px', color: '#777777', fontWeight: 600 }}>
            andro-prime.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
