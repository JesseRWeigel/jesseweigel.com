import type { Project, Transmission, BlogPost } from './types'

export interface SearchResult {
  type: 'project' | 'transmission' | 'post'
  title: string
  description: string
  href: string
}

export function buildSearchIndex(
  projects: Project[],
  transmissions: Transmission[],
  posts: BlogPost[]
): SearchResult[] {
  const results: SearchResult[] = []

  for (const p of projects) {
    results.push({
      type: 'project',
      title: p.title,
      description: p.description,
      href: `/workshop/${p.slug}`,
    })
  }

  for (const t of transmissions) {
    const link = t.links.watch || t.links.listen || t.links.slides || t.links.spotify
    results.push({
      type: 'transmission',
      title: t.title,
      description: `${t.venue} — ${t.description}`,
      href: link || '/transmissions',
    })
  }

  for (const post of posts) {
    results.push({
      type: 'post',
      title: post.title,
      description: post.excerpt,
      href: `/log/${post.slug}`,
    })
  }

  return results
}

export function search(query: string, index: SearchResult[]): SearchResult[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return index.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  )
}
