// GitHub-style slugifier. Mirrors the id output of rehype-slug so that
// hand-injected TOC anchors (SystemAlert, References) match the ids on the
// elements they jump to. Kept fs-free so it can be imported into components.
export function slugify(raw: string): string {
  return raw
    .replace(/[*_`]/g, '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
