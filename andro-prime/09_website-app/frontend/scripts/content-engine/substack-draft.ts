/**
 * Substack-Draft — push a published, Ewa-signed article to Substack as a DRAFT.
 *
 * This is the owned, thin alternative to a third-party Substack MCP (vetted
 * 2026-07-26: all community MCPs ride the same unofficial cookie API and are
 * hobby-tier; we own this instead so no external code holds the founder's
 * session cookie). It implements the "future add" noted in
 * content-machine/STATE.md: a Substack renderer for the repurpose pipeline.
 *
 * WHAT IT DOES
 *   Reads a published article from blog_articles (the source of truth), assembles
 *   a SHORT founder-intro Substack issue (intro + the article's opening 1-2
 *   paragraphs verbatim + a link back to the canonical article + one conversion
 *   CTA), and creates it (or, with --update, refreshes it) as a DRAFT via
 *   Substack's unofficial API. It prints the draft edit URL. A human reviews and
 *   publishes from the Substack editor.
 *
 * DRAFT-ONLY BY DESIGN. There is deliberately NO publish/schedule/delete call in
 * this file. Publishing health copy is a human action gated on:
 *   1. /compliance-preflight passing on the assembled issue (every issue is an ad); and
 *   2. Keith's publish click in the Substack editor.
 * Do not add a publish path here. If you need to publish, do it in the UI.
 *
 * REPUBLISH-SAFE (social-channel-setup.md): only a PUBLISHED article may be
 * repurposed (no net-new health content ahead of the indexed blog), and the issue
 * reference-links back to the canonical URL so we never out-rank our own page.
 *
 * ROUTING: the CTA drives to a conversion destination (the new "content drives to
 * the site/LPs" positioning, 2026-07-26). Default is /test-selector (safe,
 * multi-kit); pass --dest /lp/<x> for a topic-matched landing page.
 *
 * AUTH (secrets — never commit; put in frontend/.env.local):
 *   SUBSTACK_SESSION_TOKEN   the `substack.sid` cookie value (Substack's session
 *                            cookie; older docs call it `connect.sid`, but in the
 *                            browser it is named `substack.sid`). Copy the FULL value
 *                            including the `s%3A` prefix, as-is (do not URL-decode).
 *                            Equivalent to a password: full account access. Expires
 *                            ~90 days; if a call 401s, refresh it from a browser.
 *   SUBSTACK_USER_ID         optional. Numeric byline user id; if omitted it is
 *                            auto-resolved from /api/v1/publication/users at send.
 *   SUBSTACK_PUBLICATION_URL optional; defaults to https://keithandroprime.substack.com
 *
 * USAGE (from 09_website-app/frontend):
 *   npx tsx scripts/content-engine/substack-draft.ts --slug free-androgen-index --dry
 *   npx tsx scripts/content-engine/substack-draft.ts --slug free-androgen-index --dest /lp/testosterone
 *
 * FLAGS
 *   --slug <slug>        required. The published article to repurpose.
 *   --dest <url|path>    conversion CTA target. Full URL, or a site path. In Git
 *                        Bash on Windows a leading-slash path (/lp/x) gets mangled
 *                        into a Windows path by MSYS, so pass it WITHOUT the leading
 *                        slash (--dest lp/testosterone) or as a full URL, or run from
 *                        PowerShell. Default (no flag): /test-selector/.
 *   --title <text>       override the Substack issue title (default: article title).
 *   --intro <text>      override the founder intro paragraph.
 *   --update <draftId>   refresh an existing draft in place (PUT) instead of
 *                        creating a new one. Use the numeric id from the draft URL.
 *   --publication <url>  override the Substack publication base URL.
 *   --force              allow repurposing a non-published article (bypasses the
 *                        republish-safe guard). Use only with a reason.
 *   --dry                assemble + print the payload; send NOTHING.
 */
import { loadEnvLocal, requireEnv, admin, logRun } from './_shared'

loadEnvLocal()

const SITE_BASE = 'https://andro-prime.com'
const DEFAULT_PUBLICATION = 'https://keithandroprime.substack.com'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined
}
const has = (name: string) => process.argv.includes(`--${name}`)
const DRY = has('dry')
const FORCE = has('force')

/** Resolve a path or URL to an absolute URL, then append UTM params. */
function withUtm(target: string, campaign: string, medium = 'newsletter'): string {
  const abs = target.startsWith('http') ? target : `${SITE_BASE}${target.startsWith('/') ? '' : '/'}${target}`
  const u = new URL(abs)
  u.searchParams.set('utm_source', 'substack')
  u.searchParams.set('utm_medium', medium)
  u.searchParams.set('utm_campaign', campaign)
  return u.toString()
}

// --- Minimal ProseMirror builders (Substack's native draft_body format) ---
type Node = Record<string, unknown>
const t = (text: string, marks?: Node[]): Node => (marks ? { type: 'text', text, marks } : { type: 'text', text })
const linkText = (text: string, href: string): Node => t(text, [{ type: 'link', attrs: { href } }])
const para = (...content: Node[]): Node => ({ type: 'paragraph', content })
const doc = (...content: Node[]): Node => ({ type: 'doc', content })

/** Pull the first `maxParas` prose paragraphs from the article's MDX body, verbatim,
 *  to use as the Substack teaser (real substance, and already-Ewa-cleared copy so it
 *  inherits the article's sign-off). Skips headings, MDX components, blockquotes, code
 *  fences and imports; flattens markdown links/emphasis to plain text so the
 *  ProseMirror body stays simple. */
function extractTeaser(mdxBody: string, maxParas: number): string[] {
  const out: string[] = []
  for (const raw of mdxBody.split(/\n\s*\n/)) {
    const b = raw.trim()
    if (!b) continue
    if (/^(#|<|\{|>|\||```|---|import\s|export\s)/.test(b)) continue
    const s = b
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links -> visible text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
      .replace(/\*([^*]+)\*/g, '$1') // italic
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/\s+/g, ' ')
      .trim()
    if (s.length < 40) continue // skip stray short lines that aren't real paragraphs
    out.push(s)
    if (out.length >= maxParas) break
  }
  return out
}

async function main() {
  const slug = arg('slug')
  if (!slug) {
    console.error('Missing --slug. Usage: substack-draft.ts --slug <slug> [--dest lp/x] [--update <draftId>] [--title ..] [--intro ..] [--dry]')
    process.exitCode = 1
    return
  }

  const publication = (arg('publication') || process.env.SUBSTACK_PUBLICATION_URL || DEFAULT_PUBLICATION).replace(/\/$/, '')

  // Pull the article from the source of truth.
  const { data: article, error } = await admin()
    .from('blog_articles')
    .select('slug, status, frontmatter, published_at, body')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(`read blog_articles: ${error.message}`)
  if (!article) {
    console.error(`No blog_articles row for slug '${slug}'.`)
    process.exitCode = 1
    return
  }

  // Republish-safe: published articles only (no net-new health content ahead of the blog).
  if (article.status !== 'published' && !FORCE) {
    console.error(
      `REFUSED: '${slug}' is status='${article.status}', not 'published'. ` +
        `The republish-safe rule allows only published, Ewa-signed articles on Substack. ` +
        `Pass --force only if you have a specific reason.`
    )
    process.exitCode = 2
    return
  }

  const fm = (article.frontmatter ?? {}) as Record<string, string>
  const title = arg('title') || fm.title || slug
  const excerpt = fm.excerpt || ''
  // Substack rejects an over-long subtitle (~200 char cap). Truncate at a word boundary.
  const SUB_MAX = 200
  const subtitle =
    excerpt.length > SUB_MAX ? excerpt.slice(0, SUB_MAX - 1).replace(/\s+\S*$/, '').trimEnd() + '…' : excerpt
  const canonical = withUtm(`/blog/${slug}`, slug)
  const dest = withUtm(arg('dest') || '/test-selector/', slug)

  const intro =
    arg('intro') ||
    "A quick one from me. Here's the short version of a guide I put together on this, and where to start if it sounds like you."

  // Body = founder intro, then the article's opening 1-2 paragraphs VERBATIM (the
  // teaser: real substance, already-Ewa-cleared, inherits the article's sign-off),
  // then the link back to the full guide, one conversion CTA, and the disclaimer.
  // Excerpt is the Substack subtitle (deck under the title), so it's not repeated here.
  const teaser = extractTeaser((article.body as string) || '', 2)
  const bodyDoc = doc(
    para(t(intro)),
    ...teaser.map((pt) => para(t(pt))),
    para(linkText(`Read the full guide: ${title}`, canonical)),
    para(linkText('Find out where you stand: take the 2-minute test selector', dest)),
    para(t('Education, not medical advice. Always speak to your GP about your health.'))
  )

  const payload: Record<string, unknown> = {
    draft_title: title,
    draft_subtitle: subtitle,
    draft_body: JSON.stringify(bodyDoc),
    audience: 'everyone',
    type: 'newsletter',
  }
  // draft_bylines is REQUIRED by Substack; it's resolved in the live path below
  // (env override, else auto-discovered from the publication's users list).

  if (DRY) {
    console.log('[dry] substack-draft (no request sent)')
    console.log('  publication:', publication)
    console.log('  title:      ', title)
    console.log('  subtitle:   ', subtitle)
    console.log('  canonical:  ', canonical)
    console.log('  cta dest:   ', dest)
    console.log('  byline id:  ', process.env.SUBSTACK_USER_ID || '(auto-resolved from /api/v1/publication/users at send)')
    console.log('  teaser:     ', teaser.length, 'paragraph(s) pulled from the article')
    teaser.forEach((pt, i) => console.log(`    [${i + 1}] ${pt.slice(0, 110)}${pt.length > 110 ? '…' : ''}`))
    console.log('  mode:       ', arg('update') ? `UPDATE draft ${arg('update')}` : 'CREATE new draft')
    console.log('  body nodes: ', (bodyDoc.content as Node[]).length, 'paragraphs')
    console.log('\n[dry] Next: run /compliance-preflight on this copy, then re-run without --dry to create the DRAFT.')
    return
  }

  const token = requireEnv('SUBSTACK_SESSION_TOKEN')
  // Browser-like UA: Substack's Cloudflare can reject bare non-browser requests.
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
  // substack.sid is the session cookie; connect.sid sent too for parity with older clients.
  const cookie = `connect.sid=${token}; substack.sid=${token}`

  // Resolve the required byline user id: env override, else auto-discover from the
  // publication's users list (a solo founder publication returns exactly one).
  let userId = process.env.SUBSTACK_USER_ID
  if (!userId) {
    const ures = await fetch(`${publication}/api/v1/publication/users`, {
      headers: { Cookie: cookie, 'User-Agent': UA, Accept: 'application/json' },
    })
    if (ures.ok) {
      try {
        const users = JSON.parse(await ures.text())
        const first = Array.isArray(users) ? users[0] : users
        const id = (first?.user_id ?? first?.id) as unknown
        if (typeof id === 'number') userId = String(id)
      } catch {
        /* fall through to the error below */
      }
    }
    if (!userId) {
      console.error(
        'Could not auto-resolve the Substack user id from /api/v1/publication/users. ' +
          'Set SUBSTACK_USER_ID in .env.local (the numeric byline id) and re-run.'
      )
      process.exitCode = 1
      return
    }
  }
  payload.draft_bylines = [{ id: Number(userId), is_guest: false }]

  // --update <id> refreshes an existing draft in place (PUT); otherwise create (POST).
  // Both are draft-only: neither publishes.
  const updateId = arg('update')
  const res = await fetch(
    updateId ? `${publication}/api/v1/drafts/${updateId}` : `${publication}/api/v1/drafts`,
    {
      method: updateId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie, 'User-Agent': UA },
      body: JSON.stringify(payload),
    }
  )

  const text = await res.text()
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      console.error(
        `Substack rejected the request (${res.status}). The session token is likely expired ` +
          `(they last ~90 days) or blocked by Cloudflare. Refresh SUBSTACK_SESSION_TOKEN from a logged-in browser.`
      )
    }
    await logRun({ agent: 'substack-draft', itemRef: slug, status: 'error', error: `${res.status}: ${text.slice(0, 300)}` })
    console.error(`Draft ${updateId ? 'update' : 'creation'} failed (${res.status}): ${text.slice(0, 500)}`)
    process.exitCode = 1
    return
  }

  let id: string | number | undefined
  try {
    id = JSON.parse(text)?.id
  } catch {
    /* leave id undefined; still a 2xx */
  }
  const draftId = id ?? updateId
  const editUrl = draftId ? `${publication}/publish/post/${draftId}` : `${publication}/publish/home`

  await logRun({
    agent: 'substack-draft',
    itemRef: slug,
    status: 'ok',
    detail: { action: updateId ? 'draft_updated' : 'draft_created', draft_id: draftId ?? null, dest, canonical },
  })

  console.log(`DRAFT ${updateId ? 'updated' : 'created'} for '${slug}' (NOT published).`)
  console.log(`  Edit / review / publish: ${editUrl}`)
  console.log(`  Before publishing: run /compliance-preflight on the issue copy (every issue is an ad).`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e))
  process.exitCode = 1
})
