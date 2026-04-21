import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/account/',
        '/results-dashboard/',
        '/subscriptions/',
        '/founding-member-status/',
        '/lp/',
      ],
    },
    sitemap: 'https://andro-prime.com/sitemap.xml',
  }
}
