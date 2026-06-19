import { ImageResponse } from 'next/og'
import { getArticle } from '@/lib/blog'
import { getAuthor } from '@/lib/authors'
import { LOGO_LOCKUP_DARK_DATA_URI } from '@/components/shared/logoArt'

const size = { width: 1200, height: 630 }

// The OG image depends on the ?variant query param, so it renders per request
// (reading request.url). Cheap to regenerate; social + browser caches absorb
// repeat hits. No build-time DB dependency.
export const dynamic = 'force-dynamic'

// Headline sizing: heavy display titles scale down as length grows so they
// always fit inside the 1200×630 canvas.
function titleFontSize(title: string): number {
  const len = title.length
  if (len <= 40) return 88
  if (len <= 70) return 72
  if (len <= 110) return 60
  return 50
}

// Card-variant category sizing. Width-fit so any category fills (but doesn't
// overflow) the canvas. Raw inside width = 1200 - 80*2 padding - 8*2 border ≈ 1024px;
// we use 950 to leave ~74px of breathing room. Inter Black at -0.03em tracking
// renders ~0.72 × font-size per character on average (measured empirically;
// uppercase letters like M/N/O/D are wider than W/Y averages). Capped at 200px
// so short categories don't dominate the canvas.
function categoryFontSize(category: string): number {
  const availableWidth = 950
  const charWidthRatio = 0.72
  const ideal = availableWidth / (category.length * charWidthRatio)
  return Math.min(200, Math.floor(ideal))
}

// Fetch a single weight of a Google-hosted font as an ArrayBuffer.
// next/og's ImageResponse (via @vercel/og + satori) parses TTF/OTF/WOFF but
// NOT WOFF2 (rejected with "Unsupported OpenType signature wOF2"). Modern UAs
// get woff2 from Google; IE-era UAs get EOT (also unsupported). The sweet
// spot is iOS-5-era WebKit, which Google serves WOFF for. We hit the v1 css
// endpoint (not css2) because its older response includes format() declarations.
async function loadGoogleFont(family: string, weight: number, italic = false): Promise<ArrayBuffer> {
  const familyParam = family.replace(/ /g, '+')
  const axis = italic ? `${weight}italic` : `${weight}`
  const cssUrl = `https://fonts.googleapis.com/css?family=${familyParam}:${axis}`
  const css = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46',
    },
  }).then((r) => r.text())
  const match = css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]?woff['"]?\)/)
  if (!match) throw new Error(`Could not extract WOFF URL for ${family} ${weight}`)
  return fetch(match[1]).then((r) => r.arrayBuffer())
}

// Brand-spec fonts (brand-guidelines.md §4):
//   - Inter 900: headlines + wordmark
//   - JetBrains Mono 700: data labels / eyebrows
//   - Merriweather italic 400: pull-quote / byline
// Loaded in parallel; resolved once per server lifetime then closed over.
let fontsPromise: Promise<
  Array<{ name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: 'normal' | 'italic' }>
> | null = null
function getBrandFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont('Inter', 900),
      loadGoogleFont('JetBrains Mono', 700),
      loadGoogleFont('Merriweather', 400, true),
    ]).then(([inter, mono, merri]) => [
      { name: 'Inter', data: inter, weight: 900 as const, style: 'normal' as const },
      { name: 'JetBrains Mono', data: mono, weight: 700 as const, style: 'normal' as const },
      { name: 'Merriweather', data: merri, weight: 400 as const, style: 'italic' as const },
    ])
  }
  return fontsPromise
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const variant = new URL(req.url).searchParams.get('variant') === 'card' ? 'card' : 'social'

  let title = 'Andro Prime'
  let category = "Men's health, data first"
  let authorName: string | undefined
  let reviewerName: string | undefined

  const article = await getArticle(slug)
  if (article) {
    const { frontmatter } = article
    title = frontmatter.title
    if (frontmatter.category) category = frontmatter.category
    const author = frontmatter.authorSlug ? getAuthor(frontmatter.authorSlug) : undefined
    authorName = author?.name ?? frontmatter.author
    const reviewer = frontmatter.reviewerSlug ? getAuthor(frontmatter.reviewerSlug) : undefined
    reviewerName = reviewer?.name
  }

  const fonts = await getBrandFonts()

  if (variant === 'card') {
    return new ImageResponse(<CardHero category={category} />, { ...size, fonts })
  }

  const byline = [
    authorName ? `By ${authorName}` : null,
    reviewerName ? `Reviewed by ${reviewerName}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  return new ImageResponse(
    <SocialOg title={title} category={category} byline={byline} />,
    { ...size, fonts }
  )
}

function SocialOg({ title, category, byline }: { title: string; category: string; byline: string }) {
  return (
    <Frame justify="flex-end">
      <Eyebrow label={category} />

      <div
        style={{
          fontFamily: 'Inter',
          fontSize: `${titleFontSize(title)}px`,
          fontWeight: 900,
          color: 'black',
          textTransform: 'uppercase',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          marginBottom: '36px',
          display: 'flex',
        }}
      >
        {title}
      </div>

      {byline ? (
        <div
          style={{
            fontFamily: 'Merriweather',
            fontSize: '22px',
            fontStyle: 'italic',
            color: '#4B5563',
            lineHeight: 1.4,
            marginBottom: '48px',
            display: 'flex',
          }}
        >
          {byline}
        </div>
      ) : (
        <div style={{ marginBottom: '48px' }} />
      )}

      <BrandFooter />
    </Frame>
  )
}

// Brand-only treatment used when the blog-list card already shows the article
// title + category in HTML. The hero's job here is to differentiate cards
// visually (per-category) and establish brand pattern, not repeat content.
function CardHero({ category }: { category: string }) {
  return (
    <Frame justify="space-between">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_LOCKUP_DARK_DATA_URI} width={169} height={36} alt="Andro Prime" />
      </div>

      <div
        style={{
          fontFamily: 'Inter',
          fontSize: `${categoryFontSize(category)}px`,
          fontWeight: 900,
          color: 'black',
          textTransform: 'uppercase',
          lineHeight: 0.85,
          letterSpacing: '-0.03em',
          display: 'flex',
        }}
      >
        {category}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderTop: '2px solid black',
          paddingTop: '24px',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'black',
            textTransform: 'uppercase',
          }}
        >
          Research &amp; Analysis
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#4B5563',
            textTransform: 'uppercase',
          }}
        >
          andro-prime.com
        </span>
      </div>
    </Frame>
  )
}

function Eyebrow({ label }: { label: string }) {
  return (
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
      <div style={{ width: '8px', height: '8px', background: 'black' }} />
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '14px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'black',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// Card frame: 8px black border around the whole canvas, with gray-200 (#E5E7EB)
// inset bars hugging the left and right edges. Implemented as a horizontal
// flex row [bar | content column | bar] because satori is unreliable with
// absolute-positioned empty divs — making the bars genuine flex children
// guarantees they stretch to full canvas height.
function Frame({
  children,
  justify,
}: {
  children: React.ReactNode
  justify: 'flex-end' | 'space-between'
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        background: 'white',
        border: '8px solid black',
        boxSizing: 'border-box',
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      <div style={{ width: '14px', background: '#E5E7EB', display: 'flex' }} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: justify,
          padding: '80px',
          // Satori needs an explicit alignItems on column flex containers to
          // stop children from defaulting to stretch and blowing out widths.
          alignItems: 'flex-start',
        }}
      >
        {children}
      </div>
      <div style={{ width: '14px', background: '#E5E7EB', display: 'flex' }} />
    </div>
  )
}

function BrandFooter() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderTop: '2px solid black',
        paddingTop: '24px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_LOCKUP_DARK_DATA_URI} width={207} height={44} alt="Andro Prime" />
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#4B5563',
          textTransform: 'uppercase',
        }}
      >
        andro-prime.com
      </span>
    </div>
  )
}
