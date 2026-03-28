import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

function toStardate(dateStr: string): string {
  const d = new Date(dateStr)
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return `${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group border-b border-white/5 py-6 first:pt-0 last:border-0">
      <Link href={`/log/${post.slug}`} className="block">
        <p className="font-mono text-xs text-muted-foreground">
          ★ {toStardate(post.date)} &middot; {post.readingTime}
        </p>
        <h3 className="mt-1 text-xl font-medium text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      </Link>
    </article>
  )
}
