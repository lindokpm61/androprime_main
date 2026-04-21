import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog'

const BASE_URL = 'https://andro-prime.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

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
    { url: `${BASE_URL}/founding-member`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/waitlist`,                      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`,                         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/contact`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/privacy`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,                         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes]
}
