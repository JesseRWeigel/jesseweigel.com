import { getProjects, getTransmissions, getBlogPosts, getArchiveEntries } from '@/lib/content'
import { SearchOverlay } from '@/components/search-overlay'

export async function SearchProvider() {
  const [projects, transmissions, posts, archiveEntries] = await Promise.all([
    getProjects(),
    getTransmissions(),
    getBlogPosts(),
    getArchiveEntries(),
  ])
  return <SearchOverlay projects={projects} transmissions={transmissions} posts={posts} archiveEntries={archiveEntries} />
}
