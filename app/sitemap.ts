import type { MetadataRoute } from 'next'
import { getBlogPosts, getProjects } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()])
  const staticRoutes = [
    '',
    '/workshop',
    '/log',
    '/transmissions',
    '/archive',
    '/about',
    '/contact',
    '/resume',
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
      priority: route === '' ? 1 : route === '/workshop' ? 0.9 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/workshop/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/log/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
