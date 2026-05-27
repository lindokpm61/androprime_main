import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { AuthorSlug } from '@/lib/authors'

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
  imgSrc?: string
  imgAlt?: string
  // faq: when set, populates inline FAQ block in ArticleLayout + FAQPage schema in [slug]/page.tsx.
  faq?: ArticleFaqItem[]
  // toc: explicit override. When undefined, TOC auto-shows for posts > 1500 words.
  toc?: boolean
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
  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line)
    if (!match) continue
    // Strip inline markdown emphasis + HTML entities from heading text for display.
    const rawText = match[1].replace(/[*_`]/g, '').trim()
    const baseSlug = rawText
      .toLowerCase()
      .replace(/&[a-z]+;/g, ' ')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    let id = baseSlug
    if (seen[baseSlug] != null) {
      seen[baseSlug] += 1
      id = `${baseSlug}-${seen[baseSlug]}`
    } else {
      seen[baseSlug] = 0
    }
    headings.push({ id, text: rawText })
  }
  return headings
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(contentDir)
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8')
      const { data } = matter(raw)
      return { slug: f.replace('.mdx', ''), ...(data as ArticleFrontmatter) }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticle(slug: string): ArticleFile {
  const file = path.join(contentDir, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf-8')
  const { content, data } = matter(raw)
  return {
    content,
    frontmatter: data as ArticleFrontmatter,
    wordCount: countWords(content),
  }
}

// Whether the TOC should render for this article.
// Rule: explicit frontmatter `toc` wins. Otherwise auto-show when word count > 1500.
export function shouldShowToc(frontmatter: ArticleFrontmatter, wordCount: number): boolean {
  if (typeof frontmatter.toc === 'boolean') return frontmatter.toc
  return wordCount > 1500
}
