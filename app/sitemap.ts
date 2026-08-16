import type { MetadataRoute } from 'next'
import { projects } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = ['', '/projects', '/experience', '/about'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }))

  const projectUrls = projects
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${siteConfig.url}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticUrls, ...projectUrls]
}
