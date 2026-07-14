import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function BlogPostCard({ post, index }: { post: BlogPost; index?: number }) {
  return (
    <article className="log-card">
      <Link href={`/log/${post.slug}`}>
        <div className="log-card-meta">
          <span>{index === undefined ? 'Field note' : String(index + 1).padStart(2, '0')}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <div className="log-card-copy">
          <div className="tag-row" aria-label="Topics">
            {post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
        <div className="log-card-footer">
          <span>{post.author || 'Jesse Weigel'} · {post.readingTime}</span>
          <span aria-hidden="true">Read note ↗</span>
        </div>
      </Link>
    </article>
  )
}
