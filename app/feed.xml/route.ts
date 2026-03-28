import { getBlogPosts } from '@/lib/content'

export async function GET() {
  const posts = await getBlogPosts()

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://jesseweigel.com/log/${post.slug}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>https://jesseweigel.com/log/${post.slug}</guid>
    </item>`
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jesse Weigel — The Observatory</title>
    <link>https://jesseweigel.com</link>
    <description>Dispatches from the observatory — projects, experiments, and captain's log entries.</description>
    <language>en-us</language>
    <atom:link href="https://jesseweigel.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
