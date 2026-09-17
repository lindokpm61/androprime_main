/**
 * DO A STATIC CONSUMER AND A DYNAMIC CONSUMER AGREE ABOUT THE MEMBERSHIP?
 *
 *   npx tsx scripts/verify-flag-parity.ts --base https://andro-prime.com
 *   npx tsx scripts/verify-flag-parity.ts --base http://localhost:3000
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * `MEMBERSHIP_ENABLED` is read per request at every call site, which is correct
 * and is NOT sufficient. Six of the nine consumers of `subscriptionCopy.ts` are
 * `○ (Static)` — `/`, `/kits`, `/about`, `/how-it-works` and the `/lp/*` pages —
 * so the flag is evaluated during `next build` there. Set the variable and
 * restart, and those six keep serving whatever the last BUILD baked while the
 * three dynamic consumers switch immediately.
 *
 * That is not a theory. With the flag true and the server restarted but not
 * rebuilt, `/kits` served the flag-OFF heading "One price." while
 * `/kits/testosterone`, one click away, served flag-ON copy: two states of one
 * site, on the page that takes the money, which is exactly the coexistence the
 * P9 interlock exists to forbid — arriving through the deploy mechanism instead
 * of through the copy.
 *
 * ⚠ NOTHING IN THE REPO CAN SEE THIS. The interlock reads SOURCE, and in source
 * every call site is right. `verify-env-contract.js` assertion H now forces the
 * flag to be MOUNTED, so a Coolify build argument has somewhere to land — but a
 * mount is not a value, and only the served bytes prove the two halves agree.
 * This script reads the served bytes.
 *
 * ── WHAT IT DOES NOT ASSUME ───────────────────────────────────────────────
 * The marker strings are not typed here. They are computed by calling
 * `subscriptionCopy(true)` and `subscriptionCopy(false)` and taking the strings
 * that appear in exactly one of the two payloads, so this cannot pass by
 * agreeing with its author, and a copy revision moves the markers automatically.
 * Same rule as `test-standing-claim.ts`, whose fixtures are read from other
 * files rather than restated.
 *
 * Exit 0 = both surfaces agree, and the verdict says which state they agree on.
 * Exit 1 = they disagree, or either one is indeterminate. An indeterminate page
 * is a failure and not a pass: it means this script could not tell, which is the
 * one answer that must never be reported as agreement.
 */
import { subscriptionCopy } from '../lib/membership/subscriptionCopy'

type State = 'on' | 'off' | 'indeterminate'

const DEFAULT_STATIC = '/kits'
const DEFAULT_DYNAMIC = '/kits/testosterone'

/** Long enough that an accidental substring match is not plausible. */
const MIN_MARKER_LENGTH = 14

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? undefined : process.argv[i + 1]
}

/** Typographic variants and entities differ between source and served HTML. */
function normalise(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&pound;/g, '£')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
}

/** Every string in the payload, arrays flattened. */
function strings(payload: unknown): string[] {
  const out: string[] = []
  const walk = (v: unknown) => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(payload)
  return out
}

/**
 * Strings present in one payload and absent from the other.
 *
 * ⚠ DIFFERENT IS NOT ENOUGH — A MARKER MUST ALSO BE UNCONTAINED. The flag-on
 * and flag-off copy are edits of each other, so one side's string is routinely a
 * SUBSTRING of the other's: the flag-on FAQ answer is "Results in your personal
 * dashboard. No GP needed." and the flag-off one is that exact sentence with
 * "One-off purchase." in front. A page serving the flag-OFF string therefore
 * matches the flag-ON marker too, and a genuinely OFF page gets reported as
 * matching BOTH — which this script calls indeterminate.
 *
 * Caught on the first real negative test rather than by reading the code: the
 * split was detected and exit 1 was correct, but the REASON was wrong, and a
 * checker that fails for the wrong reason sends the reader to the wrong repair.
 *
 * ⚠ AND THE OBVIOUS FIX WAS WRONG TOO — dropping every contained marker here
 * made the flag-ON dynamic page unclassifiable, because that suffix is the ONLY
 * string distinguishing the two states on `/kits/testosterone`. Discarding it
 * discards the page's sole evidence. Containment is therefore resolved at MATCH
 * time in `classify()`, where both strings are known to be present or absent:
 * the longer match wins, which is the only reading consistent with both pages.
 */
function payloadStrings(): { on: string[]; off: string[] } {
  return {
    on: strings(subscriptionCopy(true)).map(normalise),
    off: strings(subscriptionCopy(false)).map(normalise),
  }
}

function exclusiveMarkers(payloads: { on: string[]; off: string[] }): { on: string[]; off: string[] } {
  const onSet = new Set(payloads.on)
  const offSet = new Set(payloads.off)
  const keep = (s: string) => s.length >= MIN_MARKER_LENGTH
  return {
    on: [...new Set(payloads.on.filter((s) => !offSet.has(s) && keep(s)))],
    off: [...new Set(payloads.off.filter((s) => !onSet.has(s) && keep(s)))],
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'user-agent': 'andro-prime-flag-parity' } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.text()
}

function classify(
  body: string,
  markers: { on: string[]; off: string[] },
  payloads: { on: string[]; off: string[] }
) {
  const text = normalise(stripTags(body))

  /* A hit is only evidence if the page does not ALSO carry a longer string from
     the opposite payload that contains it — in which case the short hit is an
     artefact of that longer string being present, not independent evidence.
     Resolved here rather than by pruning markers, because the contained string is
     sometimes the ONLY thing distinguishing the two states on a page: the flag-ON
     FAQ answer on /kits/testosterone is the flag-OFF one minus its opening
     sentence, so discarding it leaves that page unclassifiable.

     ⚠ It compares against the WHOLE opposite payload, not just the exclusive
     markers, and that distinction is load-bearing. Against exclusives alone,
     production's /kits matched the flag-ON marker "Nothing hidden" while also
     serving the flag-OFF standing claim, and reported BOTH: the containing string
     "Nothing hidden." is common to both payloads, so it was in neither exclusive
     list and could not cancel the hit it caused. */
  const cancelled = (hit: string, opposite: string[]) =>
    opposite.some((s) => s !== hit && s.includes(hit) && text.includes(s))

  const onHits = markers.on.filter((m) => text.includes(m) && !cancelled(m, payloads.off))
  const offHits = markers.off.filter((m) => text.includes(m) && !cancelled(m, payloads.on))

  let state: State = 'indeterminate'
  if (onHits.length && !offHits.length) state = 'on'
  else if (offHits.length && !onHits.length) state = 'off'
  return { state, onHits, offHits }
}

async function main() {
  const base = (arg('base') || '').replace(/\/+$/, '')
  if (!base) {
    console.error('verify-flag-parity: --base <url> is required.')
    process.exit(1)
  }
  const staticPath = arg('static') || DEFAULT_STATIC
  const dynamicPath = arg('dynamic') || DEFAULT_DYNAMIC

  const payloads = payloadStrings()
  const markers = exclusiveMarkers(payloads)
  console.log(`verify-flag-parity  ·  base ${base}`)
  console.log(
    `derived ${markers.on.length} flag-ON and ${markers.off.length} flag-OFF marker strings ` +
      `from subscriptionCopy() itself\n`
  )
  if (!markers.on.length || !markers.off.length) {
    console.error(
      'FAIL: one side produced no exclusive markers, so no page could ever be classified.\n' +
        '      The two payloads no longer differ in any string of ' +
        `${MIN_MARKER_LENGTH}+ characters — the copy changed shape and this script is stale.`
    )
    process.exit(1)
  }

  const targets = [
    { label: 'STATIC  (baked at build time)', path: staticPath },
    { label: 'DYNAMIC (read per request)', path: dynamicPath },
  ]

  const seen: { label: string; path: string; state: State }[] = []
  for (const t of targets) {
    const url = `${base}${t.path}`
    let verdict: ReturnType<typeof classify>
    try {
      verdict = classify(await fetchText(url), markers, payloads)
    } catch (e) {
      console.error(`✗ ${t.label}  ${t.path}\n    could not be read: ${(e as Error).message}`)
      process.exit(1)
    }
    const mark = verdict.state === 'indeterminate' ? '✗' : '·'
    console.log(`${mark} ${t.label}  ${t.path}`)
    console.log(`    membership copy reads: ${verdict.state.toUpperCase()}`)
    if (verdict.onHits.length) console.log(`    flag-ON  match: "${verdict.onHits[0]}"`)
    if (verdict.offHits.length) console.log(`    flag-OFF match: "${verdict.offHits[0]}"`)
    if (verdict.state === 'indeterminate') {
      console.log(
        verdict.onHits.length && verdict.offHits.length
          ? '    BOTH states matched on one page, which is worse than neither.'
          : '    Neither state matched. The page may not render this copy at all.'
      )
    }
    seen.push({ label: t.label, path: t.path, state: verdict.state })
  }

  const [s, d] = seen
  console.log('')
  if (s.state === 'indeterminate' || d.state === 'indeterminate') {
    console.error(
      'FAILED. At least one surface could not be classified, so agreement was not established.\n' +
        '  Not the same thing as the two agreeing. Do not call the flip done on this result.'
    )
    process.exit(1)
  }
  if (s.state !== d.state) {
    console.error(
      `FAILED. ${s.path} reads ${s.state.toUpperCase()} and ${d.path} reads ${d.state.toUpperCase()}.\n` +
        '  Two states of one site. The static half is stale: it carries whatever the last\n' +
        '  BUILD baked, so this is repaired by a REBUILD with MEMBERSHIP_ENABLED set as a\n' +
        '  Coolify BUILD ARGUMENT — never by changing a runtime variable and restarting.'
    )
    process.exit(1)
  }
  console.log(
    `OK — both surfaces agree: the membership is ${s.state.toUpperCase()}.\n` +
      (s.state === 'on'
        ? '  A static and a dynamic consumer were built from the same flag value.'
        : '  Nothing membership-shaped is being served. This is the shipping state.')
  )
}

main()
