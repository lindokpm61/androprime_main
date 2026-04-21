import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content/blog')

export interface ArticleFrontmatter {
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  initials: string
  dark: boolean
  readTime: string
  featured?: boolean
  imgSrc?: string
  imgAlt?: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
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

export function getArticle(slug: string): { content: string; frontmatter: ArticleFrontmatter } {
  const file = path.join(contentDir, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf-8')
  const { content, data } = matter(raw)
  return { content, frontmatter: data as ArticleFrontmatter }
}
