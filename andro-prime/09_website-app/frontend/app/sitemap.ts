import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog'
import { getAllAuthors } from '@/lib/authors'
import { isMembershipEnabled } from '@/lib/flags'

const BASE_URL = 'https://andro-prime.com'

// Tagged 'blog' via getAllArticles; a publish revalidates the sitemap, 1h backstop otherwise.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/kits`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/kits/testosterone`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/kits/energy-recovery`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/kits/hormone-recovery`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/supplements`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/supplements/daily-stack`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/supplements/collagen`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`,                           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/test-selector`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    // /founding-member removed from sitemap 2026-06-04 (FM take-down — low-T routing decision; page now redirects to /kits)
    { url: `${BASE_URL}/waitlist`,                      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/supplement-waitlist`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`,                         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/contact`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/privacy`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,                         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // /membership renders only when MEMBERSHIP_ENABLED is on and 404s otherwise,
  // so listing it unconditionally would publish a sitemap entry for a 404. Added
  // 2026-09-08 with the public page; it is a spoke off the kit pages' price line,
  // hence a priority below them and above the policy pages.
  if (isMembershipEnabled()) {
    staticRoutes.push({
      url: `${BASE_URL}/membership`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Author pages carry the E-E-A-T signal (Dr Ewa's GMC credentials) — surface them
  // to crawlers directly, not only via in-article byline links.
  const authorRoutes: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: `${BASE_URL}/authors/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...articleRoutes, ...authorRoutes]
}
