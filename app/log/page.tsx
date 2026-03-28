import { getBlogPosts } from '@/lib/content'
import { BlogPostCard } from '@/components/blog-post-card'

export const metadata = {
  title: 'Log',
  description: "Captain's log — thoughts, updates, and dispatches from Jesse Weigel.",
}

export default async function LogPage() {
  const posts = await getBlogPosts()
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight">Log</h1>
      <p className="mt-2 text-muted-foreground">Dispatches from the observatory.</p>
      <div className="mt-10">
        {posts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
      </div>
      {posts.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">No log entries yet.</p>
      )}
    </main>
  )
}
