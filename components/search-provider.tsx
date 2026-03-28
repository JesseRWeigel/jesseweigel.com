import { getProjects, getTransmissions, getBlogPosts } from '@/lib/content'
import { SearchOverlay } from '@/components/search-overlay'

export async function SearchProvider() {
  const [projects, transmissions, posts] = await Promise.all([
    getProjects(),
    getTransmissions(),
    getBlogPosts(),
  ])
  return <SearchOverlay projects={projects} transmissions={transmissions} posts={posts} />
}
