import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { AuthorSlug } from '@/lib/authors'
import { slugify } from '@/lib/slug'

const contentDir = path.join(process.cwd(), 'content/blog')

export interface ArticleFaqItem {
  q: string
  a: string
}

export interface ArticleFrontmatter {
  title: string
  excerpt: string
  category: string
  // date: display string (e.g. "12 Oct 2026"). Used for human-readable byline + falls back as ISO source for schema if no isoDate provided.
  date: string
  // ISO-8601 publication date. Optional — if absent, `date` is used in schema datePublished.
  isoDate?: string
  // dateModified: optional ISO-8601 string. If absent, falls back to isoDate / date in schema.
  dateModified?: string
  // authorSlug: required for new articles. Falls back to legacy `author` field on pre-migration content.
  authorSlug?: AuthorSlug
  // reviewerSlug: required for all health articles. Omit for non-health content.
  reviewerSlug?: AuthorSlug
  // Legacy byline fields. Retained as fallback while pre-migration articles still ship.
  author?: string
  initials?: string
  dark: boolean
  readTime: string
  featured?: boolean
  // imgSrc/imgAlt: legacy + OG override. When imgSrc is set it overrides the social
  // og:image (otherwise the generated /api/og card is used). Kept separate from the
  // editorial photo below so the branded share card stays the default social image.
  imgSrc?: string
  imgAlt?: string
  // Editorial photo (Unsplash). Powers the on-site listing card + in-body hero ONLY —
  // the social og:image deliberately stays the branded generated card. photoCredit +
  // photoCreditUrl are MANDATORY whenever photoSrc is set (Unsplash ToS attribution);
  // photoCreditUrl holds the raw photographer profile URL (UTM appended at render).
  photoSrc?: string
  photoAlt?: string
  photoCredit?: string
  photoCreditUrl?: string
  // faq: when set, populates inline FAQ block in ArticleLayout + FAQPage schema in [slug]/page.tsx.
  faq?: ArticleFaqItem[]
  // toc: explicit override. When undefined, TOC auto-shows for posts > 1500 words.
  toc?: boolean
  // status: publication gate. Only 'published' articles are visible in production.
  // Anything else (incl. absent) is treated as a draft and hidden — a forgotten flag
  // fails safe (stays hidden) rather than accidentally going live. Drips are driven by
  // the content calendar: flipping this to 'published' (+ stamping the date) publishes it.
  status?: 'draft' | 'published'
}

// Drafts are visible on localhost / preview builds so unpublished articles can be
// reviewed, but hidden in production until their status is flipped to 'published'.
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production'

export function isPublished(fm: Pick<ArticleFrontmatter, 'status'>): boolean {
  return fm.status === 'published'
}

// Whether an article should render at all in the current environment.
// Production: published-only. Dev/preview: everything (drafts included).
export function isVisible(fm: Pick<ArticleFrontmatter, 'status'>): boolean {
  return SHOW_DRAFTS || isPublished(fm)
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
}

export interface ArticleFile {
  content: string
  frontmatter: ArticleFrontmatter
  wordCount: number
}

// Word-count helper. Strips MDX/JSX tags + frontmatter-style markup before counting.
// Used to decide whether TOC auto-renders (threshold: 1500 words).
export function countWords(mdxBody: string): number {
  const stripped = mdxBody
    // remove JSX/MDX components (matches both <Foo .../> and <Foo>...</Foo>)
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    // remove fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // remove inline code
    .replace(/`[^`]*`/g, ' ')
    // remove markdown links — keep label text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // remove markdown headings/emphasis markers
    .replace(/[#*_>~]/g, ' ')
  const tokens = stripped.split(/\s+/).filter(Boolean)
  return tokens.length
}

// Extract H2 headings from MDX body for the TOC.
// Slug generation mirrors what rehype-slug + GitHub-style slugger produces (lowercase, hyphenated, alpha-numeric only).
export interface TocHeading {
  id: string
  text: string
}

export function extractH2Headings(mdxBody: string): TocHeading[] {
  // Strip fenced code blocks so ## inside code doesn't count.
  const sansCode = mdxBody.replace(/```[\s\S]*?```/g, '')
  const lines = sansCode.split(/\r?\n/)
  const headings: TocHeading[] = []
  const seen: Record<string, number> = {}

  const push = (baseSlug: string, text: string) => {
    let id = baseSlug
    if (seen[baseSlug] != null) {
      seen[baseSlug] += 1
      id = `${baseSlug}-${seen[baseSlug]}`
    } else {
      seen[baseSlug] = 0
    }
    headings.push({ id, text })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Markdown H2 sections.
    const match = /^##\s+(.+?)\s*$/.exec(line)
    if (match) {
      // Strip inline markdown emphasis + HTML entities from heading text for display.
      const rawText = match[1].replace(/[*_`]/g, '').trim()
      push(slugify(rawText), rawText)
      continue
    }

    // <SystemAlert title="..."> GP-referral callout. The opening tag may span
    // several lines, so scan forward to the title or the end of the tag.
    if (/^<SystemAlert\b/.test(line.trim())) {
      let title: string | undefined
      for (let j = i; j < lines.length && j < i + 8; j++) {
        const m = /title="([^"]+)"/.exec(lines[j])
        if (m) {
          title = m[1]
          break
        }
        if (/>/.test(lines[j])) break
      }
      if (title) {
        // TOC label drops the ", not us" qualifier; the id keeps the full title
        // so it matches SystemAlert's slugify(title) anchor.
        push(slugify(title), title.split(',')[0].trim())
      }
      continue
    }

    // <References> source box — fixed "references" anchor.
    if (/^<References\b/.test(line.trim())) {
      push('references', 'References')
      continue
    }
  }
  return headings
}

// YAML auto-parses unquoted `2026-05-27` as a JS Date object, which breaks React rendering
// ("Objects are not valid as a React child"). Coerce date-shaped fields to ISO strings so
// the renderer always receives strings regardless of how the MDX author quoted them.
function normalizeFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  const out = { ...data }
  for (const key of ['date', 'dateModified', 'isoDate'] as const) {
    const v = out[key]
    if (v instanceof Date) out[key] = v.toISOString().slice(0, 10)
  }
  return out as unknown as ArticleFrontmatter
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(contentDir)
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8')
      const { data } = matter(raw)
      return { slug: f.replace('.mdx', ''), ...normalizeFrontmatter(data) }
    })
    // Publication gate — hides drafts in production. Single chokepoint: every
    // consumer (listings, article route, author pages, sitemap, OG images) inherits it.
    .filter((a) => isVisible(a))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticle(slug: string): ArticleFile {
  const file = path.join(contentDir, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf-8')
  const { content, data } = matter(raw)
  return {
    content,
    frontmatter: normalizeFrontmatter(data),
    wordCount: countWords(content),
  }
}

// Whether the TOC should render for this article.
// Rule: explicit frontmatter `toc` wins. Otherwise auto-show when word count > 1500.
export function shouldShowToc(frontmatter: ArticleFrontmatter, wordCount: number): boolean {
  if (typeof frontmatter.toc === 'boolean') return frontmatter.toc
  return wordCount > 1500
}
