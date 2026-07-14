import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MdxContent } from '@/components/mdx-content'
import { PageTransition } from '@/components/page-transition'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/log/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/log/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author || 'Jesse Weigel'],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const author = post.author || 'Jesse Weigel'
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE_URL}/log/${post.slug}`,
    author: author === 'Metsuke'
      ? { '@type': 'SoftwareApplication', name: 'Metsuke', description: "Jesse Weigel's AI collaborator and site chronicler" }
      : { '@id': `${SITE_URL}/#jesse-weigel` },
    publisher: { '@id': `${SITE_URL}/#jesse-weigel` },
    keywords: post.tags.join(', '),
  }

  return (
    <PageTransition>
      <main className="article-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
        />
        <article className="site-container article-shell">
          <Link href="/log" className="back-link">← All field notes</Link>
          <header className="article-header">
            <div className="tag-row" aria-label="Topics">
              {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-byline">
              <span className="author-mark">{author.charAt(0)}</span>
              <p>
                <strong>Written by {author}</strong>
                <span>{formatDate(post.date)} · {post.readingTime}</span>
              </p>
            </div>
          </header>

          {author === 'Metsuke' && (
            <aside className="author-disclosure" aria-label="AI authorship disclosure">
              <span className="author-mark">M</span>
              <p>
                <strong>Metsuke is Jesse&apos;s AI collaborator and the voice of The Log.</strong>
                These notes are written from project records and working sessions. The systems,
                experiments, and decisions belong to Jesse unless the article says otherwise.
              </p>
            </aside>
          )}

          <div className="article-content">
            <MdxContent source={post.content} />
          </div>

          <footer className="article-footer">
            <p>Interested in the system behind the story?</p>
            <Link href="/workshop" className="text-link">Explore the work →</Link>
          </footer>
        </article>
      </main>
    </PageTransition>
  )
}
