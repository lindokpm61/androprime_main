/**
 * MDX compile-gate — replaces the safety net `next build` gave before the blog went
 * DB-backed. A malformed body only fails at render time (a live 500), so the Publisher
 * MUST clear this before flipping a draft to published. Two checks:
 *
 *   1) unknownComponents() — static: <Foo> not in the renderer allowlist would crash
 *      render with "Expected component Foo to be defined". Cheap, no deps.
 *   2) previewRenders() — dynamic: fetch the draft through the REAL production render
 *      path (the noindex preview route) and require HTTP 200. This is the truest gate
 *      — it exercises the exact Next + next-mdx-remote pipeline + every component,
 *      not an approximate in-process compile.
 */

// Keep in sync with components/marketing/articleMdx.tsx mdxComponents + BlogToc.
const ALLOWED = new Set([
  'PullQuote', 'StatBox', 'EvidenceBox', 'ClinicalInsight', 'SystemAlert',
  'PublishedEvidence', 'InlineKitCTA', 'SysHeading', 'NumberedHeading',
  'Caveat', 'References', 'Punchline', 'Note', 'BlogToc',
])

/** Capitalized JSX tags used in the body that the renderer doesn't provide. */
export function unknownComponents(body: string): string[] {
  const sansCode = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '')
  const used = new Set<string>()
  for (const m of sansCode.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) used.add(m[1])
  return [...used].filter((c) => !ALLOWED.has(c))
}

/** Render the draft via the production preview route; ok iff HTTP 200. */
export async function previewRenders(
  baseUrl: string,
  slug: string,
  previewSecret: string
): Promise<{ ok: boolean; status: number }> {
  const url = `${baseUrl.replace(/\/$/, '')}/blog/preview/${slug}?token=${encodeURIComponent(previewSecret)}`
  const res = await fetch(url, { redirect: 'manual' })
  return { ok: res.status === 200, status: res.status }
}

export interface CompileGateResult {
  ok: boolean
  errors: string[]
}

/** Full pre-publish gate: static component check + real-render check. */
export async function compileGate(args: {
  slug: string
  body: string
  baseUrl: string
  previewSecret: string
}): Promise<CompileGateResult> {
  const errors: string[] = []

  for (const c of unknownComponents(args.body)) {
    errors.push(`unknown MDX component <${c}> (not in renderer allowlist)`)
  }

  try {
    const r = await previewRenders(args.baseUrl, args.slug, args.previewSecret)
    if (!r.ok) errors.push(`preview render returned HTTP ${r.status} (body would break at render)`)
  } catch (e) {
    errors.push(`preview render request failed: ${(e as Error).message}`)
  }

  return { ok: errors.length === 0, errors }
}
