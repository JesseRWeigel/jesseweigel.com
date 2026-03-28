import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MdxContent } from '@/components/mdx-content'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content'

function toStardate(dateStr: string): string {
  const d = new Date(dateStr)
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return `${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/log" className="text-xs text-muted-foreground transition-colors hover:text-primary">&larr; Log</Link>
      <header className="mt-6">
        <p className="font-mono text-xs text-muted-foreground">★ {toStardate(post.date)} &middot; {post.readingTime}</p>
        <h1 className="mt-2 text-3xl font-light tracking-tight">{post.title}</h1>
      </header>
      <div className="mt-8">
        <MdxContent source={post.content} />
      </div>
    </main>
  )
}
